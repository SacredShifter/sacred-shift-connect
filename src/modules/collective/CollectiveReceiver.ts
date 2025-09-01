import { ParticipantState, BiofeedbackMetrics } from '@/types/gaa-polarity';

interface CollectiveField {
  resonance: number;
  polarity: number;
  coherence: number;
  archetype: string;
}

const MAX_PARTICIPANTS = 100; // Safety limit for the collective receiver

export class CollectiveReceiver {
  private participants: Map<string, ParticipantState> = new Map();
  private collectiveField: CollectiveField;
  private onUpdate?: (field: CollectiveField) => void;

  constructor() {
    this.collectiveField = {
      resonance: 0,
      polarity: 0,
      coherence: 0,
      archetype: 'default',
    };
  }

  public registerParticipant(participant: ParticipantState): void {
    if (this.participants.size >= MAX_PARTICIPANTS) {
      console.warn(`Collective receiver overloaded. Ignoring new participant: ${participant.userId}`);
      return;
    }
    this.participants.set(participant.userId, participant);
    this.recalculateCollectiveField();
  }

  public unregisterParticipant(userId: string): void {
    this.participants.delete(userId);
    this.recalculateCollectiveField();
  }

  public updateParticipantState(userId: string, newState: Partial<ParticipantState>): void {
    const existingState = this.participants.get(userId);
    if (existingState) {
      this.participants.set(userId, { ...existingState, ...newState });
      this.recalculateCollectiveField();
    }
  }

  private recalculateCollectiveField(): void {
    let totalResonance = 0;
    let totalPolarity = 0;
    let totalCoherence = 0;
    const participantCount = this.participants.size;

    if (participantCount === 0) {
      this.collectiveField = { resonance: 0, polarity: 0, coherence: 0, archetype: 'default' };
      return;
    }

    for (const participant of this.participants.values()) {
      totalPolarity += participant.polarityBalance;
      if (participant.biofeedback) {
        totalCoherence += this.calculateCoherence(participant.biofeedback);
      }
    }

    this.collectiveField = {
      resonance: Math.max(0, Math.min(1, totalResonance / participantCount)),
      polarity: Math.max(-1, Math.min(1, totalPolarity / participantCount)),
      coherence: Math.max(0, Math.min(1, totalCoherence / participantCount)),
      archetype: this.determineArchetype(totalPolarity / participantCount),
    };

    if (this.onUpdate) {
      this.onUpdate(this.collectiveField);
    }
  }

  private calculateCoherence(biofeedback: BiofeedbackMetrics): number {
    // A simple coherence calculation based on HRV and breathing
    const hrvCoherence = biofeedback.heartRateVariability / 100;
    const breathCoherence = biofeedback.breathingPattern.coherence;
    return (hrvCoherence + breathCoherence) / 2;
  }

  private determineArchetype(polarity: number): string {
    if (polarity > 0.7) return 'sun';
    if (polarity > 0.3) return 'death';
    if (polarity < -0.7) return 'moon';
    if (polarity < -0.3) return 'devil';
    return 'tower';
  }

  public onFieldUpdate(callback: (field: CollectiveField) => void): void {
    this.onUpdate = callback;
  }

  public getCollectiveField(): CollectiveField {
    return this.collectiveField;
  }
}
