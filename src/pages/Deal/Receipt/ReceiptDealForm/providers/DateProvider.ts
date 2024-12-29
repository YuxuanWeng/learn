import { useMemo } from 'react';
import { useBondSearch } from '@fepkg/business/components/Search/BondSearch';
import {
  DealDateMutateEvent,
  getTodayByListedDate,
  useDealDateMutation,
  useDisabledDealDate
} from '@fepkg/business/hooks/useDealDateMutation';
import { DEAL_TRADED_DATE_RANGE, useTradedDateRange } from '@fepkg/business/hooks/useTradedDateRange';
import { formatDate, normalizeTimestamp } from '@fepkg/common/utils/date';
import { Side } from '@fepkg/services/types/bds-enum';
import moment from 'moment';
import { createContainer } from 'unstated-next';
import { useProductParams } from '@/layouts/Home/hooks';
import { useReceiptDealFormParams } from '../hooks/useParams';
import { SideType } from '../types';
import { useReceiptDealForm } from './FormProvider';

export const ReceiptDealDateContainer = createContainer(() => {
  const { productType } = useProductParams();
  const { defaultReceiptDeal } = useReceiptDealFormParams();
  const { bondSearchState } = useBondSearch();
  const { setCalcDisabled, setFullPriceEditing } = useReceiptDealForm();

  const bond = bondSearchState?.selected?.original;
  const { traded_date, delivery_date } = defaultReceiptDeal ?? {};

  const [tradeDateRange] = useTradedDateRange(...DEAL_TRADED_DATE_RANGE);
  const tradeDateRangeMoment = useMemo(
    () => tradeDateRange.map(item => moment(normalizeTimestamp(item))),
    [tradeDateRange]
  );
  const disabledStartDate = useMemo(() => {
    return bond?.listed_date && moment().subtract(1, 'week').isAfter(normalizeTimestamp(bond.listed_date))
      ? bond.listed_date
      : formatDate(moment().subtract(1, 'week'));
  }, [bond?.listed_date]);
  const disabledEndDate = useMemo(() => formatDate(moment().add(3, 'M')), []);

  const disabledDate = useDisabledDealDate(tradeDateRangeMoment, disabledStartDate, disabledEndDate);

  const { today, unlisted } = getTodayByListedDate(bond?.listed_date);

  const dealDateMutationParams = {
    productType,
    range: tradeDateRange,
    rangeMoment: tradeDateRangeMoment,
    defaultValue: { unlisted, today, tradedDate: traded_date, deliveryDate: delivery_date }
  };

  /** bid/ofr 方交易日/交割日信息 */
  const sideMutation = {
    [Side.SideBid]: useDealDateMutation(dealDateMutationParams),
    [Side.SideOfr]: useDealDateMutation(dealDateMutationParams)
  };

  /** 桥信息交易日/交割日信息
   * - 数组中第 0 项为桥 1 与桥 2 的交易日/交割日信息
   * - 第 1 项为桥 2 与 桥 3 的交易日交割日信息  */
  const bridgesMutation = [useDealDateMutation(dealDateMutationParams), useDealDateMutation(dealDateMutationParams)];

  const mutateSideDateState = (side: SideType, ...params: Parameters<DealDateMutateEvent>) => {
    const [, mutate] = sideMutation[side];
    mutate(...params);

    // 调整 bid 才需要重新计算计算器
    if (side === Side.SideBid) {
      setCalcDisabled(false);
      setFullPriceEditing(false);
    }
  };

  const mutateBridgeDateState = (index: number, ...params: Parameters<DealDateMutateEvent>) => {
    const [, mutate] = bridgesMutation[index];
    mutate(...params);
  };

  return {
    tradeDateRange,
    tradeDateRangeMoment,
    disabledDate,
    sideMutation,
    bridgesMutation,
    mutateSideDateState,
    mutateBridgeDateState
  };
});

export const ReceiptDealDateProvider = ReceiptDealDateContainer.Provider;
export const useReceiptDealDate = ReceiptDealDateContainer.useContainer;
