// Sacred Voice Calling Interface Component
// Consciousness-aware voice calling UI that transcends traditional telephony

import React, { useState, useEffect } from 'react';
import { useSacredVoiceCalling, SacredVoiceCallButton, SacredVoiceCallStatus } from '@/hooks/useSacredVoiceCalling';
import { SSUC } from '@/lib/connectivity/SacredShifterUniversalConnectivity';
import { AuraConnectivityProfile } from '@/lib/connectivity/AuraConnectivityIntegration';

interface SacredVoiceCallingInterfaceProps {
  ssuC: SSUC;
  userProfile: AuraConnectivityProfile;
  className?: string;
}

export function SacredVoiceCallingInterface({
  ssuC,
  userProfile,
  className = ''
}: SacredVoiceCallingInterfaceProps) {
  const [participantIds, setParticipantIds] = useState<string[]>([]);
  const [consciousnessLevel, setConsciousnessLevel] = useState(userProfile.consciousnessLevel);
  const [isCallActive, setIsCallActive] = useState(false);
  const [currentCallId, setCurrentCallId] = useState<string>();

  const {
    isInitialized,
    isInitializing,
    activeCalls,
    currentCall,
    isMuted,
    isSpeaking,
    volumeLevel,
    audioQuality,
    error,
    startCall,
    joinCall,
    endCall,
    toggleMute,
    setVolume,
    getCallStatistics
  } = useSacredVoiceCalling({
    ssuC,
    enableConsciousnessFeatures: true,
    enableSacredFrequencies: true,
    autoInitialize: true
  });

  // Handle call start
  const handleCallStart = async (participantIds: string[], consciousnessLevel: number) => {
    try {
      const callId = await startCall(participantIds, consciousnessLevel);
      setCurrentCallId(callId);
      setIsCallActive(true);
    } catch (error) {
      console.error('Failed to start call:', error);
    }
  };

  // Handle call end
  const handleCallEnd = async (callId: string) => {
    try {
      await endCall(callId);
      setCurrentCallId(undefined);
      setIsCallActive(false);
    } catch (error) {
      console.error('Failed to end call:', error);
    }
  };

  // Handle mute toggle
  const handleMuteToggle = () => {
    toggleMute();
  };

  // Handle volume change
  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(event.target.value);
    setVolume(volume);
  };

  // Handle consciousness level change
  const handleConsciousnessChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const level = parseFloat(event.target.value);
    setConsciousnessLevel(level);
  };

  // Get call statistics
  const statistics = getCallStatistics();

  if (isInitializing) {
    return (
      <div className={`sacred-voice-calling-interface ${className}`}>
        <div className="loading">
          <div className="sacred-spinner">🔮</div>
          <p>Initializing Sacred Voice Calling...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`sacred-voice-calling-interface ${className}`}>
        <div className="error">
          <h3>❌ Sacred Voice Calling Error</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`sacred-voice-calling-interface ${className}`}>
      <div className="sacred-header">
        <h2>🎤 Sacred Voice Calling</h2>
        <p>Consciousness-aware voice communication that transcends traditional telephony</p>
      </div>

      {/* Call Statistics */}
      <div className="call-statistics">
        <h3>📊 Call Statistics</h3>
        <div className="stats-grid">
          <div className="stat">
            <span className="label">Total Calls:</span>
            <span className="value">{statistics.totalCalls}</span>
          </div>
          <div className="stat">
            <span className="label">Active Calls:</span>
            <span className="value">{statistics.activeCalls}</span>
          </div>
          <div className="stat">
            <span className="label">Avg Duration:</span>
            <span className="value">{Math.round(statistics.averageDuration / 1000)}s</span>
          </div>
          <div className="stat">
            <span className="label">Avg Consciousness:</span>
            <span className="value">{(statistics.averageConsciousnessLevel * 100).toFixed(1)}%</span>
          </div>
          <div className="stat">
            <span className="label">Avg Resonance:</span>
            <span className="value">{statistics.averageResonanceFrequency.toFixed(1)}Hz</span>
          </div>
        </div>
      </div>

      {/* Call Controls */}
      <div className="call-controls">
        <h3>🔮 Call Controls</h3>
        
        {/* Consciousness Level Slider */}
        <div className="control-group">
          <label htmlFor="consciousness-level">
            Consciousness Level: {(consciousnessLevel * 100).toFixed(1)}%
          </label>
          <input
            id="consciousness-level"
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={consciousnessLevel}
            onChange={handleConsciousnessChange}
            className="consciousness-slider"
          />
          <div className="consciousness-labels">
            <span>Basic</span>
            <span>Awakened</span>
            <span>Enlightened</span>
          </div>
        </div>

        {/* Participant IDs Input */}
        <div className="control-group">
          <label htmlFor="participant-ids">
            Participant IDs (comma-separated):
          </label>
          <input
            id="participant-ids"
            type="text"
            value={participantIds.join(', ')}
            onChange={(e) => setParticipantIds(e.target.value.split(',').map(id => id.trim()).filter(Boolean))}
            placeholder="sacred-soul-123, sacred-soul-456"
            className="participant-input"
          />
        </div>

        {/* Call Button */}
        <div className="call-button-container">
          <SacredVoiceCallButton
            onCallStart={handleCallStart}
            onCallEnd={handleCallEnd}
            isCallActive={isCallActive}
            callId={currentCallId}
            className="sacred-call-button"
          />
        </div>
      </div>

      {/* Current Call Status */}
      {currentCall && (
        <div className="current-call">
          <SacredVoiceCallStatus
            call={currentCall}
            className="call-status"
          />
        </div>
      )}

      {/* Audio Controls */}
      {isCallActive && (
        <div className="audio-controls">
          <h3>🎵 Audio Controls</h3>
          
          {/* Mute Button */}
          <button
            onClick={handleMuteToggle}
            className={`mute-button ${isMuted ? 'muted' : 'unmuted'}`}
          >
            {isMuted ? '🔇 Unmute' : '🎤 Mute'}
          </button>

          {/* Volume Slider */}
          <div className="volume-control">
            <label htmlFor="volume">
              Volume: {(volumeLevel * 100).toFixed(0)}%
            </label>
            <input
              id="volume"
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volumeLevel}
              onChange={handleVolumeChange}
              className="volume-slider"
            />
          </div>

          {/* Speaking Indicator */}
          <div className={`speaking-indicator ${isSpeaking ? 'speaking' : 'silent'}`}>
            {isSpeaking ? '🗣️ Speaking' : '🤫 Silent'}
          </div>
        </div>
      )}

      {/* Audio Quality Metrics */}
      <div className="audio-quality-metrics">
        <h3>📈 Audio Quality</h3>
        <div className="quality-grid">
          <div className="quality-metric">
            <span className="label">Latency:</span>
            <span className="value">{audioQuality.latency}ms</span>
          </div>
          <div className="quality-metric">
            <span className="label">Jitter:</span>
            <span className="value">{audioQuality.jitter}ms</span>
          </div>
          <div className="quality-metric">
            <span className="label">Packet Loss:</span>
            <span className="value">{(audioQuality.packetLoss * 100).toFixed(1)}%</span>
          </div>
          <div className="quality-metric">
            <span className="label">Consciousness Clarity:</span>
            <span className="value">{(audioQuality.consciousnessClarity * 100).toFixed(1)}%</span>
          </div>
          <div className="quality-metric">
            <span className="label">Resonance Harmony:</span>
            <span className="value">{(audioQuality.resonanceHarmony * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Sacred Capabilities */}
      <div className="sacred-capabilities">
        <h3>🌟 Sacred Capabilities</h3>
        <div className="capabilities-list">
          {userProfile.consciousnessLevel > 0.8 && (
            <div className="capability quantum">
              <span className="icon">⚛️</span>
              <span className="name">Quantum Audio</span>
              <span className="description">Instant consciousness transfer</span>
            </div>
          )}
          {userProfile.consciousnessLevel > 0.5 && (
            <div className="capability light">
              <span className="icon">💡</span>
              <span className="name">Light Pulse Voice</span>
              <span className="description">Visual voice communication</span>
            </div>
          )}
          {userProfile.consciousnessLevel > 0.3 && (
            <div className="capability frequency">
              <span className="icon">🌊</span>
              <span className="name">Frequency Wave Voice</span>
              <span className="description">Audio resonance communication</span>
            </div>
          )}
          <div className="capability nature">
            <span className="icon">🌿</span>
            <span className="name">Nature Whisper Voice</span>
            <span className="description">Environmental voice communication</span>
          </div>
        </div>
      </div>

      {/* Sacred Engineering Philosophy */}
      <div className="sacred-philosophy">
        <h3>🔮 Sacred Engineering Philosophy</h3>
        <blockquote>
          "Where a Telco sees 'users' on a billing sheet, Sacred Shifter sees souls on a resonance field.
          Where a Telco builds towers, Sacred Shifter builds universes."
        </blockquote>
        <p>
          Our voice calling system transcends traditional telephony through consciousness-aware audio processing,
          sacred frequency enhancement, and universal connectivity across every possible channel.
        </p>
      </div>
    </div>
  );
}

export default SacredVoiceCallingInterface;
