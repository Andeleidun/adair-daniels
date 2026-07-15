import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import DemoExpansionButton from './DemoExpansionButton';

afterEach(() => vi.restoreAllMocks());

const ExpansionHarness = (): React.ReactElement => {
  const [expanded, setExpanded] = useState(false);
  return (
    <DemoExpansionButton
      title="Example"
      expanded={expanded}
      onExpandedChange={setExpanded}
    />
  );
};

it('expands, collapses with Escape, and restores focus', () => {
  render(<ExpansionHarness />);
  fireEvent.click(
    screen.getByRole('button', { name: 'Expand Example demonstration' })
  );

  const collapse = screen.getByRole('button', {
    name: 'Collapse Example demonstration',
  });
  expect(collapse).toHaveClass('demo-expansion-button-expanded');
  expect(collapse).toHaveAttribute('aria-expanded', 'true');
  expect(collapse).toHaveFocus();

  fireEvent.keyDown(window, { key: 'Escape' });
  const expand = screen.getByRole('button', {
    name: 'Expand Example demonstration',
  });
  expect(expand).not.toHaveClass('demo-expansion-button-expanded');
  expect(expand).toHaveAttribute('aria-expanded', 'false');
  expect(expand).toHaveFocus();
});

it('removes its Escape listener when an expanded control unmounts', () => {
  const addEventListener = vi.spyOn(window, 'addEventListener');
  const removeEventListener = vi.spyOn(window, 'removeEventListener');
  const { unmount } = render(<ExpansionHarness />);
  fireEvent.click(
    screen.getByRole('button', { name: 'Expand Example demonstration' })
  );
  const keydownListener = addEventListener.mock.calls.find(
    ([eventName]) => eventName === 'keydown'
  )?.[1];
  expect(keydownListener).toEqual(expect.any(Function));

  unmount();

  expect(removeEventListener).toHaveBeenCalledWith('keydown', keydownListener);
});
