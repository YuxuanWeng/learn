import { useMemo } from 'react';
import cx from 'classnames';
import { HighlightProps } from './types';

// 转义
function encode(keyword?: string) {
  // eslint-disable-next-line no-useless-escape
  const reg = /[\[\(\$\^\.\]\*\\\?\+\{\}\|\)]/gi;
  return keyword?.replaceAll(reg, key => `\\${key}`);
}

export const Highlight = ({
  children,
  className,
  keywordCls = 'text-primary-100',
  keyword,
  placeholder = '-'
}: HighlightProps) => {
  const parts = useMemo(() => {
    if (typeof children !== 'string' || !children) return placeholder;

    try {
      const regex = new RegExp(`(${encode(keyword)})`, 'gi');
      const matches = children.match(regex);
      if (!matches) return children;

      return children.split(regex).map((s, idx) => {
        if (matches.includes(s)) {
          return (
            <span
              key={s + idx}
              className={keywordCls}
            >
              {s}
            </span>
          );
        }
        return s;
      });
    } catch {
      return children;
    }
  }, [children, keywordCls, keyword, placeholder]);

  return <span className={cx(className, 'truncate')}>{parts}</span>;
};
