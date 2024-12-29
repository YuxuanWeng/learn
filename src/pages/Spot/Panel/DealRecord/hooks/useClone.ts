import { useState } from 'react';
import { DealOperationType, OperationSource } from '@fepkg/services/types/enum';
import { useAtomValue, useSetAtom } from 'jotai';
import { idcDealClone } from '@/common/services/api/deal/clone';
import { miscStorage } from '@/localdb/miscStorage';
import { cloneMdlVisibleAtom, dealRecordOperatingAtom } from '../atoms';

export const useClone = () => {
  // 克隆数量
  const [cloneNum, setCloneNum] = useState(1);
  const setCloneVisible = useSetAtom(cloneMdlVisibleAtom);
  const curDealRecord = useAtomValue(dealRecordOperatingAtom);

  /** 提交clone */
  function handleCloneSubmit(cloneGranterId?: string) {
    // 克隆条数小于1，直接关闭modal不克隆
    if (cloneNum === 0 || !curDealRecord?.deal_id) setCloneVisible(false);
    else {
      idcDealClone({
        count: cloneNum,
        deal_id: curDealRecord.deal_id,
        operation_info: {
          operator: miscStorage.userInfo?.user_id ?? '',
          operation_type: DealOperationType.DOTCloned,
          operation_source: OperationSource.OperationSourceSpotPricing
        },
        granter_id: cloneGranterId
      });
    }

    setCloneVisible(false);
    // 还原默认克隆数量
    setCloneNum(1);
  }
  return { cloneNum, setCloneNum, handleCloneSubmit };
};
