import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Card from './Card';

describe('Card', () => {
  it('renders content, media, and correctly typed actions', () => {
    const onClick = vi.fn();
    const { container } = render(
      <Card
        title="Card title"
        text="Card text"
        media={{
          src: 'image.png',
          alt: 'Card artwork',
          width: 200,
          height: 100,
        }}
        content={<span>Card content</span>}
        links={[
          { kind: 'external', text: 'External', url: 'https://example.test' },
          { kind: 'button', text: 'Action', onClick },
        ]}
      />
    );

    expect(screen.getByRole('heading', { name: 'Card title' })).toBeVisible();
    expect(screen.getByText('Card text')).toBeVisible();
    expect(screen.getByText('Card content')).toBeVisible();
    const media = screen.getByRole('img', { name: 'Card artwork' });
    expect(media).toHaveAttribute('width', '200');
    expect(media).toHaveAttribute('loading', 'lazy');
    const external = screen.getByRole('link', { name: /External/ });
    expect(external).toHaveAttribute('href', 'https://example.test');
    expect(external).toHaveAttribute('target', '_blank');
    expect(external).toHaveAttribute('rel', 'noopener noreferrer');
    fireEvent.click(screen.getByRole('button', { name: 'Action' }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(container.querySelector('a[href=""]')).not.toBeInTheDocument();
  });
});
