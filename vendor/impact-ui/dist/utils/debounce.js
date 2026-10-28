const debounce = (func, delay) => {
  let timeoutId;
  const debouncedFn = (...args) => {
    if (timeoutId !== void 0) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
  debouncedFn.cancel = () => {
    if (timeoutId !== void 0) {
      clearTimeout(timeoutId);
      timeoutId = void 0;
    }
  };
  return debouncedFn;
};
export {
  debounce
};
