import cx from 'classnames';
import { sizeClsMap, themeClsMap } from './constants';
import { BasicInputProps } from './types';

const getPaddingStyle = (padding: number | number[]) => {
  if (typeof padding === 'number') {
    return padding;
  }

  if (Array.isArray(padding) && padding.length <= 4) {
    const style = padding.reduce((res, cur) => {
      res += `${cur}px `;
      return res;
    }, '');
    return style;
  }

  return 0;
};

const getTextAreaPaddingStyle = (padding: number | number[], hasClearIcon: boolean) => {
  const basePadding = hasClearIcon ? 13 : 1;
  if (typeof padding === 'number') {
    return basePadding + padding;
  }

  if (Array.isArray(padding) && padding.length <= 4) {
    if (padding.length === 1) return padding[0] + 1;
    return basePadding + padding[1];
  }

  return 0;
};

export const useBasicInputCls = ({
  theme = 'dark',
  size = 'sm',
  padding = sizeClsMap[size].padding,
  hasClearIcon = true
}: Pick<BasicInputProps, 'theme' | 'size' | 'padding'> & { hasClearIcon?: boolean }) => {
  const themeCls = themeClsMap[theme];
  const sizeCls = sizeClsMap[size];
  const labelCls = cx('flex flex-shrink-0 text-gray-200 select-none', sizeCls.text);

  return {
    themeCls,
    sizeCls,
    labelCls,
    containerPadding: getPaddingStyle(padding),
    textareaPadding: getTextAreaPaddingStyle(padding, hasClearIcon)
  };
};
