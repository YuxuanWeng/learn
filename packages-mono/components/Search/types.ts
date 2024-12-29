import { ReactNode, RefObject } from 'react';
import { Placement, Strategy } from '@floating-ui/react';
import { InputProps } from '../Input';

export type SearchImperativeRef = {
  /** 切换 open 状态 */
  toggleOpen: (val: boolean) => void;
  /** 清空输入框 */
  clearInput: () => void;
};

export type SearchValue = string | number | boolean | null;

export type SearchOption<T = unknown> = {
  /** 选项原始数据 */
  original: T;
  /** 选项展示的内容 */
  label?: ReactNode;
  /** 选项的值 */
  value?: SearchValue;
  /** 选项是否被禁用 */
  disabled?: boolean;
  /** 子选项 */
  children?: Omit<SearchOption<T>, 'children'>[];
};

export type SearchProps<T = unknown> = Omit<InputProps, 'defaultValue' | 'value' | 'onChange'> & {
  /** SearchImperativeRef，提供非常用操控 search 的方法 */
  imperativeRef?: RefObject<SearchImperativeRef>;
  /** dropdown className */
  dropdownCls?: string;
  /** container className */
  containerCls?: string;
  /** 是否展示选项 */
  showOptions?: boolean;
  /** 默认将第 0 条设置 active 状态，默认为 true */
  firstActive?: boolean;
  /** 是否限制宽度不能超出input */
  limitWidth?: boolean;
  /** tab/enter是否在无active选项时，自动填入第一项，默认为 true */
  defaultSelectOnEnterDown?: boolean;
  /** 是否使用 Tab 键选中选项，默认为 true */
  changeByTab?: boolean;
  /** 是否关闭后销毁浮动层，默认为 false */
  destroyOnClose?: boolean;
  /** 是否在打开后更新选项位置，窗口再套 Ant Modal 的时候可能需要 */
  updateByOpen?: boolean;
  /** 外层元素滚动时浮动层是否消失，默认为 false，不会消失 */
  ancestorScroll?: boolean;
  /** 浮动层渲染根节点 Id */
  floatingId?: string;
  /** 浮动层渲染根节点 */
  floatingRoot?: HTMLElement;
  /** 当空间不充足时，浮动层是否需要自动翻转到另一侧 */
  floatFlip?: boolean;
  /** 当浮动层随着触发器移动到边缘时，是否需要固定到边缘以便完全展示 */
  floatShift?: boolean;
  /** useFloating 使用的 strategy，默认为 absolute，详见：https://floating-ui.com/docs/useFloating#strategy  */
  strategy?: Strategy;
  /** 悬浮窗定位 */
  placement?: Placement;
  /** 选项数据 */
  options?: SearchOption<T>[];
  /** 自定义 option 的渲染方式 */
  optionRender?: (original: T, keyword: string) => ReactNode;
  /** 自定义选中 option 回填到输入框的内容 */
  inputValueRender?: (opt?: SearchOption<T> | null) => string;
  /** 输入框的内容 */
  inputValue?: string;
  /** 默认选中的选项 */
  defaultValue?: SearchOption<T> | null;
  /** 当前选中的选项，如传 undefined，会使组件变为不受控模式，组件显示内容可能会不受控，清空 Search 请传 null */
  value?: SearchOption<T> | null;
  /** 选中选项时的回调 */
  onChange?: (opt: SearchOption<T> | null) => void;
  /** Input 内容改变时的回调 */
  onInputChange?: (val: string) => void;
  /** 下拉选项是否展示的状态改变时的回调 */
  onOptionsVisibleChange?: (visible?: boolean) => void;
  /** 加载更多时的回调 */
  onLoadMore?: () => void;
  /** 未匹配到结果，光标移除时清空输入框内容  默认是true */
  autoClear?: boolean;
};
