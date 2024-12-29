import { ApprovalListInputFilter, BridgeType } from '@/pages/ApprovalList/types';

export const getApprovalListFilterBridgeValue = (filterValue: ApprovalListInputFilter) => {
  if (filterValue.inst_is_bridge_inst === false) {
    return [BridgeType.NonBridge];
  }
  if (filterValue.inst_is_bridge_inst) {
    return [BridgeType.Bridge];
  }
  return [];
};
