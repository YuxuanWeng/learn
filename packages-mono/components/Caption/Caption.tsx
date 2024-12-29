import cx from 'classnames';
import { bgClsMap, boxShadowClsMap, sizeClsMap } from './constants';
import { CaptionProps } from './types';

export const Caption = ({
  className,
  children,
  size = 'sm',
  type = 'primary',
  childrenCls,
  icon,
  ...restProps
}: CaptionProps) => {
  const bgCls = bgClsMap[type];
  const boxShadowCls = boxShadowClsMap[type];
  const sizeCls = sizeClsMap[size];
  return (
    <div
      className={cx('inline-flex items-center gap-2 text-gray-000 select-none', className)}
      {...restProps}
    >
      {icon ?? (
        <div className="flex-center w-4 h-4">
          <i
            className={cx('w-2 h-2 rounded-sm rotate-45', bgCls)}
            aria-valuetext={type}
            style={{ top: 3, boxShadow: `0px 2px 8px ${boxShadowCls}` }}
          />
        </div>
      )}

      <span className={cx(sizeCls, childrenCls)}>{children}</span>
    </div>
  );
};
