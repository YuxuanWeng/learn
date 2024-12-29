export type HighlightProps = {
  /** className */
  className?: string;
  /** 高亮关键词的 className（默认为 text-primary-200） */
  keywordCls?: string;
  /** 高亮关键词 */
  keyword?: string;
  /** 占位符 */
  placeholder?: string;
  /** 内容 */
  children?: string;
};
