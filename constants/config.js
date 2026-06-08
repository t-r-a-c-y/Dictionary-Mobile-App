// Reusable configuration values for the Free Dictionary API.
// Endpoint shape: `${API_BASE_URL}/{word}`
export const API_BASE_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en';

// Abort requests that take too long so the UI never hangs on a dead network.
export const REQUEST_TIMEOUT = 10000; // ms

// The free API is behind Cloudflare and rate-limits bursts of requests.
// Retry transient failures (rate-limit / 5xx / network) a few times.
export const MAX_RETRIES = 2;
export const RETRY_DELAY = 700; // ms (multiplied by attempt number for backoff)
