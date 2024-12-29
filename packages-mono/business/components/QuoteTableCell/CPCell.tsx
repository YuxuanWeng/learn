import { IconUrgentFilled } from '@fepkg/icon-park-react';

type CPCellProps = {
  /** 展示内容 */
  content?: string;
  /** 是否紧急 */
  urgent?: boolean;
  /** 展示内容样式 */
  contentCls?: string;
};

export const CPCell = ({ content, urgent, contentCls = '' }: CPCellProps) => {
  return (
    <>
      <div className="flex-shrink-0 min-w-[16px] h-3 flex justify-center">
        {urgent && (
          <IconUrgentFilled
            size={12}
            className="text-orange-100"
          />
        )}
      </div>
      <span className={`${contentCls} truncate-clip`}>{content}</span>
    </>
  );
};
