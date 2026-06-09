// utils/validation.js
// Centralized search-input validation so the Search screen and the context
// share the exact same rules and messages.

/**
 * Validate a raw search term.
 * Returns a user-facing error message, or null when the input is valid.
 *
 * Rules (checked in order):
 *   1. Empty / whitespace-only            -> "Please enter a word to search."
 *   2. More than one word (has a space)   -> "Please search for one word, not a sentence."
 *   3. Contains digits (e.g. hello123/42) -> "Please search for a word instead of numbers."
 *   4. Contains symbols (e.g. system()/@hi)-> "Please use only English letters, hyphens, or apostrophes."
 *   5. Single letter (e.g. "a")           -> "Please enter more than one letter."
 *
 * Hyphens and apostrophes are allowed so legitimate words like "well-being"
 * and "don't" still pass.
 */
export function validateWord(raw) {
  const word = (raw || '').trim();

  if (!word) {
    return 'Please enter a word to search.';
  }

  // Any internal whitespace => more than one word.
  if (/\s/.test(word)) {
    return 'Please search for one word, not a sentence.';
  }

  // Any digit anywhere.
  if (/[0-9]/.test(word)) {
    return 'Please search for a word instead of numbers.';
  }

  // Anything that isn't a letter, hyphen, or apostrophe => a symbol.
  if (/[^a-zA-Z'-]/.test(word)) {
    return 'Please use only English letters, hyphens, or apostrophes.';
  }

  // A single character isn't a searchable word.
  if (word.length < 2) {
    return 'Please enter more than one letter.';
  }

  return null; // valid
}
