# 🔄 Data Flow — Dictionary Mobile App

End-to-end journey of a search, from keystroke to rendered definition, including
every validation and error branch.

---

## 1. Primary data flow (happy path + branches)

```mermaid
flowchart TD
    A([User types a word]) --> B{Empty or<br/>whitespace only?}
    B -- Yes --> B1[Show inline validation:<br/>'Please enter a word']
    B1 --> A
    B -- No --> C["search() in HistoryContext<br/>loading = true, error = null"]
    C --> D["services: axios GET<br/>/entries/en/{word}"]

    D -- "200 OK" --> E["normalize() response"]
    D -- "404" --> F1[ApiError 404:<br/>'Word not found']
    D -- "No response / timeout" --> F2[ApiError:<br/>'Network error']
    D -- "5xx / other" --> F3[ApiError:<br/>'Server error']

    E --> G{Any valid<br/>definitions?}
    G -- No --> F1
    G -- Yes --> H["Build entry:<br/>word · phonetic · audioUrl · meanings"]

    H --> I["setCurrentEntry(entry)"]
    I --> J["addToHistory(word)<br/>dedupe check"]
    J --> K["loading = false"]
    K --> L["router.push('/details')"]
    L --> M([Details screen renders])

    F1 --> N["loading = false<br/>setError(message)"]
    F2 --> N
    F3 --> N
    N --> O([Search screen shows<br/>ErrorView + Retry])
    O -- "tap Retry" --> C
```

---

## 2. Linear summary

```
User input
   │  validate: empty? whitespace-only?  ──► (fail) inline message
   ▼
search(word)               loading = true
   ▼
axios GET /entries/en/{word}
   ├─ 200 ─► normalize() ─► definitions exist? ─► build entry
   │                                   └─(no)─► ApiError 'Word not found'
   ├─ 404 ────────────────────────────────────► ApiError 'Word not found'
   ├─ timeout / offline ──────────────────────► ApiError 'Network error'
   └─ 5xx ────────────────────────────────────► ApiError 'Server error'
   ▼ (success)
setCurrentEntry(entry) → addToHistory(word, dedupe) → loading = false
   ▼
navigate to /details → render word, phonetic, audio, meanings
   ▲
   └────────── Drawer history tap re-enters search(word) ──────────┘
```

---

## 3. History reuse flow

```mermaid
sequenceDiagram
    participant U as User
    participant DR as Drawer
    participant CTX as HistoryContext
    participant API as dictionaryApi
    participant DS as Details Screen

    U->>DR: Tap a word in history
    DR->>DR: closeDrawer()
    DR->>CTX: search(word)
    CTX->>API: fetchWord(word)
    API-->>CTX: normalized entry (or ApiError)
    CTX->>CTX: setCurrentEntry + (dedupe) addToHistory
    DR->>DS: router.push('/details')
    DS->>CTX: read currentEntry
    DS-->>U: Render details
```

---

## 4. Audio playback state machine (Activity 3)

`SpeakerButton` only mounts when `audioUrl` exists.

```mermaid
stateDiagram-v2
    [*] --> Idle: audioUrl present
    Idle --> Playing: tap ▶ Play
    Playing --> Paused: tap ⏸ Pause
    Paused --> Playing: tap ▶ Play (resume)
    Playing --> Idle: tap ⏹ Stop (rewind to 0)
    Paused --> Idle: tap ⏹ Stop (rewind to 0)
    Playing --> Idle: clip finished (auto-rewind)
    note right of Idle
        Stop button disabled
        (nothing to rewind)
    end note
```

| State | Play/Pause icon | Stop button | Label |
|-------|-----------------|-------------|-------|
| Idle | ▶ Play | disabled | "Tap to listen" |
| Playing | ⏸ Pause | enabled | "Playing…" |
| Paused (mid-clip) | ▶ Play | enabled | "Paused" |

---

## 5. State ownership

| State | Owner | Lifetime |
|-------|-------|----------|
| `word` (text input) | Search screen (`useState`) | Per screen |
| `validationError` | Search screen | Per submit |
| `history[]` | HistoryContext | App session |
| `currentEntry` | HistoryContext | Until next search |
| `loading` / `error` | HistoryContext | Per request |
| audio `playing` / `currentTime` | `useAudioPlayerStatus` | Per Details mount |
