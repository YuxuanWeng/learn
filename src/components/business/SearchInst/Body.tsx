import { Modal } from '@fepkg/components/Modal';
import Footer from './Footer';
import { SearchOptions } from './Options';
import { SearchInput } from './SearchInput';
import { SelectedInst } from './SelectedInst';
import { BodyProps } from './types';

export const SearchBody = ({
  productType,
  searchInst,
  isSelectAll,
  width = 420,
  draggable = false,
  isIndeterminate,
  selectedInst = [],
  placeholder = '输入机构名称搜索',
  footer,

  onFilter,
  onCancel,
  onConfirm,
  onSelectAll,
  onDeleteInst,
  onSearchedInstChange,
  onSelectedInstChange,
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
      <div className="flex flex-col justify-between pt-3 box-content h-[488px]">
        <SearchInput
          containerCls="px-3"
          className="h-8 bg-gray-800 "
          placeholder={placeholder}
          productType={productType}
          onChange={onSearchedInstChange}
          filter={onFilter}
        />
        <SearchOptions
          className="mt-3 flex-auto h-0"
          productType={productType}
          searchInst={searchInst}
          isSelectAll={isSelectAll}
          isIndeterminate={isIndeterminate}
          onSelectAll={onSelectAll}
          onSelectedInstChange={onSelectedInstChange}
          selectedInst={selectedInst}
        />
        {!!selectedInst?.length && <div className="border border-transparent border-solid border-t-gray-600" />}
        {!!selectedInst?.length && (
          <SelectedInst
            className="p-3 h-[110px]"
            selectedInst={selectedInst}
            productType={productType}
            onDeleteInst={onDeleteInst}
          />
        )}
      </div>
    </Modal>
  );
};
