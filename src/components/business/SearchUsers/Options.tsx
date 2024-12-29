import cx from 'classnames';
import { BaseOption } from '@fepkg/components/BaseOptionsRender/BaseOption';
import { Checkbox } from '@fepkg/components/Checkbox';
import { Placeholder } from '@fepkg/components/Placeholder';
import { NumberBadge } from '@fepkg/components/Tags';
import { POST_MAP } from './constants';
import { SearchOptionsProps } from './types';

const checkboxCls = 'flex items-center !h-10 px-3 mx-2 mb-0.5 rounded-lg justify-start';

export const SearchOptions = ({
  searchUsers,
  isSelectAll,
  isIndeterminate,
  disabledUserIds,
  onSelectAll,
  onSelectedUsersChange,
  className = '',
  selectedUsers = []
}: SearchOptionsProps) => {
  const hasSelectedUsers = searchUsers?.length;
  return (
    <div className={cx(className, hasSelectedUsers && 'mt-3')}>
      {hasSelectedUsers ? (
        <>
          <Checkbox
            childrenCls={() => 'flex items-center'}
            checked={isSelectAll}
            indeterminate={isIndeterminate}
            onChange={onSelectAll}
            className={cx(checkboxCls, 'hover:bg-gray-500')}
          >
            <span className="mr-2 text-gray-000">全部成员</span>
            <NumberBadge num={searchUsers?.length || 0} />
          </Checkbox>
          <div className="overflow-y-overlay h-[calc(100%_-_40px)]">
            {searchUsers.map(user => {
              return (
                <BaseOption
                  key={user.user_id}
                  disabled={disabledUserIds?.includes(user.user_id)}
                  className={checkboxCls}
                  checkbox
                  hoverActive
                  secondaryText={POST_MAP[user.post]}
                  checkboxProps={{
                    checked: selectedUsers?.some(selected => selected.user_id === user.user_id),
                    onChange: val => {
                      onSelectedUsersChange?.(user.user_id, val);
                    }
                  }}
                >
                  {user.name_cn}
                </BaseOption>

                // <Checkbox
                //   disabled={disabledUserIds?.includes(user.user_id)}
                //   childrenCls={() => 'flex items-center gap-1'}
                //   checked={selectedUsers?.some(selected => selected.user_id === user.user_id)}
                //   onChange={val => {
                //     onSelectedUsersChange?.(user.user_id, val);
                //   }}
                //   className={checkboxCls}
                //   key={user.user_id}
                // >
                //   <div className="w-[265] truncate overflow-ellipsis  flex items-center ">
                //     <span className="text-sm text-gray-000">{user.name_cn}</span>
                //     <span className="flex items-center h-6 ml-2 text-xs text-gray-200">{POST_MAP[user.post]}</span>
                //   </div>
                // </Checkbox>
              );
            })}
          </div>
        </>
      ) : (
        <div className="flex items-center h-full">
          <Placeholder
            className=" !gap-0"
            type="no-search-result"
            size="sm"
            label="没有搜索到成员"
          />
        </div>
      )}
    </div>
  );
};
