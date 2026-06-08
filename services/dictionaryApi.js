// services/dictionaryApi.js
// All network access to the Free Dictionary API lives here so screens stay
// focused on rendering. Responsibilities:
//   1. Make the axios GET request.
//   2. Normalize the (sometimes messy) response into a single, safe shape.
//   3. Translate any failure into a friendly, user-facing ApiError.
import axios from 'axios';
import { API_BASE_URL, REQUEST_TIMEOUT } from '../constants/config';

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

/**
 * Fetch and normalize a single word.
 * Throws ApiError on validation, 404, network, or unexpected failures.
 *
 * @param {string} rawWord
 * @returns {Promise<{word,phonetic,audioUrl,meanings}>}
 */
export async function fetchWord(rawWord) {
  const term = (rawWord || '').trim().toLowerCase();

  if (!term) {
    throw new ApiError('Please enter a word to search.', 0);
  }

  try {
    const { data } = await axios.get(
      `${API_BASE_URL}/${encodeURIComponent(term)}`,
      { timeout: REQUEST_TIMEOUT }
    );
    return normalize(data, term);
  } catch (err) {
    // Our own validation/normalization errors pass straight through.
    if (err instanceof ApiError) throw err;

    // Server responded with a non-2xx status.
    if (err.response) {
      if (err.response.status === 404) {
        throw new ApiError(
          'Word not found. Please check the spelling and try again.',
          404
        );
      }
      throw new ApiError(
        'Something went wrong on the server. Please try again.',
        err.response.status
      );
    }

    // Request was made but no response (offline, DNS, timeout, etc.).
    if (err.request) {
      throw new ApiError(
        'Network error. Please check your internet connection and try again.',
        0
      );
    }

    // Anything else (config error, unexpected throw).
    throw new ApiError('An unexpected error occurred. Please try again.', -1);
  }
}
