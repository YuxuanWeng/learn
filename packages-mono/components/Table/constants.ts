import { Size } from '../types';

export const S_TABLE_ATOM_SCOPE = Symbol('s-table-atom-score');
export const OVER_WHEEL_NUM = 9;

export const HEADER_HEIGHT = 44;
export const LineHeightMap: Record<Size, number> = {
  md: 32,
  sm: 28,
  xs: 24
};

export const GROUP_LINE_HEIGHT = 28;
export const MIN_CELL_WIDTH = 40;

// pt-9 = 36px = HEADER_HEIGHT，此处为了排除表头将占位符居中
export const placeholderContainerCls =
  'absolute left-1/2 bottom-1/2 -translate-x-1/2 translate-y-1/2 z-10 pointer-events-none';

export const GROUP_ROW_PREFIX = 'group_row_';
export const GROUP_HEADER_ID = 'group_header';
export const GROUP_FOOTER_ID = 'group_footer';

/** 滚动延迟，为了配合 requestAnimationFrame 使用，让浏览器先重绘再滚动 */
export const SCROLL_DELAY = 24;

export const DRAGGABLE_TABLE_ROW_TYPE = 'DRAGGABLE_TABLE_ROW_TYPE';
