import { ApprovalListInner } from '@/pages/ApprovalList';
import { ApprovalTableProvider } from '@/pages/ApprovalList/providers/TableProvider';
import { ApprovalListType } from '@/pages/ApprovalList/types';

const ApprovalDealList = () => {
  return (
    <ApprovalTableProvider initialState={{ type: ApprovalListType.Deal }}>
      <ApprovalListInner />
    </ApprovalTableProvider>
  );
};

export default ApprovalDealList;
