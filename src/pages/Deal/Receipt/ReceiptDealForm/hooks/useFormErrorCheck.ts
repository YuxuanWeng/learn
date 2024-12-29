import { StatusCode } from '@fepkg/request/types';
import { Side } from '@fepkg/services/types/bds-enum';
import { ReceiptDealMulAdd } from '@fepkg/services/types/receipt-deal/mul-add';
import { useMemoizedFn } from 'ahooks';
import { showConcurrentCheckModal } from '@/pages/Spot/utils/editBridgeCheckModal';
import { useReceiptDealBridge } from '../providers/BridgeProvider';
import { useReceiptDealForm } from '../providers/FormProvider';
import { useReceiptDealTrades } from '../providers/TradesProvider';
import { IUpsertReceiptDeal, ReceiptDealFormErrorStateType } from '../types';
import { isAxiosResponse, toastRequestError } from '../utils';
import { validateByErrorCode } from '../utils/validation/validateByErrorCode';

const getDefaultErrorState = (): ReceiptDealFormErrorStateType => ({
  formErrorState: {},
  traderErrorState: {
    [Side.SideBid]: {},
    [Side.SideOfr]: {}
  },
  bridgeErrorState: undefined
});

export const useFormErrorCheck = () => {
  const { updateFormError } = useReceiptDealForm();
  const { setTraderInfoError } = useReceiptDealTrades();
  const { updateBridge } = useReceiptDealBridge();

  const setFormError = useMemoizedFn((errorState: ReceiptDealFormErrorStateType) => {
    const { formErrorState, bridgeErrorState, traderErrorState = {} } = errorState;
    updateFormError(draft => {
      Object.assign(draft, formErrorState);
    });
    setTraderInfoError(draft => {
      draft[Side.SideBid] = { ...traderErrorState[Side.SideBid] };
      draft[Side.SideOfr] = { ...traderErrorState[Side.SideOfr] };
    });
    if (bridgeErrorState) {
      updateBridge(bridgeErrorState.bridgeIndex, { ...bridgeErrorState });
    }
  });

  const handleReceiptRequestError = useMemoizedFn(
    (receiptDealInfo: IUpsertReceiptDeal, error: unknown, confirm?: () => void) => {
      toastRequestError(error);
      if (!isAxiosResponse<ReceiptDealMulAdd.Response>(error)) return error;

      const errorState = getDefaultErrorState();
      if (error?.data?.base_response?.code === StatusCode.ConcurrentCheckError) {
        showConcurrentCheckModal(confirm);
        // 当出现这个弹窗后，逻辑一定不会往下走
        return error;
      }

      // 根据后端的错误码把对应输入框标红
      validateByErrorCode({
        errorState,
        response: error.data,
        receiptDealInfo
      });

      setFormError(errorState);
      return error;
    }
  );

  return {
    getDefaultErrorState,
    setFormError,
    handleReceiptRequestError
  };
};
