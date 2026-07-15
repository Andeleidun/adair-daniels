import React from 'react';
import { render, screen } from '@testing-library/react';
import SourceViewer from './SourceViewer';

it('renders highlighted source as text without creating executable markup', () => {
  const { container } = render(
    <SourceViewer value={'<script>window.example = true;</script>'} />
  );

  expect(screen.getByLabelText('Source code')).toHaveTextContent(
    '<script>window.example = true;</script>'
  );
  expect(container.querySelector('script')).toBeNull();
});
