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
  expect(frame).toHaveAttribute('sandbox', 'allow-scripts allow-same-origin');
  const fallback = screen.getByRole('link', {
    name: /Open Robot Battle Arena/,
  });
  expect(fallback).toHaveAttribute('target', '_blank');
  const expand = screen.getByRole('button', {
    name: 'Expand Robot Battle Arena demonstration',
  });
  expect(screen.getByRole('status')).toHaveTextContent(
    'Loading Robot Battle Arena'
  );

  fireEvent.click(expand);
  const collapse = screen.getByRole('button', {
    name: 'Collapse Robot Battle Arena demonstration',
  });
  expect(collapse).toHaveFocus();
  expect(screen.getByTitle('Robot Battle Arena')).toBe(frame);
  expect(screen.queryByText('Interactive demonstration')).toBeNull();
  expect(
    screen.queryByRole('link', { name: /Open Robot Battle Arena/ })
  ).toBeNull();

  await act(() => vi.advanceTimersByTimeAsync(10000));
  const waitingStatus = screen.getByRole('status');
  expect(waitingStatus).toHaveTextContent('still loading');
  expect(waitingStatus.querySelector('.MuiCircularProgress-root')).toBeNull();
  expect(frameContainer).toHaveAttribute('aria-busy', 'false');
  const expandedFallback = screen.getByRole('link', {
    name: /Open Robot Battle Arena/,
  });
  expect(expandedFallback).toHaveAttribute('target', '_blank');
  expect(expandedFallback).toHaveAttribute('rel', 'noopener noreferrer');
  expect(waitingStatus).not.toContainElement(expandedFallback);

  fireEvent.keyDown(window, { key: 'Escape' });
  expect(
    screen.getByRole('button', {
      name: 'Expand Robot Battle Arena demonstration',
    })
  ).toHaveFocus();
  expect(screen.getByTitle('Robot Battle Arena')).toBe(frame);
  expect(
    screen.getByRole('link', { name: /Open Robot Battle Arena/ })
  ).toHaveAttribute('href', 'https://andeleidun.github.io/robot-arena/');
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

it('reports expansion changes when controlled by the application shell', () => {
  const onExpandedChange = vi.fn();
  const { rerender } = render(
    <Portal
      url="https://example.test/demo"
      title="Example demo"
      expanded={false}
      onExpandedChange={onExpandedChange}
    />
  );

  fireEvent.click(
    screen.getByRole('button', {
      name: 'Expand Example demo demonstration',
    })
  );
  expect(onExpandedChange).toHaveBeenLastCalledWith(true);
  expect(
    screen.queryByRole('button', {
      name: 'Collapse Example demo demonstration',
    })
  ).toBeNull();

  rerender(
    <Portal
      url="https://example.test/demo"
      title="Example demo"
      expanded
      onExpandedChange={onExpandedChange}
    />
  );
  const collapse = screen.getByRole('button', {
    name: 'Collapse Example demo demonstration',
  });
  expect(collapse).toHaveFocus();
  fireEvent.click(collapse);
  expect(onExpandedChange).toHaveBeenLastCalledWith(false);

  rerender(
    <Portal
      url="https://example.test/demo"
      title="Example demo"
      expanded={false}
      onExpandedChange={onExpandedChange}
    />
  );
  expect(
    screen.getByRole('button', {
      name: 'Expand Example demo demonstration',
    })
  ).toHaveFocus();
});
