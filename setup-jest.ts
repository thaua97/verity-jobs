(async function initPreset() {
  const candidates = [
    'jest-preset-angular/setup-jest',
    'jest-preset-angular/setup-jest.js',
    'jest-preset-angular/setup-jest.cjs',
    // .mjs must be loaded via dynamic import
  ];
  let loaded = false;
  for (const mod of candidates) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require(mod);
      loaded = true;
      break;
    } catch {}
  }
  if (!loaded) {
    try {
      await import('jest-preset-angular/setup-jest.mjs');
      loaded = true;
    } catch {}
  }
  if (!loaded) {
    // Helpful hint if resolution fails
    // eslint-disable-next-line no-console
    console.warn(
      'Could not resolve jest-preset-angular setup file. Ensure jest-preset-angular is installed and try clearing Jest cache.'
    );
  }
})();

// Global mocks (example)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
