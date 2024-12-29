import { Post } from '@fepkg/services/types/enum';
import type { UserList } from '@fepkg/services/types/user/list';
import { useAtomValue } from 'jotai';
import { SearchUsers } from '@/components/business/SearchUsers';
import { SearchUsersProvider, useSearchUsers } from '@/components/business/SearchUsers/provider';
import { miscStorage } from '@/localdb/miscStorage';
import { addBrokerMdlCancelTimestampAtom } from '../atoms';
import { MAX_BROKERS, useGroupSetting } from '../providers';

const usersFilter = (data: UserList.Response) => {
  // 把搜索结果中的DI排除掉
  const filterData = data.list?.filter(user => user.post !== Post.Post_DI);
  return { ...data, list: filterData };
};

export const Inner = () => {
  const { productType, addBrokerModalVisible, updateBrokers, handleCloseAddBrokerModal } = useGroupSetting();

  const {
    isSelectAll,
    searchUsers,
    disabledUserIds,
    isIndeterminate,
    selectedUsers,
    handleDeleteUser,
    handleSelectAll,
    handleSearchedUsersChange,
    handleSelectedUsersChange
  } = useSearchUsers();

  return (
    <SearchUsers
      keyboard
      confirmByEnter
      disabledUserIds={disabledUserIds}
      title="变更分组成员"
      visible={addBrokerModalVisible}
      productType={productType}
      searchUsers={searchUsers}
      isSelectAll={isSelectAll}
      isIndeterminate={isIndeterminate}
      selectedUsers={selectedUsers}
      onDeleteUser={handleDeleteUser}
      onCancel={handleCloseAddBrokerModal}
      onSelectAll={handleSelectAll}
      onSelectedUsersChange={handleSelectedUsersChange}
      onSearchedUsersChange={handleSearchedUsersChange}
      onConfirm={async () => {
        handleCloseAddBrokerModal();
        await updateBrokers(selectedUsers);
      }}
      onFilter={usersFilter}
    />
  );
};

export const Wrapper = () => {
  const { brokers } = useGroupSetting();
  const disabledUsers = miscStorage.userInfo ? [miscStorage.userInfo] : [];

  return (
    <SearchUsersProvider initialState={{ defaultSelectedUsers: brokers, maxSelectedUsers: MAX_BROKERS, disabledUsers }}>
      <Inner />
    </SearchUsersProvider>
  );
};

export const AddBrokerModal = () => {
  const { selectedGroup, brokers } = useGroupSetting();
  const addBrokerMdlCancelTimestamp = useAtomValue(addBrokerMdlCancelTimestampAtom);
  // 目的是为了避免变更分组成员modal打开后没有已选项展示的问题
  const key = `${JSON.stringify(selectedGroup?.name)}_${brokers?.map(i => i.user_id)}_${addBrokerMdlCancelTimestamp}`;

  return <Wrapper key={key} />;
};
