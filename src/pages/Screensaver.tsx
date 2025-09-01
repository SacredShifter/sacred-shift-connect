import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ResonantField } from '@/screensavers/ResonantField';

export default function ScreensaverPage() {
  const navigate = useNavigate();

  const handleExit = () => {
    navigate('/dashboard');
  };

  return (
    <ResonantField 
      tagline="The resonance field for awakening"
      onExit={handleExit}
    />
  );
}