import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi, type MockInstance } from 'vitest';

const browserGetComputedStyle = window.getComputedStyle;
window.getComputedStyle = (element: Element) =>
  browserGetComputedStyle.call(window, element);

let consoleError: MockInstance;
let consoleWarn: MockInstance;

beforeEach(() => {
  consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
});

afterEach(() => {
  cleanup();
  const errors = consoleError.mock.calls.slice();
  const warnings = consoleWarn.mock.calls.slice();
  consoleError.mockRestore();
  consoleWarn.mockRestore();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.clearAllMocks();
  vi.unstubAllGlobals();

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

  Object.defineProperty(globalThis, 'AbortController', {
    value: TestAbortController,
    writable: true,
  });
}
