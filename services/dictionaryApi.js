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
 * @returns {{ word: string, phonetic: string, audioUrl: string|null, meanings: Array }}
 */
function normalize(rawEntries, fallbackWord) {
  const entries = Array.isArray(rawEntries) ? rawEntries : [];

  let phonetic = '';
  let audioUrl = null;
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
        if (!audioUrl && p.audio) audioUrl = p.audio;
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
          meanings.push({
            partOfSpeech: m.partOfSpeech || 'unknown',
            definitions,
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

  // Some audio URLs are protocol-relative ("//ssl.gstatic.com/..."). Fix them.
  if (audioUrl && audioUrl.startsWith('//')) {
    audioUrl = `https:${audioUrl}`;
  }

  const word = entries[0]?.word || fallbackWord;
  return { word, phonetic, audioUrl, meanings };
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
