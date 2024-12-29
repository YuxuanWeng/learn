import { ApprovalListInner } from '@/pages/ApprovalList';
import { ApprovalTableProvider } from '@/pages/ApprovalList/providers/TableProvider';
import { ApprovalListType } from '@/pages/ApprovalList/types';

const ApprovalHistoryList = () => {
  return (
    <ApprovalTableProvider initialState={{ type: ApprovalListType.History }}>
      <ApprovalListInner />
    </ApprovalTableProvider>
  );
};

export default ApprovalHistoryList;
