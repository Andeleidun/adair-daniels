import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import XKCD from './xkcd';
import {
  fetchComicBatch,
  fetchCurrentComic,
  XkcdComic,
  XkcdSlot,
} from './xkcdApi';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./xkcdApi', async () => {
  const actual = await vi.importActual<typeof import('./xkcdApi')>('./xkcdApi');
  return {
    ...actual,
    fetchCurrentComic: vi.fn(),
    fetchComicBatch: vi.fn(),
  };
});

const current = vi.mocked(fetchCurrentComic);
const batch = vi.mocked(fetchComicBatch);
const comic = (num: number): XkcdComic => ({
  kind: 'comic',
  num,
  title: `Synthetic Comic ${num}`,
  img: `https://example.test/${num}.png`,
  alt: `Alternative ${num}`,
});
const comics = (start: number) => [
  comic(start),
  comic(start + 1),
  comic(start + 2),
];

describe('XKCD', () => {
  beforeEach(() => {
    current.mockReset();
    batch.mockReset();
    current.mockResolvedValue(comic(10));
    batch.mockResolvedValue(comics(1));
  });

  it('expands from the introduction and restores the standard view', () => {
    const { container } = render(<XKCD />);
    const expand = screen.getByRole('button', {
      name: 'Expand XKCD Slideshow demonstration',
    });
    expect(expand.closest('.xkcd-intro')).toBeInTheDocument();

    fireEvent.click(expand);
    expect(container.querySelector('.xkcd')).toHaveClass(
      'demo-expanded-view',
      'xkcd-expanded'
    );
    expect(container.querySelector('.xkcd-intro')).toHaveClass(
      'xkcd-intro-expanded'
    );
    expect(
      screen.getByRole('button', {
        name: 'Collapse XKCD Slideshow demonstration',
      })
    ).toHaveFocus();

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(container.querySelector('.xkcd')).not.toHaveClass(
      'demo-expanded-view'
    );
    expect(
      screen.getByRole('button', {
        name: 'Expand XKCD Slideshow demonstration',
      })
    ).toHaveFocus();
  });

  it('loads metadata first and navigates in page-aligned batches', async () => {
    render(<XKCD />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading content');
    expect(
      await screen.findByRole('heading', { name: 'Synthetic Comic 1' })
    ).toBeVisible();
    expect(current.mock.invocationCallOrder[0]).toBeLessThan(
      batch.mock.invocationCallOrder[0]
    );
    expect(screen.getByRole('img', { name: 'Alternative 1' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'First' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
    expect(
      screen.getByRole('link', { name: /Randall Munroe over at XKCD/ })
    ).toHaveAttribute('href', 'https://xkcd.com');

    batch.mockResolvedValueOnce(comics(4));
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(
      await screen.findByRole('heading', { name: 'Synthetic Comic 4' })
    ).toBeVisible();
    expect(batch).toHaveBeenLastCalledWith(4, 10, expect.anything());

    batch.mockResolvedValueOnce([comic(10)]);
    fireEvent.click(screen.getByRole('button', { name: 'Last' }));
    expect(
      await screen.findByRole('heading', { name: 'Synthetic Comic 10' })
    ).toBeVisible();
    expect(batch).toHaveBeenLastCalledWith(10, 10, expect.anything());
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Last' })).toBeDisabled();

    batch.mockResolvedValueOnce(comics(7));
    fireEvent.click(screen.getByRole('button', { name: 'Previous' }));
    expect(
      await screen.findByRole('heading', { name: 'Synthetic Comic 7' })
    ).toBeVisible();
    expect(batch).toHaveBeenLastCalledWith(7, 10, expect.anything());

    batch.mockResolvedValueOnce(comics(1));
    fireEvent.click(screen.getByRole('button', { name: 'First' }));
    expect(
      await screen.findByRole('heading', { name: 'Synthetic Comic 1' })
    ).toBeVisible();
    expect(batch).toHaveBeenLastCalledWith(1, 10, expect.anything());
  });

  it('keeps a successful batch visible during navigation and failure, then retries', async () => {
    render(<XKCD />);
    await screen.findByRole('heading', { name: 'Synthetic Comic 1' });
    let rejectNavigation: (error: Error) => void = () => undefined;
    batch.mockImplementationOnce(
      () =>
        new Promise<XkcdSlot[]>((_resolve, reject) => {
          rejectNavigation = reject;
        })
    );
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByRole('status')).toHaveTextContent('Loading comics');
    expect(
      screen.getByRole('heading', { name: 'Synthetic Comic 1' })
    ).toBeVisible();
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
    act(() => rejectNavigation(new Error('offline')));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      /batch could not/
    );
    expect(
      screen.getByRole('heading', { name: 'Synthetic Comic 1' })
    ).toBeVisible();

    batch.mockResolvedValueOnce(comics(4));
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(
      await screen.findByRole('heading', { name: 'Synthetic Comic 4' })
    ).toBeVisible();
  });

  it('renders definitive missing comics as accessible unavailable slots', async () => {
    batch.mockResolvedValueOnce([
      comic(1),
      { kind: 'unavailable', num: 2 },
      comic(3),
    ]);
    render(<XKCD />);
    expect(await screen.findByText('Comic #2 unavailable')).toHaveAttribute(
      'role',
      'status'
    );
  });

  it('shows a retryable initial failure', async () => {
    current
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(comic(10));
    render(<XKCD />);
    expect(await screen.findByRole('alert')).toHaveTextContent(
      /could not be loaded/
    );
    batch.mockResolvedValueOnce(comics(1));
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    await screen.findByRole('heading', { name: 'Synthetic Comic 1' });
  });

  it('aborts an active batch on unmount and ignores its late completion', async () => {
    let resolveBatch: (value: XkcdSlot[]) => void = () => undefined;
    batch.mockImplementationOnce(
      () =>
        new Promise<XkcdSlot[]>((resolve) => {
          resolveBatch = resolve;
        })
    );
    const { unmount } = render(<XKCD />);
    await act(async () => {
      await new Promise((resolve) => window.setTimeout(resolve, 0));
      await Promise.resolve();
    });
    expect(batch).toHaveBeenCalledTimes(1);
    const signal = batch.mock.calls[0][2] as AbortSignal;

    unmount();
    expect(signal.aborted).toBe(true);
    await act(async () => {
      resolveBatch(comics(1));
      await Promise.resolve();
    });
  });
});
