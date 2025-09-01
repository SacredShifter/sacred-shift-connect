import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

// IMPORTANT: mock BEFORE importing the page
vi.mock('./scene/ShiftCanvas', () => ({
  default: () => <div data-testid="shift-canvas-stub" />,
}));

import ShiftPage from './ShiftPage';

describe('ShiftPage', () => {
  it('renders route shell, canvas stub, and toggles play/pause', () => {
    render(
      <MemoryRouter>
        <ShiftPage />
      </MemoryRouter>
    );

    // Initial state
    const playButton = screen.getByRole('button', { name: /play/i });
    expect(playButton).toBeInTheDocument();
    expect(screen.getByTestId('shift-canvas-stub')).toBeInTheDocument();

    // Click to play
    fireEvent.click(playButton);

    // Paused state
    const pauseButton = screen.getByRole('button', { name: /pause/i });
    expect(pauseButton).toBeInTheDocument();
  });
});
