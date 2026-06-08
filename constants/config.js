// Reusable configuration values for the Free Dictionary API.
// Endpoint shape: `${API_BASE_URL}/{word}`
export const API_BASE_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en';

// Abort requests that take too long so the UI never hangs on a dead network.
export const REQUEST_TIMEOUT = 10000; // ms
