import '@testing-library/jest-dom/extend-expect';
import { cleanup } from '@testing-library/react';

const browserGetComputedStyle = window.getComputedStyle;
window.getComputedStyle = (element: Element) =>
  browserGetComputedStyle.call(window, element);

let consoleError: jest.SpyInstance;
let consoleWarn: jest.SpyInstance;

beforeEach(() => {
  consoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  consoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
});

afterEach(() => {
  cleanup();
  const errors = consoleError.mock.calls.slice();
  const warnings = consoleWarn.mock.calls.slice();
  consoleError.mockRestore();
  consoleWarn.mockRestore();
  jest.useRealTimers();
  jest.restoreAllMocks();

  if (errors.length > 0 || warnings.length > 0) {
    const calls = [...errors, ...warnings]
      .map((call) => call.map(String).join(' '))
      .join('\n');
    throw new Error(`Unexpected console output:\n${calls}`);
  }
});

if (typeof AbortController === 'undefined') {
  class TestAbortController {
    readonly signal = { aborted: false };

    abort(): void {
      this.signal.aborted = true;
    }
  }

  Object.defineProperty(global, 'AbortController', {
    value: TestAbortController,
    writable: true,
  });
}
