import { InstSearchProvider } from '@fepkg/business/components/Search/InstSearch';
import { useAuth } from '@/providers/AuthProvider';
import { ApprovalDetailDrawer } from '@/components/ApprovalDetail';
import { ApprovalLogModal } from '@/components/ApprovalLog';
import { BondSearchProvider } from '@/components/Search/BondSearch';
import { TraderSearchProvider } from '@/components/Search/TraderSearch';
import { ApprovalListInputFilter } from '@/pages/ApprovalList/components/ApprovalListInputFilter';
import { ApprovalListRelatedFilter } from '@/pages/ApprovalList/components/ApprovalListRelatedFilter';
import { ApprovalTableProvider, useApprovalTable } from '@/pages/ApprovalList/providers/TableProvider';
import { ApprovalListType } from '@/pages/ApprovalList/types';
import { ApprovalTable } from './components/ApprovalTable';

export const ApprovalListInner = () => {
  const { productTypeList } = useAuth();
  const { drawerState, modalState } = useApprovalTable();

  return (
    <InstSearchProvider>
      <TraderSearchProvider>
        <BondSearchProvider initialState={{ productTypeList }}>
          <div className="flex flex-col gap-4 h-full p-4 pl-0 bg-gray-800">
            <ApprovalListRelatedFilter />
            <div className="p-4 flex-1 flex flex-col gap-y-4 bg-gray-700 rounded-lg">
              <ApprovalListInputFilter />
              <ApprovalTable />
            </div>
          </div>

          {drawerState.open && drawerState.selectedId && <ApprovalDetailDrawer />}
          {modalState.open && modalState.selectedId && <ApprovalLogModal />}
        </BondSearchProvider>
      </TraderSearchProvider>
    </InstSearchProvider>
  );
};

const ApprovalList = () => {
  return (
    <ApprovalTableProvider initialState={{ type: ApprovalListType.Approval }}>
      <ApprovalListInner />
    </ApprovalTableProvider>
  );
};

export default ApprovalList;
