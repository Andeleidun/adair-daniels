import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import Portal from './Portal';

afterEach(() => vi.useRealTimers());

it('provides a safe fallback and settles its bounded loading state', async () => {
  vi.useFakeTimers();
  const { rerender } = render(
    <Portal
      url="https://andeleidun.github.io/robot-arena/"
      title="Robot Battle Arena"
    />
  );
  const frame = screen.getByTitle('Robot Battle Arena');
  const frameContainer = frame.parentElement;
  expect(frameContainer).toHaveAttribute('aria-busy', 'true');
  expect(frame).toHaveAttribute(
    'src',
    'https://andeleidun.github.io/robot-arena/'
  );
  expect(frame).toHaveAttribute('loading', 'lazy');
  expect(frame).toHaveAttribute('referrerpolicy', 'no-referrer');
  const fallback = screen.getByRole('link', {
    name: /Open Robot Battle Arena/,
  });
  expect(fallback).toHaveAttribute('target', '_blank');
  expect(screen.getByRole('status')).toHaveTextContent(
    'Loading Robot Battle Arena'
  );

  await act(() => vi.advanceTimersByTimeAsync(10000));
  const waitingStatus = screen.getByRole('status');
  expect(waitingStatus).toHaveTextContent('still loading');
  expect(waitingStatus.querySelector('.MuiCircularProgress-root')).toBeNull();
  expect(frameContainer).toHaveAttribute('aria-busy', 'false');
  fireEvent.load(frame);
  expect(screen.queryByRole('status')).toBeNull();
  expect(frameContainer).toHaveAttribute('aria-busy', 'false');

  rerender(<Portal url="https://example.test/updated" title="Updated demo" />);
  expect(screen.getByTitle('Updated demo')).toHaveAttribute(
    'src',
    'https://example.test/updated'
  );
  expect(screen.getByRole('status')).toHaveTextContent('Loading Updated demo');
});
