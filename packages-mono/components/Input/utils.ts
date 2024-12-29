import { TextAreaProps } from './types';

export type ComputedStyle = {
  /** 一行的高度 */
  rowHeight: number;
  /** 边框高度 */
  borderHeight: number;
  /** 内边距高度 */
  paddingHeight: number;
  /** 额外的高度（计算边框与内边距） */
  extraHeight: number;
};

export const getElComputedStyle = (el: HTMLTextAreaElement): ComputedStyle => {
  const { borderTopWidth, borderBottomWidth, fontSize, lineHeight, paddingTop, paddingBottom } =
    window.getComputedStyle(el);

  const rowHeight = lineHeight === 'normal' ? parseFloat(fontSize) * 1.2 : parseFloat(lineHeight);
  const borderHeight = parseFloat(borderTopWidth) + parseFloat(borderBottomWidth);
  const paddingHeight = parseFloat(paddingTop) + parseFloat(paddingBottom);
  const extraHeight = borderHeight + paddingHeight;

  return { rowHeight, borderHeight, paddingHeight, extraHeight };
};

export const getHeight = (el: HTMLTextAreaElement, computedStyle: ComputedStyle, minRows: number, maxRows?: number) => {
  const { rowHeight, borderHeight, extraHeight } = computedStyle;
  const minRowsHeight = rowHeight * minRows + extraHeight;
  const maxHeight = rowHeight * (maxRows ?? minRows) + extraHeight;
  const scrollHeight = el.scrollHeight + borderHeight;

  return { minHeight: Math.max(minRowsHeight, scrollHeight), maxHeight };
};

export const resize = (
  el: HTMLTextAreaElement | null,
  computedStyle: ComputedStyle,
  minRows: number,
  maxRows?: number
) => {
  if (el) {
    let overflowY = 'hidden';

    const { maxHeight } = getHeight(el, computedStyle, minRows, maxRows);

    if (maxRows !== undefined) {
      if (maxHeight < el.scrollHeight) {
        overflowY = '';
        el.style.maxHeight = `${maxHeight}px`;
      }
    }

    el.style.height = '0';
    el.style.overflowY = overflowY;
    const newHeight = getHeight(el, computedStyle, minRows, maxRows).minHeight;
    el.style.height = `${newHeight}px`;
    return newHeight;
  }
  return 0;
};

export const getMaxLength = (maxLength?: TextAreaProps['maxLength']) => {
  let display = 0;
  let input: number | undefined;

  if (typeof maxLength === 'object') {
    display = maxLength?.length ?? 0;

    if (!maxLength?.errorOnly) input = maxLength?.length;
  } else {
    display = maxLength ?? 0;
    input = maxLength;
  }

  return { display, input };
};
