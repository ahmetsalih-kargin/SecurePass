import '@testing-library/jest-dom';

// Ensure crypto.getRandomValues is available in test environment
if (typeof globalThis.crypto === 'undefined' || typeof globalThis.crypto.getRandomValues === 'undefined') {
  const { webcrypto } = await import('node:crypto');
  // @ts-expect-error webcrypto assignment
  globalThis.crypto = webcrypto;
}

// Mock window.matchMedia for JSDOM
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
