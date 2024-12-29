import { useImmer } from 'use-immer';
import { ReceiptDealAction } from './constants';

export const useLoadingStatus = () => {
  const [loadingStatus, setLoadingStatus] = useImmer<Record<ReceiptDealAction, boolean>>({
    [ReceiptDealAction.Trade]: false,
    [ReceiptDealAction.Submit]: false,
    [ReceiptDealAction.Edit]: false,
    [ReceiptDealAction.Join]: false,
    [ReceiptDealAction.Urgent]: false,
    [ReceiptDealAction.Destroy]: false,
    [ReceiptDealAction.Delete]: false,
    [ReceiptDealAction.DeleteBridge]: false,
    [ReceiptDealAction.Confirm]: false
  });

  const setLoading = (action: ReceiptDealAction, status: boolean) => {
    setLoadingStatus(draft => {
      draft[action] = status;
    });
  };

  return { loadingStatus, setLoading };
};
