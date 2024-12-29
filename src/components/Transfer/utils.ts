import { TransferOption } from './types';

export const getSortOptions = (opts: TransferOption[], keys: string[]) => {
  const result: TransferOption[] = [];
  keys.forEach(item => {
    const tmp = opts.find(i => i.key === item);
    if (tmp) result.push(tmp);
  });
  return result;
};

export const sortSelectedKeys = (reference: string[], selected: string[]) => {
  return reference.filter(k => selected.includes(k));
};
