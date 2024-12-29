import { InstitutionTiny } from '@fepkg/services/types/bdm-common';
import { SearchInst } from '@/components/business/SearchInst';
import { SearchInstProvider, useSearchInst } from '@/components/business/SearchInst/provider';
import { useProductParams } from '@/layouts/Home/hooks';
import { useAgency } from './provider';

const Inner = () => {
  const {
    searchInst,
    isSelectAll,
    isIndeterminate,
    selectedInst,
    handleDeleteInst,
    handleSelectAll,
    handleSearchedInstChange,
    handleSelectedInstChange
  } = useSearchInst();
  const { batchUpdate, changeAgentModalVisible, agentContainerRef, setChangeAgentModalVisible } = useAgency();
  const { productType } = useProductParams();

  return (
    <SearchInst
      keyboard
      confirmByEnter
      title="变更需代付机构"
      visible={changeAgentModalVisible}
      productType={productType}
      searchInst={searchInst}
      isSelectAll={isSelectAll}
      isIndeterminate={isIndeterminate}
      selectedInst={selectedInst}
      onDeleteInst={handleDeleteInst}
      onCancel={() => {
        setChangeAgentModalVisible(false);
        agentContainerRef.current?.focus();
      }}
      onSelectAll={handleSelectAll}
      onSelectedInstChange={handleSelectedInstChange}
      onSearchedInstChange={handleSearchedInstChange}
      onConfirm={() => {
        batchUpdate(selectedInst.map(v => v.inst_id));
        agentContainerRef.current?.focus();
      }}
    />
  );
};

export const ChangeAgentModal = () => {
  const { agencyOptions, changeAgentModalVisible } = useAgency();
  return (
    <div key={JSON.stringify(changeAgentModalVisible)}>
      <SearchInstProvider
        initialState={{
          defaultSelectedInst: agencyOptions?.map(
            v => ({ inst_id: v.inst_id, short_name_zh: v.short_name }) as InstitutionTiny
          )
        }}
      >
        <Inner />
      </SearchInstProvider>
    </div>
  );
};
