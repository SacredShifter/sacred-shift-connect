import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePhonePulseSensor } from '../../hooks/usePhonePulseSensor';

// More complete mock for media devices
beforeAll(() => {
    const mockTrack = {
        stop: vi.fn(),
        applyConstraints: vi.fn().mockResolvedValue(undefined),
        getCapabilities: () => ({
            torch: true
        })
    };
    const mockStream = {
        getTracks: () => [mockTrack],
        getVideoTracks: () => [mockTrack]
    };

    Object.defineProperty(global.navigator, 'mediaDevices', {
        value: {
            getUserMedia: vi.fn().mockResolvedValue(mockStream),
        },
        writable: true,
    });
});

afterEach(() => {
    vi.clearAllMocks();
});

describe('usePhonePulseSensor Mobile Compatibility', () => {
    it('should initialize without errors', () => {
        const { result } = renderHook(() => usePhonePulseSensor());
        expect(result.current.isSensing).toBe(false);
        expect(result.current.bpm).toBe(0);
        expect(result.current.error).toBeNull();
    });

    it('should call getUserMedia on startSensing', async () => {
        const { result } = renderHook(() => usePhonePulseSensor());

        await act(async () => {
            await result.current.startSensing();
        });

        expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({
            video: {
                facingMode: 'environment',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        });
    });

    it('should handle start and stop sensing correctly', async () => {
        const { result } = renderHook(() => usePhonePulseSensor());

        await act(async () => {
            await result.current.startSensing();
        });

        expect(result.current.isSensing).toBe(true);

        act(() => {
            result.current.stopSensing();
        });

        expect(result.current.isSensing).toBe(false);
    });

    it('should handle errors during startSensing', async () => {
        const errorMessage = 'Test error';
        // @ts-ignore
        navigator.mediaDevices.getUserMedia.mockRejectedValueOnce(new Error(errorMessage));
        const { result } = renderHook(() => usePhonePulseSensor());

        await act(async () => {
            await result.current.startSensing();
        });

        expect(result.current.error).toContain(errorMessage);
    });
});
