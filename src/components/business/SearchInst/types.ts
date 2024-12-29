import { ModalProps } from '@fepkg/components/Modal';
import { InstitutionTiny } from '@fepkg/services/types/common';
import { ProductType } from '@fepkg/services/types/enum';

export type SearchOptionsProps = {
  /** 产品类型 */
  productType?: ProductType;
  /** 搜索到的机构列表 */
  searchInst?: InstitutionTiny[];
  /** 是否全选 */
  isSelectAll?: boolean;
  /** 是否半选(当isSelectAll=true时，此值为false) */
  isIndeterminate?: boolean;
  /** 当前选中的机构列表 */
  selectedInst?: InstitutionTiny[];
  /** 外部控制的样式 */
  className?: string;
  /** 全选 */
  onSelectAll?: () => void;
  /** 选中/取消选中机构后的回调 */
  onSelectedInstChange?: (InstId: string, val: boolean) => void;
};

export type SelectedInstProps = {
  /** 产品类型 */
  productType?: ProductType;
  /** 当前选中的机构列表 */
  selectedInst?: InstitutionTiny[];
  /** 外部控制的样式 */
  className?: string;
  /** 删除选中机构的回调 */
  onDeleteInst?: (instId: string) => void;
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
  /** 搜索机构列表变化后的回调 */
  onSearchedInstChange?: (val: InstitutionTiny[]) => void;
  /** 机构自定义过滤函数，用于过滤搜索后的结果 */
  onFilter?: (data: InstitutionTiny[]) => InstitutionTiny[];
} & FooterProps &
  SearchOptionsProps &
  SelectedInstProps;
