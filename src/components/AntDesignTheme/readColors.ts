/* eslint-disable */
interface ITwColors {
  [name: string]: {
    [subname: string]: string;
  };
}
// @ts-ignore
export const colorsConfig = Object.entries(window._twColors as ITwColors).reduce((acc, [prefix, colorItems]) => {
  // for `white: #ffffff`
  if (typeof colorItems === 'string') {
    acc.push([prefix, colorItems]);
    return acc;
  }
  // for `ofr: {100: '#67b1d0', 200: '#419ec5', ...}`
  const noSuffix = (str: string) => !str.includes('-');
  const getSuffixNum = (str: string) => {
    const n = str.replace(`${prefix}-`, '');
    if (n.includes('/')) return eval(n);
    return parseFloat(n);
  };
  const items = Object.entries(colorItems)
    .map(([k, v]) => [k === 'DEFAULT' ? prefix : `${prefix}-${k}`, v])
    .sort((a, b) => {
      if (noSuffix(a[0])) return -1;
      if (noSuffix(b[0])) return 1;
      return getSuffixNum(a[0]) - getSuffixNum(b[0]);
    });
  return acc.concat(items);
}, [] as string[][]);
/* eslint-enable */
