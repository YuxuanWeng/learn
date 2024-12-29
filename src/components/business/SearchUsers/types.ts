import { ModalProps } from '@fepkg/components/Modal';
import { User, UserLite } from '@fepkg/services/types/common';
import { ProductType } from '@fepkg/services/types/enum';
import type { UserList } from '@fepkg/services/types/user/list';

export type SearchOptionsProps = {
  /** 禁止操作的用户Id列表 */
  disabledUserIds?: string[];
  /** 搜索到的用户列表 */
  searchUsers?: User[];
  /** 是否全选 */
  isSelectAll?: boolean;
  /** 是否半选(当isSelectAll=true时，此值为false) */
  isIndeterminate?: boolean;
  /** 当前选中的用户列表 */
  selectedUsers?: UserLite[];
  /** 外部控制的样式 */
  className?: string;
  /** 全选 */
  onSelectAll?: () => void;
  /** 选中/取消选中用户后的回调 */
  onSelectedUsersChange?: (userId: string, val: boolean) => void;
};

export type SelectedUsersProps = {
  /** 当前选中的用户列表 */
  selectedUsers?: UserLite[];
  /** 禁止操作的用户Id列表 */
  disabledUserIds?: string[];
  /** 外部控制的样式 */
  className?: string;
  /** 删除选中用户的回调 */
  onDeleteUser?: (userId: string) => void;
};

export type FooterProps = {
  onConfirm?: () => void;
  onCancel?: () => void;
  disableSubmit?: boolean;
};

export type BodyProps = ModalProps & {
  /** 搜索框默认文案 */
  placeholder?: string;
  /** 产品类型 */
  productType: ProductType;
  /** 搜索用户列表变化后的回调 */
  onSearchedUsersChange?: (val: User[]) => void;
  /** 用户自定义过滤函数，用于过滤搜索后的结果 */
  onFilter?: (data: UserList.Response) => UserList.Response;
} & FooterProps &
  SearchOptionsProps &
  SelectedUsersProps;
