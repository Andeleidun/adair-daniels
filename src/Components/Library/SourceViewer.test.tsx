import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import SourceViewer from './SourceViewer';

it('renders highlighted source as text without creating executable markup', () => {
  const { container } = render(
    <SourceViewer value={'<script>window.example = true;</script>'} />
  );

  const source = screen.getByLabelText('Source code');
  expect(source).toHaveTextContent('<script>window.example = true;</script>');
  expect(source).toHaveAttribute('tabindex', '0');
  expect(container.querySelector('script')).toBeNull();
});
