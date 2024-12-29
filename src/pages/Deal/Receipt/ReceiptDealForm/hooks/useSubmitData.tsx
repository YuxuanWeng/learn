import { useRef } from 'react';
import { useBondSearch } from '@fepkg/business/components/Search/BondSearch';
import { ExerciseType } from '@fepkg/services/types/bds-enum';
import { ReceiptDealMulAdd } from '@fepkg/services/types/receipt-deal/mul-add';
import { useMount } from 'ahooks';
import { trackPoint } from '@/common/utils/logger/point';
import { useExercise } from '@/components/business/ExerciseGroup/provider';
import { usePriceGroup } from '@/components/business/PriceGroup';
import { useProductParams } from '@/layouts/Home/hooks';
import { LogReceiptDealFlowPhase } from '../constants';
import { useReceiptDealBridge } from '../providers/BridgeProvider';
import { useReceiptDealDate } from '../providers/DateProvider';
import { useReceiptDealForm } from '../providers/FormProvider';
import { useReceiptDealTrades } from '../providers/TradesProvider';
import { ReceiptDealFormMode } from '../types';
import { getReceiptDeal } from '../utils';
import { useReceiptDealFormParams } from './useParams';

export const useSubmitData = () => {
  const { productType } = useProductParams();
  const { defaultReceiptDeal, mode } = useReceiptDealFormParams();
  const { formState, highlyAccurateData, realTradeStatus } = useReceiptDealForm();

  const { bondSearchState } = useBondSearch();
  const { priceInfo } = usePriceGroup();
  const { innerValue, isSelected } = useExercise();

  const { bridgesMutation } = useReceiptDealDate();
  const bridgeDealDates = bridgesMutation.map(item => item[0]);
  const { bridges, bridgeFlags } = useReceiptDealBridge();
  const { trades, brokers } = useReceiptDealTrades();
  const formattedRawData = useRef<ReceiptDealMulAdd.CreateReceiptDeal | undefined>(undefined);

  useMount(() => {
    trackPoint(LogReceiptDealFlowPhase.Enter);

    const { receiptDealInfo } = getReceiptDeal({
      exercise: formState.exercise,
      formState,
      bondSearchState,
      priceInfo,
      bridges,
      bridgeDealDates,
      bridgeFlags,
      trades,
      brokers,
      realTradeStatus,
      productType,
      highlyAccurateData: highlyAccurateData.current
    });
    formattedRawData.current = receiptDealInfo;
  });

  const getReceiptDealUpdatedData = () => {
    const { receiptDealInfo, bond } = getReceiptDeal({
      exercise: isSelected ? innerValue : ExerciseType.ExerciseTypeNone,
      formState,
      bondSearchState,
      priceInfo,
      bridges,
      bridgeDealDates,
      bridgeFlags,
      trades,
      brokers,
      realTradeStatus,
      productType,
      highlyAccurateData: highlyAccurateData.current
    });

    return {
      receiptDealInfo,
      formattedRawData: formattedRawData.current,
      bond
    };
  };

  return {
    /** 原始成交单数据 */
    initialRowData: defaultReceiptDeal,
    /** 改面板是否为编辑状态 */
    isUpdate: mode === ReceiptDealFormMode.Edit,
    /** 获取提交与校验所需的数据 */
    getReceiptDealUpdatedData
  };
};
