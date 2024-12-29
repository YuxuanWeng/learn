import cx from 'classnames';
import { Tips } from '@fepkg/business/components/Tips';
import { Popover } from '@fepkg/components/Popover';
import { ReceiptDealRoleMember } from '@fepkg/services/types/bds-common';
import { nameToColorTw } from '../../utils';

const commonAvatarStyle = 'w-8 h-8 flex-center rounded-full border border-solid border-gray-600 mr-[-8px]';

export const AvatarList = ({
  list,
  showTitle = true,
  className
}: {
  list?: ReceiptDealRoleMember[];
  showTitle?: boolean;
  className?: string;
}) => {
  const moreNum = (list?.length ?? 0) - 4;

  return (
    <Popover
      floatingProps={{ className: 'w-[276px] !p-3' }}
      content={
        <div>
          {showTitle && (
            <>
              <div className="text-gray-000 text-sm font-medium">成员</div>
              <div className="border-0 border-t border-dashed border-gray-500 my-3" />
            </>
          )}
          <div className="flex flex-wrap gap-x-2 gap-y-3">
            {list?.map(item => (
              <div
                key={item.member_id}
                className="bg-gray-700 rounded h-6 leading-6 px-3"
              >
                <span className="text-sm font-normal text-gray-000">{item.member_name}</span>
                <Tips
                  show={!item.flag_valid}
                  tipsContent="成员失效"
                  className="ml-2.5 !p-0"
                />
              </div>
            ))}
          </div>
        </div>
      }
      trigger="hover"
      placement="top"
    >
      <div className={cx('flex flex-row-reverse', className)}>
        {moreNum > 0 && (
          <div className={cx(commonAvatarStyle, 'cursor-pointer bg-gray-300', 'text-gray-600')}>
            <span className="text-xs">+{moreNum}</span>
          </div>
        )}
        {list
          ?.slice(0, 4)
          .reverse()
          .map(item => {
            const color = nameToColorTw(item.member_name);
            return (
              <div
                key={item.member_id}
                className={cx(commonAvatarStyle, 'bg-gray-700 cursor-pointer', color)}
              >
                <span className="text-xs">{item?.member_name?.slice(-2)}</span>
              </div>
            );
          })}
      </div>
    </Popover>
  );
};
