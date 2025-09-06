// Law of Transfer Tests
// Basic smoke tests for the Law of Transfer feature pack

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import LawOfTransferPage from "@/features/transfer/codex/LawOfTransferPage";
import BreathAsGeometry from "@/features/transfer/practice/BreathAsGeometry";
import VisionQuickCapture from "@/features/transfer/visions/VisionQuickCapture";
import ConnectivityBridgeCard from "@/features/transfer/bridge/ConnectivityBridgeCard";
import TransferHub from "@/routes/transfer";

// Mock the API client
vi.mock("@/features/transfer/api/transferClient", () => ({
  getCodexPrinciple: vi.fn().mockResolvedValue({
    id: "1",
    slug: "law-of-transfer",
    title: "Law of Transfer",
    body_md: "# Test Principle",
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z"
  }),
  logTransferEvent: vi.fn().mockResolvedValue(undefined),
  createVision: vi.fn().mockResolvedValue({
    id: "1",
    user_id: "user1",
    title: "Test Vision",
    description: "Test Description",
    tags: ["test"],
    created_at: "2025-01-01T00:00:00Z"
  }),
  addVisionMorph: vi.fn().mockResolvedValue({
    id: "1",
    vision_id: "1",
    phase_from: "circle",
    phase_to: "diamond",
    has_inner_core: true,
    fluidic_motion: true,
    created_at: "2025-01-01T00:00:00Z"
  })
}));

// Mock the feature flags
vi.mock("@/features/transfer/store/featureFlags", () => ({
  flags: {
    LAW_OF_TRANSFER: true
  }
}));

describe("Law of Transfer Components", () => {
  it("renders Law of Transfer codex page", async () => {
    render(<LawOfTransferPage />);
    expect(screen.getByText("Law of Transfer")).toBeInTheDocument();
    expect(screen.getByText("Geometry is alive, containerised, and transfers information via flow")).toBeInTheDocument();
  });

  it("renders Breath as Geometry practice module", () => {
    render(<BreathAsGeometry />);
    expect(screen.getByText("Breath as Living Geometry")).toBeInTheDocument();
    expect(screen.getByText("Start 3-Minute Practice")).toBeInTheDocument();
  });

  it("renders Vision Quick Capture", () => {
    render(<VisionQuickCapture />);
    expect(screen.getByText("Vision Quick Capture")).toBeInTheDocument();
    expect(screen.getByText("Save Vision + Morph")).toBeInTheDocument();
  });

  it("renders Connectivity Bridge Card", () => {
    render(<ConnectivityBridgeCard />);
    expect(screen.getByText("Mesh & Breath Analogy")).toBeInTheDocument();
    expect(screen.getByText("View SSUC Status & Sacred Voice Calling")).toBeInTheDocument();
  });

  it("renders Transfer Hub with all components", () => {
    render(<TransferHub />);
    expect(screen.getByText("Law of Transfer")).toBeInTheDocument();
    expect(screen.getByText("Breath as Living Geometry")).toBeInTheDocument();
    expect(screen.getByText("Vision Quick Capture")).toBeInTheDocument();
    expect(screen.getByText("Mesh & Breath Analogy")).toBeInTheDocument();
  });
});

describe("Law of Transfer Feature Flag", () => {
  it("shows disabled message when feature flag is false", () => {
    // Mock the feature flag as disabled
    vi.doMock("@/features/transfer/store/featureFlags", () => ({
      flags: {
        LAW_OF_TRANSFER: false
      }
    }));

    render(<TransferHub />);
    expect(screen.getByText("This feature is currently disabled")).toBeInTheDocument();
  });
});
