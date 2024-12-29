export type Theme = 'light' | 'dark';
export type ThemeProps = {
  /** 主题样式，默认为 dark */
  theme?: Theme;
};

export type Size = 'md' | 'sm' | 'xs';
export type SizeProps = {
  /** 组件尺寸大小 */
  size?: Size;
};
