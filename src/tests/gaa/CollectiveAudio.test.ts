import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CollectiveSessionManager } from '@/utils/gaa/CollectiveSessionManager';
// Mock MediaStream
vi.stubGlobal('MediaStream', vi.fn());
import { WebRTCManager } from '@/utils/webrtc';
import { CollectiveSync } from '@/utils/gaa/CollectiveSync';
import { AudioStreamer } from '@/utils/audio/AudioStreamer';

// Mock the dependencies
vi.mock('@/utils/webrtc');
vi.mock('@/utils/gaa/CollectiveSync');
vi.mock('@/utils/audio/AudioStreamer');

describe('CollectiveSessionManager', () => {
  let peerA: CollectiveSessionManager;
  let peerB: CollectiveSessionManager;

  let webRTCManagerA: WebRTCManager;
  let webRTCManagerB: WebRTCManager;

  let collectiveSyncA: CollectiveSync;
  let collectiveSyncB: CollectiveSync;

  let audioStreamerA: AudioStreamer;

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

    // Setup mock instances
    const mockOnPhaseUpdateA = vi.fn();
    const mockOnPhaseUpdateB = vi.fn();
    const mockOnRemoteStream = vi.fn();
    const mockOnCallEnd = vi.fn();
    const mockOnIncomingCall = vi.fn();

    peerA = new CollectiveSessionManager('userA', mockOnPhaseUpdateA, mockOnRemoteStream, mockOnCallEnd, mockOnIncomingCall);
    peerB = new CollectiveSessionManager('userB', mockOnPhaseUpdateB, mockOnRemoteStream, mockOnCallEnd, mockOnIncomingCall);

    // Get the mocked instances from the constructor
    webRTCManagerA = (WebRTCManager as any).mock.instances[0];
    webRTCManagerB = (WebRTCManager as any).mock.instances[1];
    collectiveSyncA = (CollectiveSync as any).mock.instances[0];
    collectiveSyncB = (CollectiveSync as any).mock.instances[1];
    audioStreamerA = (AudioStreamer as any).mock.instances[0];

    // Mock sendData to simulate a connection
    const sendDataA = webRTCManagerA.sendData as any;
    const sendDataB = webRTCManagerB.sendData as any;

    const webRtcMock = vi.mocked(WebRTCManager);
    const onDataChannelMessageA = webRtcMock.mock.calls[0][3];
    const onDataChannelMessageB = webRtcMock.mock.calls[1][3];

    sendDataA.mockImplementation((data) => {
      onDataChannelMessageB({ data } as MessageEvent);
    });
    sendDataB.mockImplementation((data) => {
      onDataChannelMessageA({ data } as MessageEvent);
    });
  });

  it('should start the audio streamer and pass the stream to the WebRTC manager', async () => {
    const mockStream = new MediaStream();
    vi.mocked(audioStreamerA.getStream).mockReturnValue(mockStream);

    await peerA.startCall('userB');

    expect(audioStreamerA.start).toHaveBeenCalled();
    expect(webRTCManagerA.initializeCall).toHaveBeenCalledWith('userB', mockStream);
  });

  it('should send and receive sync messages between peers', async () => {
    const syncMessage = { type: 'phase_sync', nodeId: 'userA', timestamp: 123, phase: 1, frequency: 1 };
    const startSyncA = (CollectiveSync as any).mock.instances[0].startSync;
    const sendMessageA = startSyncA?.mock?.calls?.[0]?.[0];
    
    if (sendMessageA) {
      sendMessageA(syncMessage);
      expect(webRTCManagerA.sendData).toHaveBeenCalledWith(JSON.stringify(syncMessage));
      expect(collectiveSyncB.handleSyncMessage).toHaveBeenCalledWith(syncMessage, expect.any(Number));
    }
  });
});
