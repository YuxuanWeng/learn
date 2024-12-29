import { TraceName } from '@fepkg/business/constants/trace-map';
import { SERVER_NIL } from '@fepkg/common/constants';
import { message as MessageUtils } from '@fepkg/components/Message';
import { QuoteRelatedInfoFailedType, Side } from '@fepkg/services/types/enum';
import { QuoteDraftDetail } from 'app/types/DataLocalization/local-common';
import { useAtom, useSetAtom } from 'jotai';
import { useEnterDown } from '@/common/hooks/useEnterDown';
import { useLogger } from '@/common/providers/LoggerProvider';
import { mulUpdateBondQuoteDraftDetail } from '@/common/services/api/bond-quote-draft/detail-mul-update';
import { logger } from '@/common/utils/logger';
import { useCalcBody } from '@/components/business/Calc/Body';
import { useCalcFooter } from '@/components/business/Calc/Footer';
import { useExercise } from '@/components/business/ExerciseGroup/provider';
import { PARSING_REGEX, useBondSearch } from '@/components/business/Search/BondSearch';
import { useProductParams } from '@/layouts/Home/hooks';
import { checkQuoteSideParams, useQuoteOper } from '@/pages/Quote/SingleQuote/QuoteOper/QuoteOperProvider';
import { checkQuoteReminder } from '@/pages/Quote/SingleQuote/Reminder';
import { useFlagValue } from '@/pages/Quote/SingleQuote/providers/FlagProvider';
import { useFocus } from '@/pages/Quote/SingleQuote/providers/FocusProvider';
import { quoteMdlOpenAtom, quoteMdlSelectedAtom } from '../../../atoms/modal';

export const useSubmit = () => {
  const { productType } = useProductParams();
  const { bondSearchState } = useBondSearch();
  const { quoteParams, disabled, bidInsert, ofrInsert, bidIsValid, ofrIsValid } = useQuoteOper();
  const { calc } = useCalcBody();
  const { footerValue } = useCalcFooter();
  const { flagValue } = useFlagValue();
  const { exerciseBoolean, isSelected } = useExercise();
  const { focusPrice } = useFocus();

  const { getLogContext, wrapperSubmit } = useLogger();

  const ctx = () => getLogContext(TraceName.COLLABORATIVE_SINGLE_QUOTE_SUBMIT);

  const setOpen = useSetAtom(quoteMdlOpenAtom);
  const [selected, setSelected] = useAtom(quoteMdlSelectedAtom);

  const handleConfirmInner = async () => {
    if (!selected) return;
    logger.ctxInfo(ctx(), '[handleConfirmInner] start submit quote');
    if (PARSING_REGEX.test(bondSearchState.keyword)) {
      logger.ctxInfo(ctx(), '[handleConfirmInner] failed submit quote');
      return;
    }

    const selectedSide = disabled[Side.SideBid] ? Side.SideOfr : Side.SideBid;
    const quote = disabled[Side.SideBid] ? ofrInsert : bidInsert;

    const { message_id } = selected.message;
    const [selectedDetail] = selected.details;

    if (!message_id) return;
    if (!selectedDetail) return;

    const selectedBond = bondSearchState.selected?.original;
    if (!selectedBond) {
      logger.ctxInfo(ctx(), '[handleConfirmInner] failed submit quote, selectedBond is invalid');
      MessageUtils.error('未获取到产品数据！请核对后重新录入！');
      return;
    }

    if (!quote || !checkQuoteSideParams(selectedSide, { [selectedSide]: quote })) {
      logger.ctxInfo(
        ctx(),
        `[handleConfirmInner] failed submit quote, quote info is invalid, quote=${JSON.stringify(
          quote
        )}, selectedSide=${selectedSide}`
      );
      MessageUtils.error('未获取到报价信息！请核对后重新录入！');
      return;
    }

    let modifiedPrice: number | undefined = Number(quote.quote_price);
    if (!modifiedPrice || modifiedPrice <= 0) modifiedPrice = SERVER_NIL;

    // 如果既不是意向价，也没点亮返点，还没有价格，却能通过检查，说明有量，需要把价格置为意向价
    if (!quote.flag_intention && !quote.flag_rebate && modifiedPrice === SERVER_NIL) {
      quote.flag_intention = true;
    }

    // 正确赋值行权到期信息
    if (quoteParams[Side.SideBid]) quoteParams[Side.SideBid].is_exercise = exerciseBoolean;
    if (quoteParams[Side.SideOfr]) quoteParams[Side.SideOfr].is_exercise = exerciseBoolean;

    // 检查倒挂信息
    const calcPriceQueryVars = [{ bond: selectedBond, quoteParams, bidIsValid, ofrIsValid }];

    logger.ctxInfo(
      ctx(),
      `[handleConfirmInner] start checkQuoteReminder, calcPriceQueryVars=${JSON.stringify(calcPriceQueryVars)}`
    );
    const [next, reminders] = await checkQuoteReminder({ productType, calcPriceQueryVars, remind: false });
    if (!next) {
      // 若取消，需聚焦原有价格输入框
      requestIdleCallback(() => {
        focusPrice(selectedSide);
      });
      return;
    }

    const [reminder] = reminders;
    const inverted = !!reminder[selectedSide]?.invertedInfo?.inverted;

    logger.ctxInfo(
      ctx(),
      `[handleConfirmInner] after checkQuoteReminder, reminder=${JSON.stringify(reminder)}, inverted=${inverted}`
    );

    /** 通用修改信息 */
    const commonInfo = {
      // 债券相关信息
      bond_info: selectedBond,
      key_market: selectedBond.key_market,
      // 价格相关信息
      ...quote,
      price: modifiedPrice,
      // 结算方式相关信息
      ...calc,
      // 备注相关信息
      comment: footerValue.comment,
      ...footerValue?.flagValue,
      // 行权相关信息
      is_exercise: exerciseBoolean,
      exercise_manual: isSelected,
      // 内部报价
      flag_internal: !!flagValue?.flag_internal,
      // 紧急
      flag_urgent: !!flagValue?.flag_urgent,
      // 续量
      flag_sustained_volume: !!flagValue.flag_sustained_volume,
      // 倒挂
      flag_inverted: inverted
    };

    if (!selectedDetail) return;

    const detail: QuoteDraftDetail = { ...selectedDetail, ...commonInfo };

    logger.ctxInfo(ctx(), `[handleConfirmInner] start request to server, detail_list=${JSON.stringify([detail])}`);

    const { failed_list } = await mulUpdateBondQuoteDraftDetail({ detail_list: [detail] }, { traceCtx: ctx() });

    logger.ctxInfo(ctx(), `[handleConfirmInner] submit down, failed_list=${JSON.stringify(failed_list)}`);

    // const updated = {
    //   ...message,
    //   quote_draft_detail_list: message.quote_draft_detail_list?.map(d => {
    //     if (d.detail_id === detail.detail_id) return detail;
    //     return d;
    //   })
    // };

    if (failed_list?.length) {
      const [first] = failed_list;
      logger.ctxInfo(ctx(), `[handleConfirmInner] after request, failed_list=${JSON.stringify([failed_list])}`);
      if (first.failed_type === QuoteRelatedInfoFailedType.FailedTypeOtherProcessed) {
        MessageUtils.error('当前卡片已由他人处理，提交失败！');
      }
    } else {
      setOpen(false);
      setSelected(undefined);
    }
  };

  const handleConfirm = async () => {
    await wrapperSubmit(TraceName.COLLABORATIVE_SINGLE_QUOTE_SUBMIT, handleConfirmInner);
  };

  useEnterDown(handleConfirm);

  return { handleConfirm };
};
