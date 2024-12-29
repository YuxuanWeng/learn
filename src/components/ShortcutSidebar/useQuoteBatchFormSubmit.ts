import { useState } from 'react';
import { TraceName } from '@fepkg/business/constants/trace-map';
import { hasOption } from '@fepkg/business/utils/bond';
import { SERVER_NIL } from '@fepkg/common/constants';
import { noNil } from '@fepkg/common/utils/utils';
import { QuoteLite, QuoteUpdate } from '@fepkg/services/types/common';
import { BondQuoteType, OperationType, Side, UserSettingFunction } from '@fepkg/services/types/enum';
import { atom, useAtom, useSetAtom } from 'jotai';
import { useEnterDown } from '@/common/hooks/useEnterDown';
import { useLogger } from '@/common/providers/LoggerProvider';
import { mulUpdateBondQuote } from '@/common/services/api/bond-quote/mul-update';
import { quoteSetting, useUserSetting } from '@/common/services/hooks/useSettings/useUserSetting';
import { mulUpdateBondQuoteWithUndo } from '@/common/undo-services';
// import { copyQuotesByID } from '@/common/utils/copy';
import { logger } from '@/common/utils/logger';
import { useProductParams } from '@/layouts/Home/hooks';
import { useProductPanel } from '@/pages/ProductPanel/providers/PanelProvider';
import { ProductPanelTableKey } from '@/pages/ProductPanel/types';
import { quoteBatchFormOpenAtom } from '@/pages/Quote/BatchForm/atoms';
import { useBatchQuoteOper } from '@/pages/Quote/BatchForm/components/BatchQuoteOper';
import { QuoteParamsType } from '@/pages/Quote/SingleQuote/QuoteOper/QuoteOperProvider';
import { CalcPriceQueryVar } from '@/pages/Quote/SingleQuote/hooks/useCalcPriceQuery';
import { getExercise } from '@/pages/Quote/SingleQuote/utils';
import { QuoteSettingsType } from '../Quote/types';
import { useCalcBody } from '../business/Calc/Body';
import { useCalcFooter } from '../business/Calc/Footer';
import { usePriceGroup } from '../business/PriceGroup';
import { useBrokerSearch } from '../business/Search/BrokerSearch';
import { useInstTraderSearch } from '../business/Search/InstTraderSearch';
import { useShortcutSidebarProps } from './PropsProvider';

export const quoteBatchFormSelectedListAtom = atom<QuoteLite[]>([]);

const logFlag = 'batch-edit-quote';

export const useQuoteBatchFormSubmit = () => {
  const { productType } = useProductParams();
  const { activeTableKey } = useProductPanel();
  const { onEventSuccess } = useShortcutSidebarProps();

  const { selectedSide, valuationInfo, volume } = useBatchQuoteOper();
  const { priceInfo } = usePriceGroup();
  const { calc } = useCalcBody();
  const { footerValue } = useCalcFooter();
  const { getSetting } = useUserSetting<QuoteSettingsType>(quoteSetting);
  const { instTraderSearchState } = useInstTraderSearch();
  const { brokerSearchState } = useBrokerSearch();

  const { getLogContext, wrapperSubmit } = useLogger();

  const ctx = () => getLogContext(TraceName.BATCH_QUOTE_SUBMIT);

  const setOpen = useSetAtom(quoteBatchFormOpenAtom);
  const [list, setList] = useAtom(quoteBatchFormSelectedListAtom);
  const [submitting, setSubmitting] = useState(false);

  const modifiedPriceInfo = priceInfo[Side.SideNone];

  const isPriceChanged = () => {
    let changed = false;
    if (modifiedPriceInfo?.quote_type !== BondQuoteType.Yield && modifiedPriceInfo?.quote_price) changed = true;
    else if (modifiedPriceInfo?.return_point !== void 0) changed = true;
    else if (modifiedPriceInfo?.quote_price) changed = true;
    else if (modifiedPriceInfo?.flag_intention) changed = true;
    else if (modifiedPriceInfo?.flag_rebate) changed = true;

    return changed;
  };

  const getCommonUpdated = () => {
    const { trader_id } = instTraderSearchState.selected?.original ?? {};
    const { user_id: broker_id } = brokerSearchState.selected?.original ?? {};
    const { comment } = footerValue;
    const { flag_stock_exchange, flag_bilateral, flag_request, flag_indivisible } = footerValue?.flagValue ?? {};

    /** 是否有选中结算方式 */
    const settlementChanged =
      (!!calc?.traded_date && !!calc?.delivery_date) || (calc?.liquidation_speed_list?.length ?? 0) > 1;
    const settlementInfo = settlementChanged ? { ...calc } : {};

    logger.ctxInfo(
      ctx(),
      `[handleConfirmInner] settlementChanged is changed?, settlementChanged=${settlementChanged}, settlementInfo=${JSON.stringify(
        settlementInfo
      )}`
    );

    const updated = noNil({
      side: selectedSide,
      volume: Number(volume) || undefined,
      // 结算方式相关信息
      ...settlementInfo,
      comment,
      flag_stock_exchange,
      flag_bilateral,
      flag_request,
      flag_indivisible,
      trader_id,
      broker_id
    }) as Omit<QuoteUpdate, 'quote_id'>;

    return updated;
  };

  const handleConfirmInner = async () => {
    try {
      if (!list.length) return;

      setSubmitting(true);

      const commonUpdated = getCommonUpdated();

      let priceChanged = isPriceChanged();

      const quote_item_list: QuoteUpdate[] = [];
      // 检查倒挂
      const calcPriceQueryVars: CalcPriceQueryVar[] = [];

      for (let i = 0, len = list.length; i < len; i++) {
        const item = list[i];
        const side = selectedSide ?? item?.side;

        if (!item) continue;

        let { quote_type, quote_price, return_point, flag_intention = false, flag_rebate = false } = item;

        const bond = item?.bond_basic_info;
        const hasOptionBond = hasOption(bond);

        if (priceChanged) {
          quote_type = modifiedPriceInfo?.quote_type ?? BondQuoteType.Yield;
          quote_price = Number(modifiedPriceInfo?.quote_price);
          return_point = Number(modifiedPriceInfo?.return_point);

          if (!quote_price || quote_price <= 0) quote_price = SERVER_NIL;
          if (!return_point || return_point <= 0) return_point = SERVER_NIL;

          flag_intention = !!modifiedPriceInfo?.flag_intention;
          flag_rebate = !!modifiedPriceInfo?.flag_rebate;
        } else {
          const { csi_yield_exe, csi_yield_mat, val_yield_exe, val_yield_mat } = bond ?? {};

          const valuation = Number(valuationInfo.value ?? 0) / 100;
          const decimalDigit = Number(getSetting<number>(UserSettingFunction.UserSettingValuationDecimalDigit) || 4);

          const originalPrice = quote_price;

          if (valuationInfo.csi) {
            if (hasOptionBond) {
              if (csi_yield_exe && csi_yield_exe > 0) {
                quote_price = csi_yield_exe + valuation;
              }
            } else if (csi_yield_mat && csi_yield_mat > 0) {
              quote_price = csi_yield_mat + valuation;
            }
          } else if (valuationInfo.val) {
            if (hasOptionBond) {
              if (val_yield_exe && val_yield_exe > 0) {
                quote_price = val_yield_exe + valuation;
              }
            } else if (val_yield_mat && val_yield_mat > 0) {
              quote_price = val_yield_mat + valuation;
            }
          }

          priceChanged = originalPrice !== quote_price;

          if (priceChanged) {
            quote_type = BondQuoteType.Yield;
            quote_price = Number(quote_price?.toFixed(decimalDigit)) || void 0;
            return_point = SERVER_NIL;
            flag_intention = false;
            flag_rebate = false;
          }
        }

        // 这里的行权到期是拿来检查倒挂用的
        const { is_exercise, exercise_manual } = getExercise(
          { productType, quote_type, is_exercise: item.is_exercise, exercise_manual: item.exercise_manual },
          hasOptionBond,
          !priceChanged
        );

        const priceUpdated = {
          quote_type,
          quote_price,
          return_point,
          yield: quote_type === BondQuoteType.Yield ? quote_price : SERVER_NIL,
          clean_price: quote_type === BondQuoteType.CleanPrice ? quote_price : SERVER_NIL,
          flag_intention,
          flag_rebate
        };

        quote_item_list.push({ quote_id: item.quote_id, ...commonUpdated, ...(priceChanged ? priceUpdated : {}) });

        const queryVar: CalcPriceQueryVar = { bond, bidIsValid: false, ofrIsValid: false, quoteParams: {} };

        const calcPriceQuoteParams = { ...commonUpdated, ...priceUpdated, is_exercise, exercise_manual };

        if (side === Side.SideBid) {
          queryVar.bidIsValid = true;
          // queryVar.bidIndex = index;
          queryVar.quoteParams[Side.SideBid] = calcPriceQuoteParams as QuoteParamsType;
        } else if (side === Side.SideOfr) {
          queryVar.ofrIsValid = true;
          // queryVar.ofrIndex = index;
          queryVar.quoteParams[Side.SideOfr] = calcPriceQuoteParams as QuoteParamsType;
        }

        if (bond) calcPriceQueryVars.push(queryVar);
      }

      const params = { quote_item_list, operation_info: { operation_type: OperationType.BondQuoteUpdate } };

      logger.ctxInfo(
        ctx(),
        `[submit] start submit, params=${JSON.stringify(params)}, activeTableKey=${activeTableKey}`
      );

      const [response] = await Promise.all([
        activeTableKey === ProductPanelTableKey.Referred
          ? mulUpdateBondQuote(params, { traceCtx: ctx() })
          : mulUpdateBondQuoteWithUndo(params, { origin: list, productType, logFlag, traceCtx: ctx() })
        // 不知道这是一个什么逻辑
        // copyQuotesByID(productType, void 0, list)
      ]);

      logger.ctxInfo(ctx(), `[submit] submit success, response=${JSON.stringify(response)}`);

      setOpen(false);
      setList([]);

      onEventSuccess?.();
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirm = async () => {
    await wrapperSubmit(TraceName.BATCH_QUOTE_SUBMIT, handleConfirmInner);
  };

  useEnterDown(handleConfirm);

  return { submitting, handleConfirm };
};
