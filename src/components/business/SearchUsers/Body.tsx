import { Modal } from '@fepkg/components/Modal';
import Footer from './Footer';
import { SearchOptions } from './Options';
import { SearchInput } from './SearchInput';
import { SelectedUsers } from './SelectedUsers';
import { BodyProps } from './types';

export const SearchBody = ({
  productType,
  searchUsers,
  isSelectAll,
  width = 420,
  draggable = false,
  isIndeterminate,
  selectedUsers = [],
  disabledUserIds = [],
  placeholder = '输入成员姓名搜索',
  footer,

  onFilter,
  onCancel,
  onConfirm,
  onSelectAll,
  onDeleteUser,
  onSearchedUsersChange,
  onSelectedUsersChange,
  ...rest
}: BodyProps) => {
  return (
    <Modal
      width={width}
      footer={
        footer === undefined ? (
          <Footer
            onCancel={onCancel}
            onConfirm={onConfirm}
          />
        ) : (
          footer
        )
      }
      onConfirm={onConfirm}
      draggable={draggable}
      onCancel={onCancel}
      {...rest}
    >
      <div className="flex flex-col justify-between pt-3 box-content h-[448px]">
        <SearchInput
          containerCls="px-3"
          className="h-8 bg-gray-800 "
          placeholder={placeholder}
          productType={productType}
          onChange={onSearchedUsersChange}
          filter={onFilter}
        />
        <SearchOptions
          className="flex-auto h-0"
          searchUsers={searchUsers}
          isSelectAll={isSelectAll}
          disabledUserIds={disabledUserIds}
          isIndeterminate={isIndeterminate}
          onSelectAll={onSelectAll}
          onSelectedUsersChange={onSelectedUsersChange}
          selectedUsers={selectedUsers}
        />

        {!!selectedUsers?.length && (
          <SelectedUsers
            disabledUserIds={disabledUserIds}
            className="px-4 border border-transparent border-solid border-t-gray-600 h-[114px]"
            selectedUsers={selectedUsers}
            onDeleteUser={onDeleteUser}
          />
        )}
      </div>
    </Modal>
  );
};
