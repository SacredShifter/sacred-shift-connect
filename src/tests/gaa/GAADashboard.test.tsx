import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GAADashboard } from '@/components/gaa/GAADashboard';
import { useGAAEngine } from '@/hooks/useGAAEngine';
import { useCollectiveGAA } from '@/hooks/useCollectiveGAA';
import { SignalQuality } from '@/hooks/usePhonePulseSensor';

// Mock the hooks
vi.mock('@/hooks/useGAAEngine');
vi.mock('@/hooks/useCollectiveGAA');

// Mock lucide-react icons
vi.mock('lucide-react', () => {
  return new Proxy({}, {
      get: (target, key) => {
          if (key === '__esModule') {
              return true;
          }
          return (props) => <div data-testid={`icon-${String(key)}`} {...props} />;
      }
  });
});

const mockUseGAAEngine = useGAAEngine as vi.Mock;
const mockUseCollectiveGAA = useCollectiveGAA as vi.Mock;

describe('GAADashboard', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockUseGAAEngine.mockClear();
    mockUseCollectiveGAA.mockClear();
  });

  it('should display live engine and sensor data, not hardcoded mocks', () => {
    // Arrange: Setup mock return values for the hooks
    mockUseGAAEngine.mockReturnValue({
      state: {
        isInitialized: true,
        isPlaying: true,
        activeOscillators: 7,
        shadowState: {
          lastOutputs: {
            fHz: 396.1,
          },
          heartVariability: 68,
          currentPhase: 'active',
          polarityBalance: 0.6,
        },
        safetyAlerts: [],
      },
      phonePulseSensor: {
        isSensing: true,
        bpm: 82,
        signalQuality: 'good' as SignalQuality,
      },
      accelerometer: {
        isSensing: false,
        bpm: 0,
        signalQuality: 'no_signal' as SignalQuality,
      },
      initializeGAA: vi.fn(),
      startGAA: vi.fn(),
      stopGAA: vi.fn(),
    });

    mockUseCollectiveGAA.mockReturnValue({
      coherence: 0.92,
      participants: [{}, {}, {}], // 3 participants
      collectiveField: null,
      connectionStatus: 'connected',
      sessionId: 'mock-session-id',
    });

    // Act: Render the component
    render(<GAADashboard />);

    // Assert: Check that the dashboard displays the live data from our mocks

    // Engine State Card
    const oscillatorCount = screen.getByText('7');
    const frequency = screen.getByText('396.1');
    const coherence = screen.getByText('92');

    expect(oscillatorCount).toBeInTheDocument();
    expect(frequency).toBeInTheDocument();
    expect(coherence).toBeInTheDocument();

    // Biofeedback Status Card
    const heartRate = screen.getByText('82');
    const signalQuality = screen.getByText('good');

    expect(heartRate).toBeInTheDocument();
    expect(signalQuality).toBeInTheDocument();
    expect(screen.getByText('Camera')).toBeInTheDocument();

    // Header badges
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument(); // Participant count
  });
});
