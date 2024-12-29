import { SearchOption } from './types';

export const getActiveOption = (
  activeIndex: number | null,
  options?: SearchOption[],
  selected?: SearchOption | null,
  defaultSelectOnEnterDown?: boolean
) => {
  let opt: SearchOption | null;
  if (options?.length) {
    if (activeIndex != null) {
      opt = options[activeIndex];
    } else if (!selected) {
      if (defaultSelectOnEnterDown) {
        [opt] = options;
      } else {
        opt = null;
      }
    } else {
      opt = selected;
    }
  } else {
    opt = null;
  }

  return opt;
};
