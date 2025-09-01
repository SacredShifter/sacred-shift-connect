# Collective Receiver Module

**Status:** Implemented

## 1. Overview

The Collective Receiver is a central module in the GAA system that enables a group of users to create a shared, resonant audio and geometric field. It listens for state updates from multiple participants in a collective session, aggregates this data, and calculates a `collectiveField` that represents the group's emergent state. This field is then used to influence the local audio playback of each participant, creating a truly collective experience.

## 2. Protocols

### 2.1. State Aggregation

The `CollectiveReceiver` aggregates the following state from each participant:
- **Polarity Balance:** The balance between the "light" and "dark" channels of the participant's GAA engine.
- **Biofeedback:** Coherence between heart rate variability and breathing patterns.

The receiver calculates the average of these values across all participants to determine the `collectiveField`.

### 2.2. Resonance Weighting

The `collectiveField` has three main components:
- **Resonance:** (Currently a placeholder) Will be used to represent the overall intensity of the collective field.
- **Polarity:** The average polarity balance of the group.
- **Coherence:** The average bio-coherence of the group.

This `collectiveField` is then used to modulate the audio parameters of each participant's local GAA engine, creating a feedback loop where the group's state influences each individual, and each individual's state influences the group.

## 3. Security and Ethical Guardrails

### 3.1. Opt-In Consent

Participation in the collective field is strictly opt-in. The `useCollectiveGAA` hook provides a `updateConsentLevel` function that allows users to set their level of participation:
- **`observer`**: The user can observe the collective field but does not contribute their own state.
- **`participant`**: The user contributes their state to the collective field and receives the influence of the field on their local playback.
- **`full_integration`**: (Future) The user's audio is streamed to other participants for a fully immersive experience.

### 3.2. Anonymity and Data Privacy

Participant state is shared with other members of the collective session. While this is necessary for the collective experience, it's important to be mindful of data privacy. The current implementation does not share any personally identifiable information beyond the user's display name.

### 3.3. Overload Protection

The `CollectiveReceiver` has a hard limit of 100 participants to prevent performance issues. If this limit is exceeded, the receiver will not accept new participants. The `collectiveField` values are also clamped to a safe range to prevent extreme or chaotic audio experiences.

## 4. Future Development

- **WebRTC Integration:** For lower latency and higher scalability, the collective receiver will be integrated with WebRTC data channels.
- **Advanced Resonance Weighting:** The resonance calculation will be improved to incorporate more bio-signals and other metrics.
- **Dynamic Archetypes:** The collective archetype will be dynamically determined by the group's state and will have a more significant impact on the audio and visual experience.
