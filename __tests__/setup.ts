import { afterEach, beforeAll, expect, vi } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import LocalStorageMock from './localStorageMock';

expect.extend(matchers);

beforeAll(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;

  const { getComputedStyle } = global;

  vi.stubGlobal('getComputedStyle', elt => getComputedStyle(elt));
  vi.stubGlobal('localStorage', new LocalStorageMock());
  vi.stubGlobal('Dialog', { openDialogWindow: vi.fn });
  vi.stubGlobal('Main', { sendMessage: vi.fn });
  vi.stubGlobal('Broadcast', { on: () => vi.fn, emit: vi.fn });

  vi.stubGlobal('requestIdleCallback', vi.fn);
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))
  );
});

afterEach(() => {
  cleanup();
});
