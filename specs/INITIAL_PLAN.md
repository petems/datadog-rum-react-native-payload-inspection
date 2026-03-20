# React Native Datadog RUM Payload Inspection App

## Context
Create a test app demonstrating custom Datadog RUM resource tracking with payload inspection. The app has a single screen with a big "Fetch" button that hits a public API, inspects the response payload, and sends custom attributes to Datadog via `DdRum.startResource`/`stopResource`.

## Steps

### 1. Scaffold React Native project
```bash
npx @react-native-community/cli@latest init DatadogRumPayloadInspection \
  --directory /Users/peter.souter/projects/datadog-rum-react-native-payload-inspection
```

### 2. Install Datadog SDK
```bash
npm install @datadog/mobile-react-native
cd ios && pod install && cd ..
```

### 3. Create credential config files
- **`credentials.example.json`** — checked-in template with placeholders for `clientToken`, `applicationId`, `environment`
- **`credentials.json`** — gitignored, real values filled in by user
- Add `credentials.json` to `.gitignore`

### 4. Create `src/fetchWithRum.ts` — Instrumented fetch function
- Uses `https://jsonplaceholder.typicode.com/posts` as the real endpoint
- `DdRum.startResource()` before fetch with `custom.resource_type` attribute
- On success: inspects payload and sends custom attributes:
  - `custom.post_count` — array length
  - `custom.unique_users` — distinct userIds
  - `custom.avg_title_length` — computed from payload
  - `custom.has_expected_structure` — schema validation
  - `custom.payload_valid` — combined check
- On error: sends `custom.error_type` and `custom.error_message`

### 5. Create `src/MainScreen.tsx` — UI component
- Big purple "FETCH" button (Datadog brand color)
- Loading spinner state
- Error display
- Results: metadata box showing what was sent to DD + first 5 posts

### 6. Replace `App.tsx` — DatadogProvider wrapper
- Load credentials from `credentials.json`
- `DatadogProviderConfiguration` with `trackResources: false` (manual instrumentation only)
- `trackInteractions: true`, `trackErrors: true`
- `sessionSamplingRate: 100`, `resourceTracingSamplingRate: 100`

### 7. Init git repo and initial commit

## Key files
| File | Purpose |
|------|---------|
| `App.tsx` | DatadogProvider wrapper, SDK config |
| `src/fetchWithRum.ts` | DdRum.startResource/stopResource with payload inspection |
| `src/MainScreen.tsx` | Fetch button UI + results display |
| `credentials.example.json` | Template for DD credentials |
| `.gitignore` | Add credentials.json |

## Design decisions
- **`trackResources: false`** — avoids duplicate tracking since we're doing manual instrumentation
- **JSONPlaceholder API** — free, reliable, always returns 100 posts with consistent structure
- **`credentials.json` pattern** — matches official `dd-sdk-reactnative-examples` repo approach
- **Single screen** — minimal app, just the demo

## Verification
1. `npx react-native run-ios` (or run-android)
2. Press FETCH button → see posts + metadata on screen
3. Check Datadog RUM Explorer → find resource events with custom attributes (`custom.post_count`, etc.)
4. Kill network → press FETCH → verify error attributes appear in DD
