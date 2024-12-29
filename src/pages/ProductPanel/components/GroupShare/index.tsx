import { useMemo } from 'react';
import { Button } from '@fepkg/components/Button';
import { User } from '@fepkg/services/types/common';
import { ProductType } from '@fepkg/services/types/enum';
import { useAtomValue } from 'jotai';
import { isEqual } from 'lodash-es';
import { SearchUsers } from '@/components/business/SearchUsers';
import { SearchUsersProvider, useSearchUsers } from '@/components/business/SearchUsers/provider';
import { FooterProps } from '@/components/business/SearchUsers/types';
import { panelShareMdlCancelTimestampAtom } from './atoms';
import { useGroupShare } from './provider';

type GroupShareModalProps = {
  productType: ProductType;
  onOk?: (userIds: string[]) => void;
  defaultShareUsers?: User[];
};

const Footer = ({ onCancel, onConfirm, disableSubmit }: FooterProps) => {
  return (
    <div className="flex items-center justify-center px-3 bg-gray-800 h-12 border-0 border-t-[1px] border-solid border-gray-600">
      <Button
        type="gray"
        ghost
        className="w-[76px] h-7 mr-3 rounded-lg"
        onClick={onCancel}
      >
        取消
      </Button>
      <Button
        type="primary"
        className="w-[76px] h-7 rounded-lg text-gray-700"
        onClick={onConfirm}
        disabled={disableSubmit}
      >
        分享
      </Button>
    </div>
  );
};

const Inner = ({ productType, defaultShareUsers, onOk }: GroupShareModalProps) => {
  const { visible, handleClose, handleOk } = useGroupShare();

  const {
    isSelectAll,
    searchUsers,
    isIndeterminate,
    selectedUsers,
    handleSearchedUsersChange,
    handleDeleteUser,
    handleSelectedUsersChange,
    handleSelectAll
  } = useSearchUsers();

  const notModified = useMemo(() => {
    const defaultUserIdList = defaultShareUsers?.map(user => user.user_id).sort();
    const newUserIdList = selectedUsers?.map(user => user.user_id).sort();
    return isEqual(defaultUserIdList, newUserIdList);
  }, [defaultShareUsers, selectedUsers]);

  const submit = () => {
    if (notModified) return;
    onOk?.(selectedUsers.map(v => v.user_id));
    handleOk();
  };

  return (
    <SearchUsers
      keyboard
      confirmByEnter
      title="分享看板"
      visible={visible}
      productType={productType}
      searchUsers={searchUsers}
      isSelectAll={isSelectAll}
      isIndeterminate={isIndeterminate}
      selectedUsers={selectedUsers}
      onDeleteUser={handleDeleteUser}
      onCancel={handleClose}
      onSelectAll={handleSelectAll}
      onSelectedUsersChange={handleSelectedUsersChange}
      onSearchedUsersChange={handleSearchedUsersChange}
      onConfirm={submit}
      footer={
        <Footer
          onCancel={handleClose}
          onConfirm={submit}
          disableSubmit={notModified}
        />
      }
    />
  );
};

const Wrapper = (props: GroupShareModalProps) => {
  return (
    <SearchUsersProvider initialState={{ defaultSelectedUsers: props.defaultShareUsers }}>
      <Inner {...props} />
    </SearchUsersProvider>
  );
};

export const GroupShareModal = (props: GroupShareModalProps) => {
  const panelShareMdlCancelTimestamp = useAtomValue(panelShareMdlCancelTimestampAtom);
  const key = `${JSON.stringify(props.defaultShareUsers)}_${panelShareMdlCancelTimestamp}`;
  return (
    <Wrapper
      key={key}
      {...props}
    />
  );
};
