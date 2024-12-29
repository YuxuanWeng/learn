export const isWindows = () => {
  return /Windows/i.test(navigator.userAgent);
};

export const isMac = () => {
  return /Macintosh/i.test(navigator.userAgent);
};
