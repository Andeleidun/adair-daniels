import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import XKCDViewer from './xkcd.codeview';

vi.mock('./xkcd.tsx?raw', () => ({
  default: 'XKCD COMPONENT SOURCE',
}));
vi.mock('./xkcdApi.ts?raw', () => ({
  default: 'XKCD ADAPTER SOURCE',
}));
vi.mock('../../Services/remoteData.ts?raw', () => ({
  default: 'SHARED TRANSPORT SOURCE',
}));

it('includes the XKCD component, adapter, and shared transport', () => {
  render(<XKCDViewer />);
  const source = screen.getByLabelText('Source code');

  expect(source).toHaveTextContent('// XKCD component');
  expect(source).toHaveTextContent('XKCD COMPONENT SOURCE');
  expect(source).toHaveTextContent('XKCD ADAPTER SOURCE');
  expect(source).toHaveTextContent('SHARED TRANSPORT SOURCE');
});
