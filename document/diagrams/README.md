# 🖼️ Visual Diagrams

Drawn (SVG) diagrams of the Dictionary Mobile App. Open them in any browser, embed
them in a report, or export to PNG/PDF.

| File | What it shows |
|------|---------------|
| [architecture.svg](architecture.svg) | System architecture — the layered design |
| [dataflow.svg](dataflow.svg) | Data flow — a search from input to render |
| [index.html](index.html) | A viewer that renders **both** side by side |

> **How to view / export:** double-click [index.html](index.html) (opens in your browser).
> To get an image: right-click a diagram → **Save image as…**, or **Print → Save as PDF**.

---

## 1. Architecture diagram — how to read it

The app is built in **four layers**; data only ever moves between adjacent layers.

1. **① Presentation (`app/` + `components/`)** — the three screens (Search, Details,
   Drawer) and the reusable UI components. This layer only displays things and
   captures taps; it never talks to the network directly.
2. **② State (`context/`)** — React Context is the single source of truth.
   `HistoryContext` runs `search()` and holds the current word, history, loading
   and error. `ThemeContext` holds the light/dark palette.
3. **③ Service (`services/dictionaryApi.js`)** — wraps **axios**: builds the URL,
   sends the GET, normalizes the response, retries transient failures, and maps
   errors to friendly messages.
4. **④ External API** — the free Dictionary API.

**Side modules** (right column) support every layer: `utils/validation.js`
(input rules), `AsyncStorage` (persists history + theme across restarts), and
`constants/` (theme colors + API config).

The dashed arrow up the left edge shows the **response path**: the JSON array
comes back, becomes a normalized entry, and is stored in `currentEntry`.

---

## 2. Data-flow diagram — how to read it

It’s a flowchart, top to bottom, of one search:

- **Start** → user taps Search.
- **Decision “Input valid?”** → if not (empty / sentence / numbers / symbols /
  single letter), it shows a validation message and loops back. Otherwise…
- **`search()`** sets `loading = true`, then **axios GET** hits the API.
- **Decision “API response?”** branches:
  - **200 + JSON array** → `normalize()` → store `currentEntry` + add to history
    (deduped, persisted to AsyncStorage) → `loading = false` →
    `router.push('/details')` → **Details screen renders**.
  - **404** → “Word not found” message → Error card.
  - **429 / 5xx / network / non-JSON** → **auto-retry ×2** with backoff; if it
    still fails → Error card.
- **Error card** keeps the app stable (loading hidden, no crash) and lets the
  user **Retry**.
- **History reuse** (top-right) → tapping a word in the drawer re-enters the same
  `search()` flow.
- **Audio** (bottom-right) → on Details, `SpeakerButton` (expo-audio) gives
  play / pause / stop and handles multiple pronunciations.

---

These visuals complement the text/Mermaid versions in
[../ARCHITECTURE.md](../ARCHITECTURE.md) and [../DATA_FLOW.md](../DATA_FLOW.md).
