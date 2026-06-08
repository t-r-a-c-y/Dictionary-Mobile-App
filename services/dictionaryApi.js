// services/dictionaryApi.js
// All network access to the Free Dictionary API lives here so screens stay
// focused on rendering. Responsibilities:
//   1. Make the axios GET request.
//   2. Normalize the (sometimes messy) response into a single, safe shape.
//   3. Translate any failure into a friendly, user-facing ApiError.
import axios from 'axios';
import {
  API_BASE_URL,
  MAX_RETRIES,
  REQUEST_TIMEOUT,
  RETRY_DELAY,
} from '../constants/config';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * A typed error carrying an HTTP-ish status so the UI can react (e.g. 404).
 * status meanings: 404 = not found, 0 = network/validation, -1 = unexpected.
 */
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Flatten the API's array-of-entries into one predictable object.
 * Defensive throughout: any field can be missing or malformed without crashing.
 *
 * @returns {{ word, phonetic, audioUrl, audios, meanings }}
 *   audios = array of { url, label } for every available pronunciation.
 */

// Derive a friendly region label (US/UK/AU…) from an audio URL when possible.
function audioLabel(url, fallbackIndex) {
  const m = url.match(/-(us|uk|au|ca|in|gb)\.mp3(\?|$)/i);
  if (m) return m[1].toUpperCase();
  return `Audio ${fallbackIndex + 1}`;
}

function normalize(rawEntries, fallbackWord) {
  const entries = Array.isArray(rawEntries) ? rawEntries : [];

  let phonetic = '';
  const audios = [];        // all distinct pronunciations
  const seenAudio = new Set();
  const meanings = [];

  for (const entry of entries) {
    if (!entry || typeof entry !== 'object') continue;

    // Top-level phonetic string (e.g. "/həˈloʊ/").
    if (!phonetic && typeof entry.phonetic === 'string') {
      phonetic = entry.phonetic;
    }

    // The richer `phonetics` array can hold text + audio variants.
    if (Array.isArray(entry.phonetics)) {
      for (const p of entry.phonetics) {
        if (!p || typeof p !== 'object') continue;
        if (!phonetic && p.text) phonetic = p.text;

        // Collect every non-empty, distinct audio URL (handle multiples).
        if (typeof p.audio === 'string' && p.audio.trim()) {
          let url = p.audio.trim();
          if (url.startsWith('//')) url = `https:${url}`; // fix protocol-relative
          if (!seenAudio.has(url)) {
            seenAudio.add(url);
            audios.push({ url, label: audioLabel(url, audios.length) });
          }
        }
      }
    }

    // Collect every meaning grouped by part of speech.
    if (Array.isArray(entry.meanings)) {
      for (const m of entry.meanings) {
        if (!m || !Array.isArray(m.definitions)) continue;

        const definitions = m.definitions
          .filter((d) => d && typeof d.definition === 'string')
          .map((d) => ({
            definition: d.definition,
            example: typeof d.example === 'string' ? d.example : null,
          }));

        if (definitions.length > 0) {
          // Collect meaning-level synonyms/antonyms (deduped, capped for UI).
          const dedupeStrings = (arr) =>
            Array.from(
              new Set(
                (Array.isArray(arr) ? arr : []).filter(
                  (s) => typeof s === 'string' && s.trim()
                )
              )
            ).slice(0, 10);

          meanings.push({
            partOfSpeech: m.partOfSpeech || 'unknown',
            definitions,
            synonyms: dedupeStrings(m.synonyms),
            antonyms: dedupeStrings(m.antonyms),
          });
        }
      }
    }
  }

  // A 200 response with no usable definitions is effectively "not found".
  if (meanings.length === 0) {
    throw new ApiError(
      'Word not found. Please check the spelling and try again.',
      404
    );
  }

  const word = entries[0]?.word || fallbackWord;
  // audioUrl kept for convenience (first available); audios holds them all.
  return { word, phonetic, audioUrl: audios[0]?.url ?? null, audios, meanings };
}

/** Map any thrown error into a friendly, typed ApiError. */
function mapError(err) {
  // Our own (validation / normalization) errors pass straight through.
  if (err instanceof ApiError) return err;

  if (err && err.response) {
    const status = err.response.status;
    if (status === 404) {
      return new ApiError(
        'Word not found. Please check the spelling and try again.',
        404
      );
    }
    if (status === 429) {
      return new ApiError(
        'Too many searches right now. Please wait a few seconds and try again.',
        429
      );
    }
    return new ApiError(
      'The dictionary service is having trouble. Please try again shortly.',
      status
    );
  }

  // Request was made but no response (offline, DNS, timeout, etc.).
  if (err && err.request) {
    return new ApiError(
      'Network error. Please check your internet connection and try again.',
      0
    );
  }

  return new ApiError('An unexpected error occurred. Please try again.', -1);
}

/** Decide whether a failure is worth retrying (transient). */
function isRetryable(err) {
  if (err instanceof ApiError) return err.status === 502 || err.status === 429;
  const status = err?.response?.status;
  if (status === 429 || (status >= 500 && status < 600)) return true; // rate-limit / server
  if (!err?.response && err?.request) return true; // network / timeout
  return false;
}

/**
 * Fetch and normalize a single word.
 * Retries transient failures (Cloudflare rate-limit / 5xx / network) so a valid
 * word doesn't appear "broken" just because the free API throttled the request.
 * A genuine 404 is never retried.
 *
 * @param {string} rawWord
 * @returns {Promise<{word,phonetic,audioUrl,audios,meanings}>}
 */
export async function fetchWord(rawWord) {
  const term = (rawWord || '').trim().toLowerCase();

  if (!term) {
    throw new ApiError('Please enter a word to search.', 0);
  }

  let lastError;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/${encodeURIComponent(term)}`,
        { timeout: REQUEST_TIMEOUT, headers: { Accept: 'application/json' } }
      );

      // A valid lookup ALWAYS returns a JSON array. Anything else (e.g. a
      // Cloudflare rate-limit HTML page returned with a 200) is transient —
      // treat it as retryable, NOT as "word not found".
      if (!Array.isArray(data)) {
        throw new ApiError(
          'The dictionary service returned an unexpected response. Please try again.',
          502
        );
      }

      return normalize(data, term);
    } catch (err) {
      // A real 404 means the word genuinely doesn't exist — fail fast.
      if (err?.response?.status === 404) throw mapError(err);

      lastError = err;
      if (isRetryable(err) && attempt < MAX_RETRIES) {
        await delay(RETRY_DELAY * (attempt + 1)); // simple linear backoff
        continue;
      }
      throw mapError(err);
    }
  }

  // Should be unreachable, but keep the contract (always throws an ApiError).
  throw mapError(lastError);
}
