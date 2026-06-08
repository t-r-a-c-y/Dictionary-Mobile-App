# 🧪 Test Plan & Test Cases — Dictionary Mobile App

**Company:** LexiTech Solutions Ltd · Kigali City
**Application:** Dictionary Mobile App (React Native · Expo SDK 54)
**API under test:** `https://api.dictionaryapi.dev/api/v2/entries/en/{word}`
**Platforms:** Android & iOS (via Expo Go / emulator / simulator)

Use this document to verify **every sub-task of Activities 1–5**. Each test case
has an ID, the requirement it covers, steps, test data, and the expected result.
Tick **Pass/Fail** as you go.

---

## 0. Test setup & environment

### 0.1 Install & run

```bash
# 1) Install dependencies
npm install

# 2) (Optional) align all packages to exact SDK 54 versions
npx expo install --fix

# 3) Start the Metro dev server
npx expo start
#    a → Android emulator      i → iOS simulator
#    w → web (basic)           scan QR → Expo Go on a real device
```

### 0.2 "Error-free" build verification (run before manual testing)

A clean bundle proves there are **no import/syntax/compile errors** across the app.

```bash
# Android bundle (expect: "Exported: dist-check", no red errors)
npx expo export --platform android --output-dir dist-check

# iOS bundle (cross-platform check)
npx expo export --platform ios --output-dir dist-check
```

| ID | Check | Expected | Pass/Fail |
|----|-------|----------|-----------|
| BUILD-1 | `npm install` | Completes with no `ERESOLVE` error | ☐ |
| BUILD-2 | `expo export` (Android) | "Exported" with 1 bundle, **0 errors** | ☐ |
| BUILD-3 | `expo export` (iOS) | "Exported" with 1 bundle, **0 errors** | ☐ |
| BUILD-4 | `npx expo start` | Metro starts, QR shown, app loads in Expo Go | ☐ |

### 0.3 Recommended test data

| Purpose | Word |
|---------|------|
| Standard word w/ audio + examples | `hello` |
| Many meanings / long content | `run`, `set` |
| Multiple meanings, verb+noun | `book` |
| Likely **no audio** | `serendipitously` |
| **Not found** (404) | `asdfqwer`, `zxcvbnm` |
| Whitespace / empty | `   ` (spaces only) |

---

## 1. Activity 1 — Word Search & API Integration

| ID | Requirement | Steps | Test data | Expected result | Pass/Fail |
|----|-------------|-------|-----------|-----------------|-----------|
| A1-1 | Search screen has text input + search button | Launch app | — | Search screen shows an input field and a **Search** button | ☐ |
| A1-2 | Validate input not empty | Tap **Search** with empty field | `` (empty) | Inline message: *"Please enter a word to search."*; no API call | ☐ |
| A1-3 | Reject whitespace-only | Type spaces, tap **Search** | `   ` | Same validation message; no API call | ☐ |
| A1-3b | Reject a sentence / multiple words | Type two words, tap **Search** | `hello world` | "Please search for one word, not a sentence." | ☐ |
| A1-3c | Reject numbers | Search a word with digits | `hello123`, `42` | "Please search for a word instead of numbers." | ☐ |
| A1-3d | Reject symbols | Search a word with symbols | `@hello`, `test!` | "Please search for a word instead of numbers." | ☐ |
| A1-3e | Reject single letter | Search one letter | `a` | "Please enter more than one letter." | ☐ |
| A1-4 | Capture entered word on submit | Type a word, press keyboard **search** / tap button | `hello` | Search is triggered with the typed word | ☐ |
| A1-5 | Build API URL dynamically | (Verified via result) | `hello` | Request goes to `…/entries/en/hello` | ☐ |
| A1-6 | Send HTTP GET (axios) | Submit a valid word | `hello` | Network request fires; results return | ☐ |
| A1-7 | Loading indicator while fetching | Submit a valid word, watch | `run` | A spinner + "Searching …" appears during the request | ☐ |
| A1-8 | Parse JSON response | After load completes | `hello` | Word, phonetic, meanings render correctly | ☐ |
| A1-9 | Store fetched data temporarily | After success | `hello` | App navigates to **Details** showing the parsed data | ☐ |

**Covered by:** `app/index.js`, `components/SearchBar.js`, `services/dictionaryApi.js`, `context/HistoryContext.js`, `components/Loader.js`.

---

## 2. Activity 2 — Display Word Details

| ID | Requirement | Steps | Test data | Expected result | Pass/Fail |
|----|-------------|-------|-----------|-----------------|-----------|
| A2-1 | Extract word/phonetics/meanings/definitions | Search a word | `hello` | All four are present on the Details screen | ☐ |
| A2-2 | Word shown prominently at top | Open Details | `hello` | Word appears **large & bold at the very top** (gradient header) | ☐ |
| A2-3 | Show phonetic spelling | Open Details | `hello` | Phonetic (e.g. `/həˈləʊ/`) shown under the word | ☐ |
| A2-4 | Display each part of speech | Open Details | `book` | Each POS shown as a labelled badge (noun, verb…) | ☐ |
| A2-5 | List all definitions under their POS | Open Details | `run` | Every definition listed & numbered under its POS | ☐ |
| A2-6 | Show example sentences when provided | Open Details | `hello` | Example sentences appear in italic boxes where available | ☐ |
| A2-7 | Layout supports multiple meanings & long defs | Open Details, scroll | `set` / `run` | Content scrolls; long text wraps; nothing cut off | ☐ |
| A2-8 | Consistent styling & spacing | Visual review | any | Uniform cards, spacing, fonts; readable | ☐ |
| A2-9 | Missing phonetic handled | Search a word w/o phonetic | (varies) | Shows *"Phonetic spelling unavailable"* instead of blank | ☐ |

**Covered by:** `app/details.js`, `components/MeaningCard.js`.

---

## 3. Activity 3 — Audio Pronunciation

| ID | Requirement | Steps | Test data | Expected result | Pass/Fail |
|----|-------------|-------|-----------|-----------------|-----------|
| A3-1 | Detect audio URL exists | Open Details | `hello` | Audio controls appear (because audio exists) | ☐ |
| A3-2 | Speaker icon next to word/phonetics | Open Details | `hello` | Speaker icon + Play/Pause/Stop shown in the header next to the word | ☐ |
| A3-3 | Load audio from URL | Tap **Play** | `hello` | Audio loads and begins playing | ☐ |
| A3-4 | Play on tap | Tap **Play** | `hello` | Pronunciation is heard; label shows *Playing…* | ☐ |
| A3-5 | Pause keeps position | While playing, tap **Pause** | `hello` | Audio pauses; label *Paused*; resumes from same point on Play | ☐ |
| A3-6 | Stop rewinds & disables | Tap **Stop** | `hello` | Audio stops & rewinds; Stop button greys out when idle | ☐ |
| A3-7 | Multiple pronunciations handled | Open a word w/ US+UK audio | `hello` / `tomato` | Region pills (e.g. **US / UK**) appear; tapping switches & plays that one | ☐ |
| A3-8 | Hide audio when none provided | Open a word w/o audio | `serendipitously` | **No** audio controls; shows *"No pronunciation audio available"* | ☐ |
| A3-9 | Handle playback errors gracefully | Force a bad audio (offline mid-play) | `hello` | Alert *"Unable to play the pronunciation audio."*; app does **not** crash | ☐ |

**Covered by:** `components/SpeakerButton.js`, `app/_layout.js` (`setAudioModeAsync`), `services/dictionaryApi.js` (`audios[]`).

---

## 4. Activity 4 — Drawer Navigation & Search History

| ID | Requirement | Steps | Test data | Expected result | Pass/Fail |
|----|-------------|-------|-----------|-----------------|-----------|
| A4-1 | Drawer navigation implemented | Tap hamburger (top-left) or swipe from left edge | — | Drawer slides open | ☐ |
| A4-2 | History data structure stores searches | Search a word | `apple` | Word stored in history state | ☐ |
| A4-3 | Add each successful word to history | Search several words | `apple`, `book` | Both appear in the drawer (newest first) | ☐ |
| A4-4 | Display history in drawer menu | Open drawer | (after searches) | History list visible with a count badge | ☐ |
| A4-5 | Tap a word from the drawer | Open drawer, tap a word | `apple` | Drawer closes, request triggers | ☐ |
| A4-6 | New API request on selection | Tap a history word | `apple` | Fresh GET request fires for that word | ☐ |
| A4-7 | Refresh detail screen | After tapping history word | `apple` | Details screen shows that word's data | ☐ |
| A4-8 | Prevent duplicate entries | Search `apple` twice | `apple`, `apple` | Only **one** `apple` entry in history | ☐ |
| A4-9 | Empty history state | Fresh app, open drawer | — | Friendly *"No searches yet"* message | ☐ |

**Covered by:** `app/_layout.js` (Drawer), `components/HistoryDrawerContent.js`, `context/HistoryContext.js`.

---

## 5. Activity 5 — Error Handling & User Feedback

| ID | Requirement | Steps | Test data | Expected result | Pass/Fail |
|----|-------------|-------|-----------|-----------------|-----------|
| A5-1 | Detect 404 "word not found" | Search a nonsense word | `asdfqwer` | 404 detected | ☐ |
| A5-2 | Friendly "Word not found" message | After A5-1 | `asdfqwer` | *"Word not found. Please check the spelling and try again."* | ☐ |
| A5-3 | Handle network connectivity issues | Enable airplane mode, search | `hello` | *"Network error. Please check your internet connection…"* | ☐ |
| A5-4 | Show error when request fails | Any failing request | (varies) | A clear error card is shown | ☐ |
| A5-5 | Hide loading indicator on error | Trigger any error | `asdfqwer` | Spinner disappears; error replaces it | ☐ |
| A5-6 | No crash on malformed responses | Search valid + odd words | `run`, `set` | App renders safely; never crashes (defensive parsing) | ☐ |
| A5-7 | Allow retry after error | On an error screen, tap **Retry** | `hello` (after airplane off) | Search re-runs and succeeds | ☐ |
| A5-8 | Empty-state message when no data | Fresh search screen | — | Helpful empty state / tips shown | ☐ |

**Covered by:** `services/dictionaryApi.js` (`ApiError`, try/catch), `components/ErrorView.js`, `context/HistoryContext.js` (`finally` resets loading), `app/index.js`.

---

## 6. Cross-cutting / non-functional tests

| ID | Area | Steps | Expected | Pass/Fail |
|----|------|-------|----------|-----------|
| NF-1 | Android compatibility | Run on Android emulator/device | Works fully | ☐ |
| NF-2 | iOS compatibility | Run on iOS simulator/device | Works fully | ☐ |
| NF-3 | Responsive layout | Rotate / different screen sizes | No overflow/clipping | ☐ |
| NF-4 | Navigation flow | Search → Details → back → drawer | Smooth, no dead-ends | ☐ |
| NF-5 | Theme / readability | Visual review | Consistent **blue** theme, legible contrast | ☐ |
| NF-6 | Rapid input | Search several words quickly | No stuck spinners or stale results | ☐ |
| NF-7 | Long word handling | Search a very long word | Header shrinks to fit (`adjustsFontSizeToFit`) | ☐ |
| NF-8 | Dark mode toggle (header) | Tap the moon/sun icon in the header | Whole app switches light ⇄ dark instantly | ☐ |
| NF-9 | Dark mode toggle (drawer) | Open drawer → toggle "Dark mode" switch | Theme switches; drawer + screens recolor | ☐ |
| NF-10 | System theme default | Set device to dark, fresh-launch app | App starts in dark mode | ☐ |
| NF-11 | Synonyms/antonyms layout | Search `happy` / `good`, view chips | Chips wrap and stay **inside** the card (no overflow) | ☐ |
| NF-12 | Clear input on re-search | Open a word → "Search another word" | Search field is **empty** (previous word cleared) | ☐ |
| NF-13 | Clear-all confirm (drawer) | Drawer → "Clear all" | Styled confirm dialog appears; Cancel keeps, Confirm wipes | ☐ |
| NF-14 | Clear-all confirm (dashboard) | Search screen → "Clear all" on Recent | Same styled confirm dialog appears before clearing | ☐ |
| NF-15 | Delete single history item | Drawer → tap ✕ on a word | Confirm dialog appears; Confirm removes only that word (animated out), Cancel keeps it | ☐ |

---

## 7. Requirement → Test-case traceability

| Activity | Sub-tasks | Test cases |
|----------|-----------|------------|
| **1 — Search & API** | 8 | A1-1 … A1-9 |
| **2 — Word Details** | 8 | A2-1 … A2-9 |
| **3 — Audio** | 7 | A3-1 … A3-9 |
| **4 — Drawer & History** | 8 | A4-1 … A4-9 |
| **5 — Error Handling** | 8 | A5-1 … A5-8 |
| **Non-functional** | — | NF-1 … NF-7 |
| **Build / error-free** | — | BUILD-1 … BUILD-4 |

> ✅ Every sub-task in Activities 1–5 maps to at least one test case above.

---

## 8. Sign-off

| Role | Name | Date | Result (Pass/Fail) |
|------|------|------|--------------------|
| Tester | | | |
| Reviewer | | | |

**Overall result:** ☐ Pass  ☐ Fail
**Notes / defects found:**

```
(record any failed test IDs and observed behaviour here)
```
