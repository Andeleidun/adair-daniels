import React from 'react';
import { render, screen } from '@testing-library/react';
import XKCDViewer from './xkcd.codeview';

jest.mock('!!raw-loader!./xkcd', () => 'XKCD COMPONENT SOURCE', {
  virtual: true,
});
jest.mock('!!raw-loader!./xkcdApi', () => 'XKCD ADAPTER SOURCE', {
  virtual: true,
});
jest.mock(
  '!!raw-loader!../../Services/remoteData',
  () => 'SHARED TRANSPORT SOURCE',
  { virtual: true }
);

it('includes the XKCD component, adapter, and shared transport', () => {
  render(<XKCDViewer />);
  const source = screen.getByLabelText('Source code');

  expect(source).toHaveTextContent('// XKCD component');
  expect(source).toHaveTextContent('XKCD COMPONENT SOURCE');
  expect(source).toHaveTextContent('XKCD ADAPTER SOURCE');
  expect(source).toHaveTextContent('SHARED TRANSPORT SOURCE');
});
