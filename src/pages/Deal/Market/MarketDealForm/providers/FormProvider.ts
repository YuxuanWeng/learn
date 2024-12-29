import { useMemo } from 'react';
import { useBondSearch } from '@fepkg/business/components/Search/BondSearch';
import {
  getTodayByListedDate,
  useDealDateMutation,
  useDisabledDealDate
} from '@fepkg/business/hooks/useDealDateMutation';
import { DEAL_TRADED_DATE_RANGE, useTradedDateRange } from '@fepkg/business/hooks/useTradedDateRange';
import { hasOption } from '@fepkg/business/utils/bond';
import { SERVER_NIL } from '@fepkg/common/constants';
import { formatDate, normalizeTimestamp } from '@fepkg/common/utils/date';
import { Direction, OperationType, ProductType } from '@fepkg/services/types/enum';
import moment, { Moment } from 'moment';
import { createContainer } from 'unstated-next';
import { useImmer } from 'use-immer';
import { useBondQuery } from '@/common/services/hooks/useBondQuery';
import { PriceState } from '@/components/business/PriceGroup';
import { useProductParams } from '@/layouts/Home/hooks';
import useUnit from '@/pages/Quote/SingleQuote/hooks/useUnit';
import { useMarketDealFormParams } from '../hooks/useParams';

type InitialState = {
  /** 默认带入的价格信息 */
  defaultPrice?: PriceState;
};

type MarketDealFormState = {
  /** 成交方向 */
  direction: Direction;
  /** 成交时间 */
  dealTime: Moment;
  /** 券面总额 */
  volume?: string;
  /** 成交备注 */
  comment?: string;
  /** 是否为过桥 */
  bridge?: boolean;
  /** 是否为代付 */
  payFor?: boolean;
  /** 是否为内部成交 */
  internal?: boolean;
  /** 是否为提交中 */
  submitting?: boolean;
  /** 是否发成交单 */
  isSyncReceiptDeal?: boolean;
};

const MarketDealFormContainer = createContainer((initialState?: InitialState) => {
  const { defaultValue } = useMarketDealFormParams();
  const { unit, updateUnit } = useUnit();
  const { bondSearchState } = useBondSearch();
  const { productType } = useProductParams();

  /** 操作类型，如果有默认的 deal id 说明为 Update，否则各种方式进入成交面板的都是 TrdDeal */
  const operationType = defaultValue?.deal_id ? OperationType.BondDealUpdate : OperationType.BondDealTrdDeal;
  const bond = bondSearchState.selected?.original;

  const hasOptionBond = hasOption(bond);

  const [formState, updateFormState] = useImmer<MarketDealFormState>(() => {
    let isSyncReceiptDeal: boolean | undefined = void 0;
    if (productType === ProductType.NCD) {
      isSyncReceiptDeal = operationType === OperationType.BondDealTrdDeal ? true : defaultValue?.is_sync_receipt_deal;
    }
    return {
      direction: defaultValue?.direction ?? Direction.DirectionTrd,
      dealTime: moment(normalizeTimestamp(defaultValue?.deal_time ?? Date.now())),
      volume: defaultValue?.volume && defaultValue.volume !== SERVER_NIL ? String(defaultValue.volume) : '',
      comment: defaultValue?.comment,
      bridge: defaultValue?.comment_flag_bridge,
      payFor: defaultValue?.comment_flag_pay_for,
      internal: defaultValue?.flag_internal,
      submitting: false,
      isSyncReceiptDeal
    };
  });

  const bondQuery = useBondQuery({ key_market_list: bond?.key_market ? [bond.key_market] : [] });
  const [bondRelated] = bondQuery?.data?.related_info_list ?? [];

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
  const [dealDateState, mutateDealDateState, resetDealDateState] = useDealDateMutation({
    productType,
    range: tradeDateRange,
    rangeMoment: tradeDateRangeMoment,
    defaultValue: { unlisted, today, tradedDate: defaultValue?.traded_date, deliveryDate: defaultValue?.delivery_date }
  });

  return {
    defaultPrice: initialState?.defaultPrice,
    formState,
    updateFormState,
    operationType,
    unit,
    updateUnit,
    bond,
    bondRelated,
    hasOptionBond,

    tradeDateRange,
    tradeDateRangeMoment,
    disabledDate,
    dealDateState,
    mutateDealDateState,
    resetDealDateState
  };
});

export const MarketDealFormProvider = MarketDealFormContainer.Provider;
export const useMarketDealForm = MarketDealFormContainer.useContainer;
