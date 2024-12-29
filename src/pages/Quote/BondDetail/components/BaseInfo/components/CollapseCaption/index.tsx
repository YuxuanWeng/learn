import cx from 'classnames';
import { Button } from '@fepkg/components/Button';
import { Caption } from '@fepkg/components/Caption';
import { IconCopy, IconDownDouble, IconUpDouble } from '@fepkg/icon-park-react';

type CollapseCaptionProps = {
  title: string;
  open?: boolean; // true表示展开  false表示折叠
  onChange?: (visible: boolean) => void;
  onCopy?: () => void;
  haveBottomBorder?: boolean;
  haveIcon?: boolean;
  /** 外部控制样式 */
  className?: string;
};

export const CollapseCaption = ({
  title,
  open = true,
  onChange,
  onCopy,
  haveBottomBorder = true,
  haveIcon = true,
  className = ''
}: CollapseCaptionProps) => {
  return (
    <div
      className={cx('pl-3 rounded-t', haveIcon ? 'cursor-pointer' : 'cursor-auto', className)}
      onClick={() => {
        if (haveIcon && onChange) {
          onChange(!open);
        }
      }}
    >
      <div className="relative flex items-center h-12 select-none">
        <Caption>{title}</Caption>
        {haveIcon && (
          <span className="ml-2 leading-0 text-gray-200">{open ? <IconUpDouble /> : <IconDownDouble />}</span>
        )}
        {onCopy && (
          <div
            className="absolute right-0 p-3 cursor-default"
            onClick={e => {
              e.stopPropagation();
            }}
          >
            <Button.Icon
              text
              icon={<IconCopy />}
              onClick={e => {
                e.stopPropagation();
                onCopy?.();
              }}
            />
          </div>
        )}
      </div>

      {/* -mt-px的作用是为了模仿边框线，使它不额外占用高度 */}
      {haveBottomBorder && open && <div className="component-dashed-x-600 h-px mr-3 -mt-px" />}
    </div>
  );
};
