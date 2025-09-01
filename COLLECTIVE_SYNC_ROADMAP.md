# Collective Sync Feature: Status and Roadmap

**Last Updated:** 2025-09-01
**Status:** ⚠️ Experimental / Proof of Concept

## 1. Current Implementation (Phase 1.5)

The collective sync feature allows multiple users to join a shared session. The current implementation should be considered a **proof of concept** and is **not ready for production use** in a large-scale or mission-critical capacity.

### 1.1. What Works:
- **Session Management:** Users can create and join sessions using Supabase Realtime channels.
- **Presence:** A basic list of participants in a session is available via Supabase Presence.
- **Control Message Sync:** The session leader can broadcast control messages (specifically, `polarity_sync`) to all participants, and participants will correctly update their state.
- **Clock Synchronization:** A foundational clock synchronization mechanism is in place. Clients periodically sync with a server timestamp to establish a shared "network time," which is a prerequisite for more advanced synchronization.
- **State Synchronization:** The system now synchronizes the high-frequency state of the GAA engine (e.g., oscillator parameters, geometry changes) between clients using Supabase broadcast channels.
- **Drift Correction:** A Phase-Locked Loop (PLL) has been implemented to correct for clock drift between clients over time.

### 1.2. Known Limitations & Risks:
- **Scalability:** The current architecture relies on Supabase's broadcast features, which will not scale effectively beyond a small number of users (likely < 10).
- **No Jitter Compensation:** The system does not handle real-world network conditions like variable latency (jitter) or packet loss. A jitter buffer is needed for a smooth experience.
- **WebRTC Not Fully Integrated:** WebRTC data channels have been stubbed but are not yet used for state synchronization.

## 2. Development Roadmap

Significant work is required to make this feature production-ready. The roadmap is divided into two main phases.

### 2.1. Phase 2: Latency & Jitter Compensation (The "Smooth" Experience)
*This phase focuses on making the experience feel synchronized and smooth for a small group of users.*

- ✅ **Implement Phase-Locked Loop (PLL):** A PLL has been implemented to correct for clock drift.
- ✅ **Use Broadcast for State Sync:** High-frequency state updates are now sent via broadcast channels instead of Presence.
- ✅ **Stub WebRTC Data Channels:** `WebRTCManager` has been updated with stubs for data channel support.
- ❌ **Implement Jitter Buffer:** All incoming state update messages must be timestamped with the synchronized network time. Clients will buffer these messages for a short, fixed period (e.g., 100-200ms) and then process them in timestamp order. This trades a small amount of latency for a large increase in smoothness.

### 2.2. Phase 3: Scalability & Robustness (The "Production" Experience)
*This phase focuses on making the feature work for larger groups and in unreliable network conditions.*

- **Architect a Dedicated Real-Time Server:** The Supabase broadcast model must be replaced. A dedicated server application (e.g., using Node.js, Elixir/Phoenix, or Go) is required to manage session state. This server will be responsible for receiving updates from clients, processing them, and sending targeted state updates back to the relevant clients.
- **Selective Forwarding Unit (SFU):** For a WebRTC-based approach, an SFU architecture will be necessary. Instead of a full peer-to-peer mesh (which does not scale), each client sends its data to a central SFU server, which then forwards it to the other clients. This balances latency and server load.
- **Implement Real P2P Audio Stream:** To share the actual generated audio (not just the state), the `WebRTCManager` must be modified to capture the `AudioContext`'s output stream (using `MediaStreamAudioDestinationNode`) and transmit that over a WebRTC `AudioTrack`.
