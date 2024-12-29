import { useState } from 'react';
import { TraceName } from '@fepkg/business/constants/trace-map';
import { hasOption } from '@fepkg/business/utils/bond';
import { SERVER_NIL } from '@fepkg/common/constants';
import { message as MessageUtils } from '@fepkg/components/Message';
import { QuoteDraftDetailSync } from '@fepkg/services/types/common';
import { BondQuoteType, QuoteRelatedInfoFailedType, Side, UserSettingFunction } from '@fepkg/services/types/enum';
import { useAtom, useSetAtom } from 'jotai';
import { useEnterDown } from '@/common/hooks/useEnterDown';
import { useLogger } from '@/common/providers/LoggerProvider';
import { mulUpdateBondQuoteDraftDetail } from '@/common/services/api/bond-quote-draft/detail-mul-update';
import { LocalQuoteDraftDetail } from '@/common/services/hooks/local-server/quote-draft/types';
import { quoteSetting, useUserSetting } from '@/common/services/hooks/useSettings/useUserSetting';
import { logger } from '@/common/utils/logger';
import { QuoteSettingsType } from '@/components/Quote/types';
import { useCalcBody } from '@/components/business/Calc/Body';
import { useCalcFooter } from '@/components/business/Calc/Footer';
import { CommentInputFlagValue } from '@/components/business/CommentInput';
import { usePriceGroup } from '@/components/business/PriceGroup';
import { useProductParams } from '@/layouts/Home/hooks';
import { quoteBatchFormOpenAtom } from '@/pages/Quote/BatchForm/atoms';
import { useBatchQuoteOper } from '@/pages/Quote/BatchForm/components/BatchQuoteOper';
import { QuoteParamsType } from '@/pages/Quote/SingleQuote/QuoteOper/QuoteOperProvider';
import { QuoteFlags } from '@/pages/Quote/SingleQuote/QuoteOper/types';
import { checkQuoteReminder } from '@/pages/Quote/SingleQuote/Reminder';
import { CalcPriceQueryVar } from '@/pages/Quote/SingleQuote/hooks/useCalcPriceQuery';
import { useFlagValue } from '@/pages/Quote/SingleQuote/providers/FlagProvider';
import { getExercise } from '@/pages/Quote/SingleQuote/utils';
import { quoteMdlSelectedAtom } from '../atoms/modal';
import { getGroupDetailIndexCache, isFlagsChanged, isPendingStatus, updateMessageDetails } from '../utils';

export const useQuoteBatchFormSubmit = () => {
  const { productType } = useProductParams();
  const { selectedSide, flagsInfo, valuationInfo, volume } = useBatchQuoteOper();
  const { priceInfo } = usePriceGroup();
  const { calc } = useCalcBody();
  const { footerValue } = useCalcFooter();
  const { flagValue } = useFlagValue();
  const { getSetting } = useUserSetting<QuoteSettingsType>(quoteSetting);

  const { getLogContext, wrapperSubmit } = useLogger();

  const ctx = () => getLogContext(TraceName.COLLABORATIVE_BATCH_QUOTE_SUBMIT);

  const setOpen = useSetAtom(quoteBatchFormOpenAtom);
  const [selected, setSelected] = useAtom(quoteMdlSelectedAtom);
  const [submitting, setSubmitting] = useState(false);

  const handleConfirmInner = async () => {
    try {
      if (!selected) return;

      const { message_id } = selected.message;

      if (!message_id) return;
      if (!selected.details.length) return;

      const selectedDetailIds = new Set(
        selected.details
          .filter(item => isPendingStatus(item?.status))
          .map(item => item?.detail_id)
          .filter(Boolean)
      );

      logger.ctxInfo(
        ctx(),
        `[handleConfirmInner] start submit, selectedDetailIds=${JSON.stringify([...selectedDetailIds])}`
      );

      const modifiedPriceInfo = priceInfo[Side.SideNone];

      let priceChanged = false;
      if (modifiedPriceInfo?.quote_type !== BondQuoteType.Yield && modifiedPriceInfo?.quote_price) priceChanged = true;
      else if (modifiedPriceInfo?.return_point !== void 0) priceChanged = true;
      else if (modifiedPriceInfo?.quote_price) priceChanged = true;
      else if (modifiedPriceInfo?.flag_intention) priceChanged = true;
      else if (modifiedPriceInfo?.flag_rebate) priceChanged = true;

      logger.ctxInfo(
        ctx(),
        `[handleConfirmInner] price is changed?, priceChanged=${priceChanged}, modifiedPriceInfo=${JSON.stringify(
          modifiedPriceInfo
        )}`
      );

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

      /** 是否有选中标签信息，如果有，需要覆盖原有标签 */
      const flagsChanged = isFlagsChanged(flagsInfo);

      const flags: QuoteFlags = flagsChanged
        ? {
            ...flagsInfo,
            flag_star: flagsInfo?.flag_star ?? 0,
            flag_exchange: flagsInfo?.flag_exchange ?? false,
            flag_package: flagsInfo?.flag_package ?? false,
            flag_oco: flagsInfo?.flag_oco ?? false
          }
        : {};

      logger.ctxInfo(
        ctx(),
        `[handleConfirmInner] flagsChanged is changed?, flagsChanged=${flagsChanged}, flags=${JSON.stringify(flags)}`
      );

      /** 是否有已选中的备注标签信息，如果有，需要覆盖原有备注与备注标签 */
      const commentChanged = footerValue?.comment;
      const commentFlagsChanged = isFlagsChanged(footerValue?.flagValue);
      const commentFlags: CommentInputFlagValue = commentFlagsChanged
        ? {
            flag_stock_exchange: false,
            flag_bilateral: false,
            flag_request: false,
            flag_indivisible: false,
            ...footerValue?.flagValue
          }
        : {};

      logger.ctxInfo(
        ctx(),
        `[handleConfirmInner] commentFlagsChanged is changed?, commentFlagsChanged=${commentFlagsChanged}, commentFlags=${JSON.stringify(
          commentFlags
        )}`
      );

      const quoteCache = new Map<string, QuoteDraftDetailSync>();
      const reminderCache = new Map<string, boolean>();

      const orders = selected.message.detail_order_list ?? [];
      const detailIdxCache = getGroupDetailIndexCache(orders);

      /** 检查倒挂 */
      const calcPriceQueryVars: CalcPriceQueryVar[] = [];

      for (let i = 0, len = selected.details.length; i < len; i++) {
        const item = selected.details[i];
        const side = selectedSide ?? item?.side;

        if (!item) continue;

        let { quote_type, price, return_point, flag_intention = false, flag_rebate = false } = item;

        const bond = item?.bond_info;
        const hasOptionBond = hasOption(bond);

        if (priceChanged) {
          quote_type = modifiedPriceInfo?.quote_type;
          price = Number(modifiedPriceInfo?.quote_price);
          return_point = Number(modifiedPriceInfo?.return_point);

          if (!price || price <= 0) price = SERVER_NIL;
          if (!return_point || return_point <= 0) return_point = SERVER_NIL;

          flag_intention = !!modifiedPriceInfo?.flag_intention;
          flag_rebate = !!modifiedPriceInfo?.flag_rebate;
        } else {
          const { csi_yield_exe, csi_yield_mat, val_yield_exe, val_yield_mat } = bond ?? {};

          const valuation = Number(valuationInfo.value ?? 0) / 100;
          const decimalDigit = Number(getSetting<number>(UserSettingFunction.UserSettingValuationDecimalDigit) || 4);

          const originalPrice = price;

          if (valuationInfo.csi) {
            if (hasOptionBond) {
              if (csi_yield_exe && csi_yield_exe > 0) {
                price = csi_yield_exe + valuation;
              }
            } else if (csi_yield_mat && csi_yield_mat > 0) {
              price = csi_yield_mat + valuation;
            }
          } else if (valuationInfo.val) {
            if (hasOptionBond) {
              if (val_yield_exe && val_yield_exe > 0) {
                price = val_yield_exe + valuation;
              }
            } else if (val_yield_mat && val_yield_mat > 0) {
              price = val_yield_mat + valuation;
            }
          }

          if (originalPrice !== price) {
            quote_type = BondQuoteType.Yield;
            price = Number(price?.toFixed(decimalDigit)) || void 0;
            return_point = SERVER_NIL;
            flag_intention = false;
            flag_rebate = false;
          }
        }

        const { flag_internal, flag_urgent, flag_sustained_volume } = item;
        let { comment } = item;

        if (commentChanged) comment = footerValue.comment ?? '';

        /** OCO和打包互斥 */
        if (flags.flag_oco) flags.flag_package = false;
        if (flags.flag_package) flags.flag_oco = false;

        const { is_exercise, exercise_manual } = getExercise(
          { productType, quote_type, is_exercise: item.is_exercise, exercise_manual: item.exercise_manual },
          hasOptionBond,
          !priceChanged
        );

        const quote = {
          ...item,
          side,
          // 价格相关信息
          quote_type,
          /** quote_price仅用于倒挂检测 */
          quote_price: price,
          price,
          return_point,
          yield: quote_type === BondQuoteType.Yield ? price : item?.price,
          clean_price: quote_type === BondQuoteType.CleanPrice ? price : item?.price,
          flag_intention,
          flag_rebate,
          volume: volume ? Number(volume) : item?.volume,
          // 结算方式相关信息
          ...settlementInfo,
          // 标签相关信息
          ...flags,
          // 备注相关信息
          comment,
          ...commentFlags,
          // 内部报价
          flag_internal: flagValue?.flag_internal || flag_internal,
          // 紧急
          flag_urgent: flagValue?.flag_urgent || flag_urgent,
          // 续量
          flag_sustained_volume: flagValue.flag_sustained_volume || flag_sustained_volume,
          is_exercise,
          exercise_manual
        };

        if (side && item?.detail_id) quoteCache.set(item.detail_id, quote);

        const queryVar: CalcPriceQueryVar = {
          bond,
          bidIsValid: false,
          ofrIsValid: false,
          quoteParams: {}
        };

        const index = detailIdxCache.get(item.detail_id);

        if (side === Side.SideBid) {
          queryVar.bidIsValid = true;
          queryVar.bidIndex = index;
          queryVar.quoteParams[Side.SideBid] = quote as QuoteParamsType;
        } else if (side === Side.SideOfr) {
          queryVar.ofrIsValid = true;
          queryVar.ofrIndex = index;
          queryVar.quoteParams[Side.SideOfr] = quote as QuoteParamsType;
        }

        if (bond) calcPriceQueryVars.push(queryVar);
      }

      // 不为意向价时才检测到挂
      if (!modifiedPriceInfo?.flag_intention) {
        const [, reminders] = await checkQuoteReminder({ batch: true, productType, calcPriceQueryVars, remind: false });

        logger.ctxInfo(
          ctx(),
          `[checkQuoteReminder] flag_intention is false, check quote reminder, calcPriceQueryVars=${JSON.stringify(
            calcPriceQueryVars
          )}, reminders=${JSON.stringify(reminders)}`
        );

        reminders.forEach((reminder, idx) => {
          const detail = selected.details[idx];
          const side = selectedSide ?? detail?.side;
          if (side && detail?.detail_id) {
            reminderCache.set(detail.detail_id, !!reminder[side]?.invertedInfo?.inverted);
          }
        });
      }

      const detail_list: LocalQuoteDraftDetail[] = [];

      const upsert = updateMessageDetails({
        message: selected.message,
        changer: detail => {
          if (selectedDetailIds.has(detail.detail_id)) {
            const updated: LocalQuoteDraftDetail = {
              ...detail,
              ...quoteCache.get(detail.detail_id),
              flag_inverted: reminderCache.get(detail.detail_id)
            };

            detail_list.push(updated);
            return updated;
          }
          return detail;
        }
      });

      if (!detail_list.length) return;

      setSubmitting(true);

      logger.ctxInfo(ctx(), `[mulUpdateBondQuoteDraftDetail] request to server, detail_list=${detail_list}`);

      const { failed_list } = await mulUpdateBondQuoteDraftDetail({ detail_list }, { traceCtx: ctx() });

      logger.ctxInfo(ctx(), `[mulUpdateBondQuoteDraftDetail] request down, failed_list=${failed_list}`);

      if (failed_list?.length === detail_list.length) {
        const allProcessed = failed_list.every(
          item => item.failed_type === QuoteRelatedInfoFailedType.FailedTypeOtherProcessed
        );

        if (allProcessed) MessageUtils.error('当前卡片已由他人处理，提交失败！');
      } else {
        const someProcessed = failed_list?.some(
          item => item.failed_type === QuoteRelatedInfoFailedType.FailedTypeOtherProcessed
        );

        if (someProcessed) MessageUtils.error('部分报价已由他人处理！');

        setOpen(false);
        setSelected(undefined);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirm = async () => {
    await wrapperSubmit(TraceName.COLLABORATIVE_BATCH_QUOTE_SUBMIT, handleConfirmInner);
  };

  useEnterDown(handleConfirm);

  return { submitting, handleConfirm };
};
