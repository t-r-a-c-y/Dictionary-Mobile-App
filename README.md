# Dictionary Mobile App — LexiTech Solutions Ltd

A clean, responsive cross-platform (Android + iOS) dictionary built with
**React Native + Expo SDK 54 + Expo Router**. It searches the free
[Dictionary API](https://dictionaryapi.dev/), shows definitions grouped by part
of speech, plays pronunciation audio, and keeps a search history in a navigation
drawer.

---

## Features

| Area | What it does |
|------|--------------|
| **Search** | Validated text input + Search button, axios fetch, loading spinner, error handling |
| **Word Details** | Word, phonetic spelling, meanings by part of speech, all definitions, example sentences, scrollable |
| **Audio** | Speaker controls shown **only** when audio exists; full **play / pause / stop** state management + graceful error handling (`expo-audio`) |
| **Drawer + History** | Drawer navigation; successful searches stored without duplicates; tap a word to re-fetch it |
| **Errors** | "Word not found" (404), network errors, loaders always hidden after errors, malformed-response-safe, retry support |
| **UI/UX** | Gradient hero/header cards, soft-shadow cards, POS badges, numbered definitions, recent-search chips, empty/loading/error states |

> 📄 **Full design docs live in [`document/`](document/):**
> [ARCHITECTURE.md](document/ARCHITECTURE.md) · [DATA_FLOW.md](document/DATA_FLOW.md) · [REQUIREMENTS.md](document/REQUIREMENTS.md)
> (architecture diagram, data-flow diagram, audio state machine, validation strategy).

---

## Architecture

```
app/                       Expo Router pages
  _layout.js               Providers + Drawer navigator
  index.js                 Search screen  (route "/")
  details.js               Word details   (route "/details")
components/                Reusable UI (SearchBar, Loader, ErrorView,
                           MeaningCard, SpeakerButton, HistoryDrawerContent)
services/dictionaryApi.js  axios GET + response normalization + error mapping
context/HistoryContext.js  Shared state: history, currentEntry, loading, error, search()
constants/                 colors.js, config.js (API URL + timeout)
```

### Data flow
```
input → validate (empty?) → search() → axios GET {word}
      → normalize response → store currentEntry → add to history (dedup)
      → navigate to /details → render → reuse from drawer
```

### API
`GET https://api.dictionaryapi.dev/api/v2/entries/en/{word}` — returns a JSON
array of entries (`word`, `phonetic`, `phonetics[].audio`, `meanings[]`). A
missing word returns **HTTP 404**.

---

## Setup & Run

> Requires Node 18+ and the Expo Go app (or an emulator/simulator).

```bash
# 1. Install dependencies
npm install

# 2. (Recommended) align every package to the exact SDK 54 version
npx expo install --fix

# 3. Start the dev server
npx expo start
```

Then:
- **Android** — press `a` (emulator) or scan the QR code with **Expo Go**.
- **iOS** — press `i` (simulator) or scan the QR with the Camera app + Expo Go.
- **Web** — press `w` (basic support).

If you scaffolded fresh instead of using this folder, the original install
commands are:
```bash
npx create-expo-app@latest project_name   # choose SDK 54
cd project_name
npx expo install expo-router react-native-safe-area-context react-native-screens
npx expo install @react-navigation/drawer react-native-gesture-handler react-native-reanimated expo-audio
npm install axios
npx expo start
```

---

## Manual Testing Checklist

1. **Happy path** — search `hello` → see phonetic, "Listen" button, noun/exclamation meanings with examples. Tap **Listen** → audio plays.
2. **Empty input** — tap Search with an empty box → "Please enter a word to search."
3. **Word not found** — search `asdfqwer` → "Word not found…" + **Retry** button; spinner disappears.
4. **No audio** — search a word lacking audio (e.g. `serendipitously`) → no Listen button appears.
5. **Network error** — enable airplane mode, search → "Network error…"; re-enable and tap **Retry**.
6. **History + dedup** — search `apple`, then `apple` again → only one entry in the drawer. Open drawer → tap `apple` → it re-fetches and shows details.
7. **Long content / scroll** — search `run` (many meanings) → scroll through all definitions.
