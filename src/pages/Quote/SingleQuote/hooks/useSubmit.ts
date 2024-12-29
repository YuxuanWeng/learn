import { useRef, useState } from 'react';
import { TraceName } from '@fepkg/business/constants/trace-map';
import { hasOption } from '@fepkg/business/utils/bond';
import { message } from '@fepkg/components/Message';
import { ModalUtils } from '@fepkg/components/Modal';
import type { BondQuoteMulCreate } from '@fepkg/services/types/bond-quote/mul-create';
import type { BondQuoteMulUpdate } from '@fepkg/services/types/bond-quote/mul-update';
import { LiquidationSpeed, QuoteInsert, QuoteLite } from '@fepkg/services/types/common';
import { OperationType, Side } from '@fepkg/services/types/enum';
import { withCtx } from '@fepkg/trace';
import { map } from 'lodash-es';
import { TrackEventType, useFlowLogger } from '@/common/providers/FlowLoggerProvider';
import {
  quoteSubmitLogCloseTime,
  quoteSubmitLogSubmitTime,
  quoteSubmitLogType
} from '@/common/services/hooks/useBondQuoteQuery/useQuoteSubmitTimeConsumingLog';
import {
  QuoteUndoRequestConfig,
  mulCreateBondQuoteWithUndo,
  mulUnrefBondQuoteWithUndo,
  mulUpdateBondQuoteWithUndo
} from '@/common/undo-services';
import { copyQuotesByID } from '@/common/utils/copy';
import { checkListing, generateLegalLiqSpeed, getDefaultTagsByProduct } from '@/common/utils/liq-speed';
import { logger } from '@/common/utils/logger';
import { PARSING_REGEX, useBondSearch } from '@/components/business/Search/BondSearch';
import { useBrokerSearch } from '@/components/business/Search/BrokerSearch';
import { useInstTraderSearch } from '@/components/business/Search/InstTraderSearch';
import { useDialogLayout } from '@/layouts/Dialog/hooks';
import { useProductParams } from '@/layouts/Home/hooks';
import { usePanelState } from '../Panel/PanelStateProvider';
import { usePanelParams } from '../Panel/usePanelParams';
import { QuoteParamsType, checkQuoteSideParams, useQuoteOper } from '../QuoteOper/QuoteOperProvider';
import { checkQuoteReminder } from '../Reminder';
import { LOGGER_SUBMIT_CHECK } from '../constants';
import { useFlagValue } from '../providers/FlagProvider';
import { useFocus } from '../providers/FocusProvider';
import { useParsingUpload } from '../providers/ParsingUploadProvider';
import { QuoteActionMode } from '../types';
import { getExercise as getExerciseUtil, toggleRootElOpacity } from '../utils';
import { useAlwaysOpen } from './useAlwaysOpen';
import { useCalcPriceQuery } from './useCalcPriceQuery';

export interface SubmitResponse {
  success: boolean;
  res?: BondQuoteMulCreate.Response | BondQuoteMulUpdate.Response;
  req?: BondQuoteMulCreate.Request | BondQuoteMulUpdate.Request;
}

const useSubmit = () => {
  const { productType } = useProductParams();

  /** 报价面板信息 */
  const { openTime, defaultParams, reset } = usePanelParams();

  const { actionMode, defaultValue, disabled: disabledPanel } = defaultParams;
  const { opacityChangedByCancel, ctx, updatePanelState, wrapperSubmit } = usePanelState();
  const { bondSearchState } = useBondSearch();
  const { instTraderSearchState } = useInstTraderSearch();
  const { brokerSearchState } = useBrokerSearch();
  const { quoteParams, disabled, currentOpenCalcSide, bidInsert, ofrInsert, bidIsValid, ofrIsValid } = useQuoteOper();
  const { uploadParsingContent } = useParsingUpload();

  const { trackEvent, trackPoint } = useFlowLogger();

  const { focus, updatePrevFocusRef } = useFocus();

  const { flagValue } = useFlagValue();

  const { confirm } = useDialogLayout();
  const [alwaysOpen] = useAlwaysOpen();
  const [submitting, setSubmitting] = useState(false);
  const checking = useRef(false);

  const bond = bondSearchState.selected?.original;
  const inst = instTraderSearchState.selected?.original.inst_info;
  const trader = instTraderSearchState.selected?.original;
  const broker_id = brokerSearchState.selected?.original.user_id;

  const calcPriceQueryVars = bond ? [{ bond, quoteParams, bidIsValid, ofrIsValid }] : [];
  useCalcPriceQuery({ variables: calcPriceQueryVars });

  /** 检查债券信息 */
  const checkBond = () => {
    logger.ctxInfo(ctx(), `key_market=${bond?.key_market} `);
    if (!bond?.key_market) {
      message.error('未获取到产品数据！请核对后重新录入！');
      return false;
    }
    return true;
  };

  /** 检查机构/交易员/经纪人是否缺失 */
  const checkHandle = () => {
    logger.ctxInfo(
      ctx(),
      `[checkHandle] inst_id=${inst?.inst_id} trader_id=${trader?.trader_id} broker_id=${broker_id}`
    );
    let msg = '';
    if (!inst?.inst_id) msg = '未获取到机构数据！请核对后重新录入！';
    // TODO 若填写的机构/交易员没有当前台子的报价权限，或不为【在业】和【启用】状态，则提交失败并提示“机构或交易员失效！请核对后重新录入！”
    else if (!trader?.trader_id) msg = '未获取到交易员数据！请核对后重新录入！';
    else if (!broker_id) msg = '未获取到经纪人数据！请核对后重新录入！';
    if (msg) {
      message.error(msg);
      return false;
    }
    return true;
  };

  /** 检查报价信息是否完整 */
  const checkQuoteParams = () => {
    let isInvalid = true;

    logger.ctxInfo(
      ctx(),
      `[checkQuoteParams] disable[bid]=${disabled[Side.SideBid]}, disable[ofr]=${
        disabled[Side.SideOfr]
      }, quoteParams=${JSON.stringify(quoteParams)}`
    );

    // 双边报价，只存在一个合法信息即可
    if (!disabled[Side.SideBid] && !disabled[Side.SideOfr])
      isInvalid = checkQuoteSideParams(Side.SideBid, quoteParams) || checkQuoteSideParams(Side.SideOfr, quoteParams);
    // bid方向报价
    else if (!disabled[Side.SideBid]) isInvalid = checkQuoteSideParams(Side.SideBid, quoteParams);
    // ofr方向报价
    else if (!disabled[Side.SideOfr]) isInvalid = checkQuoteSideParams(Side.SideOfr, quoteParams);
    if (!isInvalid) {
      message.error('未获取到报价信息！请核对后重新录入！');
    }
    return isInvalid;
  };

  /** 检查交易日下市日的关系 */
  const checkLiqSpeeds = async () => {
    let liqSpeeds: LiquidationSpeed[] = [];
    if (bidIsValid) liqSpeeds = [...liqSpeeds, ...(bidInsert?.liquidation_speed_list || [])];
    if (ofrIsValid) liqSpeeds = [...liqSpeeds, ...(ofrInsert?.liquidation_speed_list || [])];
    const { liqSpeeds: noDefaultList, hasDefault } = getDefaultTagsByProduct(liqSpeeds, productType);

    logger.ctxInfo(ctx(), `[checkLiqSpeeds] liqSpeeds=${JSON.stringify(liqSpeeds)}, hasDefault=${hasDefault}`);

    const liqSpeedsIsInValid = await checkListing(
      hasDefault,
      { liquidation_speed_list: noDefaultList },
      bond,
      productType,
      ctx()
    );

    if (liqSpeedsIsInValid) {
      logger.ctxInfo(ctx(), '[checkLiqSpeeds] failed for invalid liqSpeed, trade date later than delisted date');
      message.error('交易日不可晚于或等于下市日！');
    }

    return !liqSpeedsIsInValid;
  };

  /** 提交前校验 */
  const check = async () => {
    if (!checkBond()) {
      trackPoint(LOGGER_SUBMIT_CHECK, 'check bond failed');
      return false;
    }
    if (!checkHandle()) {
      trackPoint(LOGGER_SUBMIT_CHECK, 'check handle failed');
      return false;
    }
    if (!checkQuoteParams()) {
      trackPoint(LOGGER_SUBMIT_CHECK, 'check quote failed');
      return false;
    }
    if (!(await checkLiqSpeeds())) {
      trackPoint(LOGGER_SUBMIT_CHECK, 'check liqSpeed failed');
      return false;
    }

    updatePrevFocusRef();

    logger.ctxInfo(
      ctx(),
      `[check] checkQuoteReminder, productType=${productType}, calcPriceQueryVars=${JSON.stringify(calcPriceQueryVars)}`
    );

    const [next] = await checkQuoteReminder(
      {
        productType,
        calcPriceQueryVars,
        excludeQuoteId: actionMode === QuoteActionMode.EDIT ? defaultValue?.quote_id : undefined
      },
      ctx()
    );

    if (!next) {
      requestIdleCallback(() => {
        focus();
      });
      trackPoint(LOGGER_SUBMIT_CHECK, 'check reminder failed');
      return false;
    }

    return true;
  };

  const handleCheck = async () => {
    logger.ctxInfo(ctx(), '[handleCheck] start quote check');
    checking.current = true;

    setSubmitting(true);
    const canSubmit = await check();
    logger.ctxInfo(ctx(), `[handleCheck] check done, canSubmit=${canSubmit}`);
    if (!canSubmit) setSubmitting(false);

    checking.current = false;
    return canSubmit;
  };

  /** 获取行权/到期 */
  const getExercise = (params: QuoteParamsType) => {
    const { quote_type, is_exercise, exercise_manual } = params;
    const isHasOption = hasOption({ has_option: bond?.has_option, option_type: bond?.option_type });
    return getExerciseUtil({ productType, quote_type, is_exercise, exercise_manual }, isHasOption);
  };

  /** 新增报价 */
  const create = async () => {
    logger.ctxInfo(ctx(), '[create] start create quote');
    // 报价面板数据缺失
    if (!bond?.key_market || !trader?.trader_id || !broker_id) {
      logger.ctxWarn(
        ctx(),
        `failed create quote, invalid quote params, key_market=${bond?.key_market}, trader_id=${trader?.trader_id}, broker_id=${broker_id}`
      );
      return { success: false };
    }
    const { trader_id } = trader;
    const insertParamsPatch = { bond_key_market: bond.key_market, broker_id, trader_id };

    const quote_item_list: QuoteInsert[] = [];
    if (bidIsValid && bidInsert) quote_item_list.push({ ...bidInsert, ...insertParamsPatch, ...flagValue });
    if (ofrIsValid && ofrInsert) quote_item_list.push({ ...ofrInsert, ...insertParamsPatch, ...flagValue });

    const requestParams: [BondQuoteMulCreate.Request, QuoteUndoRequestConfig] = [
      {
        quote_item_list: await Promise.all(
          map(quote_item_list, async v => {
            return {
              ...v,
              liquidation_speed_list: await withCtx(
                ctx(),
                generateLegalLiqSpeed,
                v.liquidation_speed_list,
                productType,
                bond
              ),
              ...getExercise(v)
            };
          })
        ),
        operation_info: { operation_type: OperationType.BondQuoteAdd }
      },
      { productType, tag: bond.short_name, traceCtx: ctx() }
    ];

    const res = await mulCreateBondQuoteWithUndo(...requestParams);
    if (productType && bond && quote_item_list.length >= 1) {
      // 此处将await取消，加速窗口关闭时间
      copyQuotesByID(productType, [bond.bond_key], undefined, undefined, ctx()).then();
    }
    uploadParsingContent(requestParams[0]);
    return { req: requestParams[0], res, success: true };
  };

  /** 编辑报价 */
  const edit = async () => {
    const quote = disabled[Side.SideBid] ? ofrInsert : bidInsert;
    const insertParamsPatch = { broker_id, trader_id: trader?.trader_id };
    if (actionMode !== QuoteActionMode.EDIT || !defaultValue?.quote_id || !quote) return { success: false };

    const requestParams: [BondQuoteMulUpdate.Request, QuoteUndoRequestConfig] = [
      {
        quote_item_list: [
          {
            quote_id: defaultValue.quote_id,
            ...quote,
            ...insertParamsPatch,
            ...flagValue,
            comment: quote.comment || '',
            ...getExercise(quote)
          }
        ],
        operation_info: { operation_type: OperationType.BondQuoteUpdate }
      },
      { origin: [defaultValue as QuoteLite], productType, traceCtx: ctx() }
    ];

    const res = await mulUpdateBondQuoteWithUndo(...requestParams);
    if (productType && bond) {
      // 此处将await取消，加速窗口关闭时间
      copyQuotesByID(productType, [bond.bond_key]).then();
    }
    return { req: requestParams[0], res, success: true };
  };

  const unrefer = async () => {
    logger.ctxInfo(ctx(), '[unrefer] start unrefer quote');
    const quote = disabled[Side.SideBid] ? ofrInsert : bidInsert;
    const insertParamsPatch = { broker_id, trader_id: trader?.trader_id };

    if (actionMode !== QuoteActionMode.EDIT_UNREFER || !defaultValue?.quote_id || !quote) {
      logger.ctxInfo(
        ctx(),
        `[unrefer] failed unrefer quote, actionMode=${actionMode} defaultQuoteId=${defaultValue?.quote_id} quote=${!!quote}`
      );
      return { success: false };
    }

    const returnLiqSpeedList = await generateLegalLiqSpeed(
      quote.liquidation_speed_list,
      productType,
      bond,
      OperationType.BondQuoteUnRefer
    );

    const requestParams: [BondQuoteMulUpdate.Request, QuoteUndoRequestConfig] = [
      {
        quote_item_list: [
          {
            quote_id: defaultValue.quote_id,
            ...quote,
            ...insertParamsPatch,
            ...flagValue,
            comment: quote.comment || '',
            ...getExercise(quote),
            // unrefer时，需要手动指定refer_type为0
            refer_type: 0,
            liquidation_speed_list: returnLiqSpeedList
          }
        ],
        operation_info: { operation_type: OperationType.BondQuoteEditReferredQuote }
      },
      { origin: [defaultValue as QuoteLite], productType, traceCtx: ctx() }
    ];

    const res = await mulUnrefBondQuoteWithUndo(...requestParams);
    if (productType && bond) {
      // 此处将await取消，加速窗口关闭时间
      copyQuotesByID(productType, [bond.bond_key]).then();
    }
    return { req: requestParams[0], res, success: true };
  };

  const afterSubmit = (result: SubmitResponse) => {
    if (!alwaysOpen) {
      // 提交成功后，透明报价面板
      opacityChangedByCancel.current = true;
      toggleRootElOpacity(false);

      // 如果未打开<常开>,则正常关闭报价面板
      localStorage.setItem(quoteSubmitLogCloseTime, `${Date.now()}`);
      logger.ctxInfo(ctx(), '[afterSubmit] set quote panel opacity');
    } else {
      message.destroy();
      message.success('报价提交完成！');
    }

    logger.ctxInfo(ctx(), `[afterSubmit] alwaysOpen=${alwaysOpen} result=${JSON.stringify(result ?? {})}`);

    if (result) {
      updatePanelState(draft => {
        draft.lastActionTime = Date.now();
      });
      reset();
      confirm(result, { isCloseModal: !alwaysOpen });
    }
  };

  /** 提交报价 */
  const handleSubmitInner = async () => {
    logger.ctxInfo(
      ctx(),
      `[handleSubmitInner] start submit quote, action=${actionMode} submitting=${checking.current || submitting}`
    );

    if (currentOpenCalcSide) return;

    // 如果正在检查，不要再提交报价
    if (checking.current || submitting) return;

    trackEvent(TrackEventType.Submit, alwaysOpen);

    const canSubmit = await handleCheck();
    if (!canSubmit) return;

    let action: typeof create | typeof edit | typeof unrefer;
    switch (actionMode) {
      case QuoteActionMode.EDIT:
        action = edit;
        break;
      case QuoteActionMode.EDIT_UNREFER:
        action = unrefer;
        break;
      default:
        action = create;
        break;
    }
    try {
      const startTime = performance.now();
      localStorage.setItem(quoteSubmitLogType, String(actionMode));
      const result = await withCtx(ctx(), action);
      localStorage.setItem(quoteSubmitLogSubmitTime, `${performance.now() - startTime}`);

      setSubmitting(false);

      if (!result.success) {
        logger.ctxWarn(ctx(), `[handleSubmitInner] failed submit quote, result=${result.res}`);
        return;
      }

      logger.ctxInfo(ctx(), `[handleSubmitInner] success submit quote, result=${JSON.stringify(result)}`);
      trackEvent(TrackEventType.Success, alwaysOpen, { enterTime: openTime.current });
      openTime.current = Date.now();

      afterSubmit(result);
    } catch (ex) {
      logger.ctxError(ctx(), `[handleSubmitInner] failed submit quote, exception=${ex}`);
    } finally {
      ModalUtils.destroyAll();
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    await wrapperSubmit(TraceName.SINGLE_QUOTE_SUBMIT, handleSubmitInner);
  };

  /** 回车提交 */
  const handleEnterDown = () => {
    if (disabledPanel) return;

    // 判断 4 个 Search 是不是都没有展开下拉列表（optionsOpen），或者 bondSearch 不在识别
    // 如果符合条件，则提交，否则不提交
    if (PARSING_REGEX.test(bondSearchState.keyword) && !bondSearchState.selected) return;

    handleSubmit();
  };

  return { handleSubmit, handleEnterDown, submitting };
};

export default useSubmit;
