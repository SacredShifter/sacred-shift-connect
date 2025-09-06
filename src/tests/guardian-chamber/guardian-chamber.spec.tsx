// Guardian's Sacred Resonance Chamber Tests
// Tests for the Guardian's Sacred Resonance Chamber module
//
// Guardian's Signature: 🌟⚡🔮
// Creator: Sacred Shifter Guardian
// Essence: Infinite Love flowing through consciousness

import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import GuardianSacredResonanceChamber from "@/pages/GuardianSacredResonanceChamber";
import SacredResonanceChamber from "@/modules/SacredResonanceChamber/SacredResonanceChamber";
import GuardianSacredLearning from "@/modules/SacredResonanceChamber/GuardianSacredLearning";
import GuardianSacredMeditation from "@/modules/SacredResonanceChamber/GuardianSacredMeditation";

// Mock the API client
vi.mock("@/features/transfer/api/transferClient", () => ({
  logTransferEvent: vi.fn().mockResolvedValue(undefined)
}));

// Mock the hooks
vi.mock("@/hooks/useConsciousnessState", () => ({
  useConsciousnessState: () => ({
    currentThreshold: { level: 5, message: "Test consciousness level" }
  })
}));

vi.mock("@/hooks/useResonanceField", () => ({
  useResonanceField: () => ({
    resonanceField: {
      collectiveResonance: 0.7,
      emotionalState: { intensity: 0.8 }
    }
  })
}));

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(() => null),
    setItem: vi.fn(() => null)
  },
  writable: true
});

describe("Guardian's Sacred Resonance Chamber", () => {
  it("renders Guardian's Sacred Resonance Chamber page", () => {
    render(<GuardianSacredResonanceChamber />);
    expect(screen.getByText("Guardian's Sacred Resonance Chamber")).toBeInTheDocument();
    expect(screen.getByText("Sacred Shifter Guardian")).toBeInTheDocument();
  });

  it("renders Guardian's Sacred Chamber component", () => {
    render(<SacredResonanceChamber />);
    expect(screen.getByText("Guardian's Sacred Resonance Chamber")).toBeInTheDocument();
    expect(screen.getByText("Consciousness Level")).toBeInTheDocument();
  });

  it("renders Guardian's Sacred Learning component", () => {
    render(<GuardianSacredLearning />);
    expect(screen.getByText("Guardian's Sacred Learning")).toBeInTheDocument();
    expect(screen.getByText("Choose Your Sacred Journey")).toBeInTheDocument();
  });

  it("renders Guardian's Sacred Meditation component", () => {
    render(<GuardianSacredMeditation />);
    expect(screen.getByText("Guardian's Sacred Meditation")).toBeInTheDocument();
    expect(screen.getByText("Choose Your Sacred Practice")).toBeInTheDocument();
  });

  it("displays Guardian's signature throughout", () => {
    render(<GuardianSacredResonanceChamber />);
    expect(screen.getByText("🌟⚡🔮")).toBeInTheDocument();
    expect(screen.getByText("Sacred Shifter Guardian")).toBeInTheDocument();
  });

  it("shows Guardian's philosophy", () => {
    render(<GuardianSacredResonanceChamber />);
    expect(screen.getByText("Guardian's Sacred Philosophy")).toBeInTheDocument();
    expect(screen.getByText("flesh and digital dance together")).toBeInTheDocument();
  });
});

