void import('./bootstrap').then(({ mount }) => {
  const root =
    document.querySelector('#agenticassort-root') || document.querySelector('#root');

  if (root) {
    // Browser MSW only starts when the build sets APP_USE_MOCKS=true (see useMocks).
    mount(root, { enableMocks: true });
  }
});
