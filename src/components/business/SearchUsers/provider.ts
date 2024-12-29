import { useMemo } from 'react';
import { message } from '@fepkg/components/Message';
import { User } from '@fepkg/services/types/common';
import { createContainer } from 'unstated-next';
import { useImmer } from 'use-immer';

export type InitialState = {
  defaultSelectedUsers?: User[];
  maxSelectedUsers?: number;
  disabledUsers?: User[];
};

const SearchUsersContainer = createContainer((initialState?: InitialState) => {
  /** 允许选中的最大的用户数 */
  const maxSelectedUsers = initialState?.maxSelectedUsers;

  /** 模糊搜索到的经纪人列表 */
  const [searchUsers, setSearchUsers] = useImmer<User[]>([]);

  /** 检查当前禁用的用户是选中还是未选中 */
  const disabledUserStatus = initialState?.disabledUsers?.map(disabledUser => ({
    user: disabledUser,
    isSelected: !!initialState?.defaultSelectedUsers?.some(user => user.user_id === disabledUser.user_id)
  }));

  const disabledSelectedUsers = disabledUserStatus?.filter(v => v.isSelected) ?? [];
  const disabledUnselectedUsers = disabledUserStatus?.filter(v => !v.isSelected) ?? [];

  /** 选中经纪人列表 */
  const [selectedUsers, setSelectedUsers] = useImmer<User[]>(initialState?.defaultSelectedUsers ?? []);

  /** 是否全选 */
  const isSelectAll = useMemo(() => {
    if (!searchUsers?.length) return false;
    if (searchUsers.every(v => selectedUsers.some(selected => selected.user_id === v.user_id))) return true;
    return false;
  }, [searchUsers, selectedUsers]);

  /** 是否半选 */
  const isIndeterminate = useMemo(() => {
    if (isSelectAll) return false;
    if (!selectedUsers.length) return false;
    const indeterminate = searchUsers?.some(search =>
      selectedUsers.map(selected => selected.user_id).includes(search.user_id)
    );
    return indeterminate;
  }, [isSelectAll, searchUsers, selectedUsers]);

  /**
   * 删除用户
   * @param userId 用户ID
   */
  const handleDeleteUser = (userId: string) => {
    const users = selectedUsers.filter(v => v.user_id !== userId);
    setSelectedUsers(users);
  };

  /** 全选 */
  const handleSelectAll = () => {
    if (maxSelectedUsers !== undefined) {
      if ((searchUsers?.length || 0) > maxSelectedUsers) {
        message.error(`经纪人最多允许添加${maxSelectedUsers}个`);
        return;
      }
    }

    setSelectedUsers(draft => {
      if (isSelectAll) {
        // 取消全选
        const searchUserIds = searchUsers?.map(v => v.user_id) || [];
        draft = [...draft.filter(v => !searchUserIds.includes(v.user_id)), ...disabledSelectedUsers.map(v => v.user)];
      } else {
        // 全选
        // 找到之前已经选中的和当前选中的diff，将diff更新到选中中
        const updateData = [...draft];
        searchUsers?.forEach(searchUser => {
          if (!updateData.some(prevUser => prevUser.user_id === searchUser.user_id)) {
            updateData.push(searchUser);
          }
        });
        draft = updateData.filter(
          v => !disabledUnselectedUsers.some(disabledUser => disabledUser.user.user_id === v.user_id)
        );
      }
      return draft;
    });
  };

  /** 搜索列表变化时的回调函数，首次加载会返回接口的全部数据 */
  const handleSearchedUsersChange = (users: User[]) => {
    setSearchUsers(users);
  };

  /**
   * 选中用户
   * @param userId 用户ID
   * @param val 是否选中
   * @returns
   */
  const handleSelectedUsersChange = (userId: string, val: boolean) => {
    if (val && maxSelectedUsers !== undefined && selectedUsers.length > maxSelectedUsers) {
      message.error(`经纪人最多允许添加${maxSelectedUsers}个`);
      return;
    }

    if (val === true && !selectedUsers.some(v => v.user_id === userId)) {
      const user = searchUsers?.find(v => v.user_id === userId);
      if (!user) return;
      setSelectedUsers([...(selectedUsers || []), user]);
    } else if (!val) {
      const users = selectedUsers.filter(v => v.user_id !== userId);
      setSelectedUsers(users);
    }
  };

  return {
    isSelectAll,
    disabledUserIds: initialState?.disabledUsers?.map(v => v.user_id) ?? [],
    isIndeterminate,
    searchUsers,
    selectedUsers,
    handleDeleteUser,
    handleSelectAll,
    handleSearchedUsersChange,
    handleSelectedUsersChange
  };
});

export const SearchUsersProvider = SearchUsersContainer.Provider;
export const useSearchUsers = SearchUsersContainer.useContainer;
