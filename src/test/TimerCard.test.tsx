import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TimerCard } from '../components/TimerCard';
import { Timer } from '../types/timer';
import { timerApi } from '../api/timerApi';

vi.mock('../api/timerApi');

describe('TimerCard Component', () => {
  const mockTimer: Timer = {
    id: '1',
    name: 'Test Timer',
    description: 'Test Description',
    elapsed: 3600,
    isRunning: false,
    createdAt: Date.now(),
  };

  const mockOnUpdate = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('displays timer name, description, and formatted time', () => {
    render(<TimerCard timer={mockTimer} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    expect(screen.getByRole('heading', { name: /test timer/i })).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('01:00:00')).toBeInTheDocument();
  });

  it('calls onUpdate when user clicks start button', async () => {
    const user = userEvent.setup();
    const updatedTimer = { ...mockTimer, isRunning: true };
    vi.mocked(timerApi.updateTimer).mockResolvedValue({ data: updatedTimer });

    render(<TimerCard timer={mockTimer} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    await user.click(screen.getByRole('button', { name: /start/i }));

    await waitFor(() => {
      expect(timerApi.updateTimer).toHaveBeenCalledWith(
        '1',
        expect.objectContaining({ isRunning: true })
      );
    });

    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalled();
    });
  });

  it('shows edit form when user clicks edit button', async () => {
    const user = userEvent.setup();

    render(<TimerCard timer={mockTimer} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    await user.click(screen.getByRole('button', { name: /edit/i }));

    expect(screen.getByPlaceholderText(/enter timer name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('hides edit form when user clicks cancel button', async () => {
    const user = userEvent.setup();

    render(<TimerCard timer={mockTimer} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    await user.click(screen.getByRole('button', { name: /edit/i }));
    expect(screen.getByPlaceholderText(/enter timer name/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /cancel/i }));
    expect(screen.queryByPlaceholderText(/enter timer name/i)).not.toBeInTheDocument();
  });

  it('shows pause button when timer is running', () => {
    const runningTimer = { ...mockTimer, isRunning: true };

    render(<TimerCard timer={runningTimer} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /start/i })).not.toBeInTheDocument();
  });

  it('shows delete confirmation when user clicks delete button', async () => {
    const user = userEvent.setup();

    render(<TimerCard timer={mockTimer} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    await user.click(screen.getByRole('button', { name: /delete timer/i }));

    expect(screen.getByRole('button', { name: /confirm delete timer/i })).toBeInTheDocument();
  });

  it('calls onDelete when user confirms deletion', async () => {
    const user = userEvent.setup();
    vi.mocked(timerApi.deleteTimer).mockResolvedValue({ data: undefined });

    render(<TimerCard timer={mockTimer} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    await user.click(screen.getByRole('button', { name: /delete timer/i }));
    await user.click(screen.getByRole('button', { name: /confirm delete timer/i }));

    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalledWith('1');
    });
  });

  it('cancels deletion when user clicks cancel', async () => {
    const user = userEvent.setup();

    render(<TimerCard timer={mockTimer} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    await user.click(screen.getByRole('button', { name: /delete timer/i }));
    expect(screen.getByRole('button', { name: /confirm delete timer/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /cancel delete/i }));
    expect(screen.queryByRole('button', { name: /confirm delete timer/i })).not.toBeInTheDocument();
  });
});
