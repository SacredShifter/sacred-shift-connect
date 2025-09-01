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

### 1.2. Known Limitations & Risks:
- **No State Synchronization:** The system does **not** synchronize the high-frequency state of the GAA engine (e.g., oscillator parameters, geometry changes) between clients. The initial implementation attempting this via Supabase Presence has been disabled as it is not a scalable or reliable approach.
- **No Phase Coherence:** There is **no mechanism** to ensure the audio oscillators of different participants are in phase. The audio will sound different for each user and will not be a truly "collective" experience.
- **Scalability:** The current architecture relies on Supabase's broadcast features, which will not scale effectively beyond a small number of users (likely < 10).
- **No Jitter/Latency Compensation:** The system does not handle real-world network conditions like variable latency (jitter) or packet loss.

## 2. Development Roadmap

Significant work is required to make this feature production-ready. The roadmap is divided into two main phases.

### 2.1. Phase 2: Latency & Jitter Compensation (The "Smooth" Experience)
*This phase focuses on making the experience feel synchronized and smooth for a small group of users.*

- **Implement Jitter Buffer:** All incoming state update messages must be timestamped with the synchronized network time. Clients will buffer these messages for a short, fixed period (e.g., 100-200ms) and then process them in timestamp order. This trades a small amount of latency for a large increase in smoothness.
- **Implement Phase-Locked Loop (PLL):** To correct for clock drift between clients over time, a PLL system should be implemented. This involves comparing the timestamp of incoming messages from the session leader to the client's current network time and using a PI controller to make micro-adjustments to the local playback rate (e.g., `Tone.Transport.bpm`), gently pulling the client back into phase.
- **WebRTC Data Channels for State:** Begin experimenting with WebRTC data channels for sending high-frequency state updates directly between peers. This can significantly reduce latency compared to a server broadcast model.

### 2.2. Phase 3: Scalability & Robustness (The "Production" Experience)
*This phase focuses on making the feature work for larger groups and in unreliable network conditions.*

- **Architect a Dedicated Real-Time Server:** The Supabase broadcast model must be replaced. A dedicated server application (e.g., using Node.js, Elixir/Phoenix, or Go) is required to manage session state. This server will be responsible for receiving updates from clients, processing them, and sending targeted state updates back to the relevant clients.
- **Selective Forwarding Unit (SFU):** For a WebRTC-based approach, an SFU architecture will be necessary. Instead of a full peer-to-peer mesh (which does not scale), each client sends its data to a central SFU server, which then forwards it to the other clients. This balances latency and server load.
- **Implement Real P2P Audio Stream:** To share the actual generated audio (not just the state), the `WebRTCManager` must be modified to capture the `AudioContext`'s output stream (using `MediaStreamAudioDestinationNode`) and transmit that over a WebRTC `AudioTrack`.
