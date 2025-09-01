import React from 'react';

interface StorytellingOverlayProps {
  nodeCount: number;
  globalCoherence: number;
}

const getStoryMessage = (nodeCount: number, globalCoherence: number): string => {
  if (nodeCount < 10) {
    return "The field is quiet. More lights are needed to awaken the grid.";
  }
  if (nodeCount >= 10 && nodeCount < 100) {
    if (globalCoherence > 0.7) {
        return "Local coherence is rising. A shared sense of self is emerging.";
    }
    return "The first sparks of connection are forming.";
  }
  if (nodeCount >= 100 && nodeCount < 1000) {
    if (globalCoherence > 0.8) {
        return "The planetary field is stabilizing. Soul resonance is within reach.";
    }
    return "A network of souls is weaving together across the planet.";
  }
  if (nodeCount >= 1000 && nodeCount < 100000) {
    if (globalCoherence > 0.9) {
        return "Archetypal energies are flowing. The collective dream is awakening.";
    }
    return "The mind of the planet begins to stir.";
  }
  if (nodeCount >= 100000) {
    return "A remembrance gateway is opening. The source code is accessible.";
  }
  return "";
};

export const StorytellingOverlay: React.FC<StorytellingOverlayProps> = ({ nodeCount, globalCoherence }) => {
  const message = getStoryMessage(nodeCount, globalCoherence);

  if (!message) {
    return null;
  }

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'white',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: '10px 20px',
        borderRadius: '10px',
        fontFamily: 'sans-serif',
        fontSize: '16px',
        textAlign: 'center',
        zIndex: 101, // Above the canvas
      }}
    >
      {message}
    </div>
  );
};
