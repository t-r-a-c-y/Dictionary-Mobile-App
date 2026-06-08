# ✅ Requirements & Validation Strategy — Dictionary Mobile App

Corrected and fully-implemented requirements, mapped to the exact code that
satisfies each one.

---

## 📱 Screens / Pages

| Route | File | Purpose |
|-------|------|---------|
| `/` | `app/index.js` | **Search screen** — input, validation, loading, errors, recent chips |
| `/details` | `app/details.js` | **Word details** — word, phonetic, audio, meanings |
| _(layout)_ | `app/_layout.js` | Drawer navigator + providers + audio mode |
| _(drawer)_ | `components/HistoryDrawerContent.js` | Search history menu |

---

## 🌐 API Endpoint Usage

```
GET https://api.dictionaryapi.dev/api/v2/entries/en/{word}
```

- **Free Dictionary API**, no key required.
- Returns a **JSON array** of entry objects:
  ```jsonc
  [{
    "word": "hello",
    "phonetic": "/həˈləʊ/",
    "phonetics": [{ "text": "/həˈləʊ/", "audio": "https://.../hello.mp3" }],
    "meanings": [{
      "partOfSpeech": "noun",
      "definitions": [{ "definition": "...", "example": "..." }]
    }]
  }]
  ```
- A missing word returns **HTTP 404** with `{ "title": "No Definitions Found" }`.
- Our `normalize()` flattens all entries, picks the first non-empty phonetic +
  audio URL, fixes protocol-relative audio URLs (`//…` → `https://…`), and
  collects every valid meaning.

---

## 🎯 Activity 2 — Word Details (corrected)

> **Display the searched word prominently at the top of the details screen.**

- ✅ The word renders inside a **gradient header card at the very top**, at 38px
  bold, capitalized, with `adjustsFontSizeToFit` so long words never overflow.
  → `app/details.js` (header `LinearGradient`).
- ✅ Phonetic spelling shown directly beneath; a fallback message appears if it
  is missing.
- ✅ All meanings grouped by part of speech, every definition + example, inside a
  `ScrollView` for long content.

---

## 🔊 Activity 3 — Audio Pronunciation (corrected)

> **Speaker icon next to the word/phonetics · disable/hide when no audio ·
> manage PLAY / PAUSE / STOP states.**

- ✅ **Speaker icon + controls placed next to the word/phonetics** inside the
  header card. → `components/SpeakerButton.js`.
- ✅ **Hidden entirely when no audio URL** exists (`if (!audioUrl) return null`);
  the Details header instead shows "No pronunciation audio available".
- ✅ **Full state management** via `expo-audio` (`useAudioPlayer` +
  `useAudioPlayerStatus`):
  - **Play** — `player.play()`
  - **Pause** — `player.pause()` (keeps position)
  - **Stop** — `player.pause()` + `player.seekTo(0)`; the Stop button is
    **disabled** when nothing is playing.
  - Auto-rewind when the clip finishes; live label shows *Playing… / Paused /
    Tap to listen*.
- ✅ **Multiple pronunciations handled**: `normalize()` collects every distinct
  audio URL into `audios[]` (deduped, with region labels like US/UK). When more
  than one exists, the header shows **selectable region pills**; tapping one
  switches the source via `player.replace()` and plays it.
- ✅ Plays even on iOS silent mode (`setAudioModeAsync({ playsInSilentMode: true })`
  in `_layout.js`).
- ✅ Playback errors are caught and shown via `Alert` — never crash.

---

## 🧭 Activity 4 — Drawer & History (corrected)

> **Implement a drawer navigator · display searched words in the drawer.**

- ✅ **Drawer navigator** configured in `app/_layout.js` using
  `expo-router/drawer` + a custom `drawerContent`.
- ✅ **Search history listed in the drawer** with a count badge; tapping a word
  re-fetches and opens Details. → `components/HistoryDrawerContent.js`.
- ✅ Only **successful** searches are stored, **newest first**, with **no
  duplicates**.

---

## 🛡️ Validation & Error-Handling Strategy

Every required validation point, and where it lives:

| # | Validation | Where | Behaviour |
|---|-----------|-------|-----------|
| 1 | **Empty input** | `index.js` `onSearch` + `HistoryContext.search` | Inline message "Please enter a word to search." |
| 2 | **Whitespace-only input** | `word.trim()` checks (both layers) | Treated as empty → same message |
| 3 | **API response validation** | `dictionaryApi.normalize` | Non-array / unexpected shape → safely treated as "not found" |
| 4 | **Missing phonetics** | `details.js` | Falls back to "Phonetic spelling unavailable" |
| 5 | **Missing audio URL** | `details.js` + `SpeakerButton` | Controls hidden; "No pronunciation audio available" |
| 6 | **Missing definitions** | `normalize` + `MeaningCard` | Throws `ApiError('Word not found', 404)`; empty cards are skipped |
| 7 | **Network / API errors** | `dictionaryApi` try/catch | 404 → "Word not found"; offline/timeout → "Network error"; 5xx → "Server error" |
| 8 | **Duplicate history** | `HistoryContext.addToHistory` | Case-insensitive `includes()` guard before insert |
| 9 | **Long / malformed responses** | `normalize` + UI | Optional chaining + type guards everywhere; `ScrollView`, `numberOfLines`, `adjustsFontSizeToFit` |
| 10 | **Loaders after errors** | `search()` `finally` | `loading` always reset to `false`, even on throw |
| 11 | **Retry** | `ErrorView` `onRetry` | Re-runs the same search |

### Error message catalogue

| Condition | User-facing message |
|-----------|--------------------|
| Empty / whitespace | "Please enter a word to search." |
| HTTP 404 / no definitions | "Word not found. Please check the spelling and try again." |
| Offline / timeout | "Network error. Please check your internet connection and try again." |
| 5xx server | "Something went wrong on the server. Please try again." |
| Unexpected | "An unexpected error occurred. Please try again." |
| Audio failure | Alert: "Unable to play the pronunciation audio." |

---

## 🧪 Testing commands

```bash
# Install dependencies
npm install

# (Optional) align versions exactly to SDK 54
npx expo install --fix

# Start the dev server
npx expo start
#   press a → Android emulator / Expo Go
#   press i → iOS simulator
#   press w → web (basic)

# Sanity-check that the whole app bundles with no errors
npx expo export --platform android --output-dir dist-check
```

### Manual test matrix

| Scenario | Steps | Expected |
|----------|-------|----------|
| Happy path | search `hello` | gradient header, phonetic, audio controls, meanings |
| Audio states | tap ▶ / ⏸ / ⏹ | plays, pauses (keeps spot), stops (rewinds); Stop disabled when idle |
| Empty input | tap Search empty | "Please enter a word to search." |
| Whitespace | type spaces → Search | same validation message |
| Not found | search `asdfqwer` | "Word not found…" + Retry; loader gone |
| No audio | search `serendipitously` | no audio controls; "No pronunciation audio available" |
| Missing phonetic | a word without phonetics | "Phonetic spelling unavailable" |
| Network error | airplane mode → search | "Network error…"; Retry recovers |
| Dedupe | search `apple` twice | one history entry |
| History reuse | drawer → tap `apple` | re-fetches → Details |
| Long content | search `run` | scrolls through many meanings |
