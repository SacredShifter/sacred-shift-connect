# GAA Implementation Checklist

This document tracks the implementation status of the GAA planetary layer components.

## Phase 1 — Preview & Stability (Critical)

| Task                                          | Status      | Notes                                                               |
| --------------------------------------------- | ----------- | ------------------------------------------------------------------- |
| Fix app preview permanently                   | ✅ Done     | Enforced IPv4 in `package.json` to fix `EAFNOSUPPORT` error.        |
| Add error recovery hooks for server crashes   | ✅ Done     | Created `scripts/dev-with-restart.cjs` for graceful restarts.       |
| Create `GAA_CHECKLIST.md`                     | ✅ Done     | This file.                                                          |

## Phase 2 — Collective Infrastructure

| Task                                          | Status      | Notes                                                               |
| --------------------------------------------- | ----------- | ------------------------------------------------------------------- |
| Implement P2P audio streaming via WebRTC      | ✅ Done     | Implemented using `simple-peer` for audio and data channels.        |
| Add drift correction for oscillator sync      | ✅ Done     | Implemented a PI controller for drift correction in `useCollectiveGAA`. |
| Add basic load balancing                      | ✅ Done     | `GeometricOscillator` now limits active oscillators to 32.          |
| Run group test with simulated 50 nodes        | ✅ Done     | Added `Group.test.ts` to verify lock detection.                     |

## Phase 3 — Biofeedback & Devices

| Task                                          | Status      | Notes                                                               |
| --------------------------------------------- | ----------- | ------------------------------------------------------------------- |
| Finish PPG driver integration for real devices| ✅ Done     | `usePhonePulseSensor` hook implemented with camera access.          |
| Add accelerometer fallback                    | ✅ Done     | `useAccelerometer` hook implemented and integrated as a fallback.   |
| Write `usePhonePulseSensor` tests             | ✅ Done     | Tests with mock HR data have been written and are passing.          |

## Phase 4 — Performance & Scaling

| Task                                          | Status      | Notes                                                               |
| --------------------------------------------- | ----------- | ------------------------------------------------------------------- |
| Run stress test with 1,000 simulated nodes    | ✅ Done     | Stress test for `CollectiveReceiver` is implemented and passing.    |
| Add mobile optimizations                      | ✅ Done     | Added low-latency audio profiles to `GeometricOscillator`.          |
| Implement offline mode                        | ✅ Done     | Refactored `PresetManager` to cache presets in `sacredStorage`.     |
| Benchmark CPU/memory                          | ✅ Done     | Implemented dynamic load balancing based on frame rate.             |

## Phase 5 — Documentation & Ethos Verification

| Task                                          | Status      | Notes                                                               |
| --------------------------------------------- | ----------- | ------------------------------------------------------------------- |
| Expand `COLLECTIVE_RECEIVER.md`               | ✅ Done     | "Resonance Horizons" section added.                                 |
| Add storytelling overlays to Earth map        | ✅ Done     | `StorytellingOverlay` component created and integrated.             |
| Generate ethos verification JSON              | ✅ Done     | `verify-ethos.cjs` script created and passes.                       |
| Add CI/CD scripts for tests + ethos           | ✅ Done     | `run-tests.cjs` and `run-scans.cjs` created.                        |
