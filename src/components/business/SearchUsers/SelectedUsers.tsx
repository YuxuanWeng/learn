import cx from 'classnames';
import { Tag } from 'antd';
import { SelectedItem } from '@fepkg/components/Select/SelectedItem';
import { IconClose } from '@fepkg/icon-park-react';
import { SelectedUsersProps } from './types';

export const SelectedUsers = ({ selectedUsers, disabledUserIds, className, onDeleteUser }: SelectedUsersProps) => {
  return (
    <div className={cx('pt-3', className)}>
      <span className="text-gray-100 font-normal">已选成员</span>
      <div className="flex flex-wrap gap-2 mt-3 overflow-overlay h-14">
        {selectedUsers?.map(user => (
          <SelectedItem
            key={user.user_id}
            className="h-6 max-w-[120px]"
            label={user.name_cn.toString()}
            closable={!disabledUserIds?.includes(user.user_id)}
            handleClose={() => {
              if (disabledUserIds?.includes(user.user_id)) return;
              onDeleteUser?.(user.user_id);
            }}
          />

          // <Tag
          //   key={user.user_id}
          //   className={cx(
          //     'bg-gray-600 truncate min-w-[72px] max-w-[150px] h-6 border border-solid border-gray-500 rounded text-gray-000 font-normal text-sm px-3'
          //   )}
          //   closable={!disabledUserIds?.includes(user.user_id)}
          //   onClose={() => {
          //     if (disabledUserIds?.includes(user.user_id)) return;
          //     onDeleteUser?.(user.user_id);
          //   }}
          //   closeIcon={
          //     <IconClose
          //       size={12}
          //       className="text-gray-200 hover:text-gray-000"
          //     />
          //   }
          // >
          //   <span className="truncate mr-[7px]">{user.name_cn.toString()}</span>
          // </Tag>
        ))}
      </div>
    </div>
  );
};
