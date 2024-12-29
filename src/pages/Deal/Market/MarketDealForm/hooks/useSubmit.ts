import { NEW_SERVER_NIL } from '@fepkg/business/constants';
import { TraceName } from '@fepkg/business/constants/trace-map';
import { getLiqSpeed } from '@fepkg/business/hooks/useDealDateMutation';
import { formatNumber2ServerNil } from '@fepkg/business/utils/price';
import { message } from '@fepkg/components/Message';
import { ModalUtils } from '@fepkg/components/Modal';
import { MarketDealCreate, MarketDealUpdate } from '@fepkg/services/types/common';
import {
  MarketDealLastActionType,
  OperationSource,
  OperationType,
  ProductType,
  Side
} from '@fepkg/services/types/enum';
import { withCtx } from '@fepkg/trace';
import { omit } from 'lodash-es';
import moment from 'moment';
import { useLogger } from '@/common/providers/LoggerProvider';
import { mulCreateMarketDealWithUndo, mulUpdateMarketDealWithUndo } from '@/common/undo-services';
import { logger } from '@/common/utils/logger';
import { useExercise } from '@/components/business/ExerciseGroup/provider';
import { usePriceGroup } from '@/components/business/PriceGroup';
import { useDialogLayout } from '@/layouts/Dialog/hooks';
import { useProductParams } from '@/layouts/Home/hooks';
import { useMarketDealTrades } from '@/pages/Deal/Market/MarketDealForm/providers/MarketTradesProvider';
import { useMarketDealForm } from '../providers/FormProvider';
import { useMarketDealFormParams } from './useParams';

const copyUnlessKeys = [
  'bid_institution_id',
  'bid_institution_name',
  'bid_trader_id',
  'bid_trader_name',
  'bid_trader_tag',
  'bid_trader_is_vip',
  'bid_broker_id',
  'bid_broker_name',
  'bid_broker_percent',
  'ofr_institution_id',
  'ofr_institution_name',
  'ofr_trader_id',
  'ofr_trader_name',
  'ofr_trader_tag',
  'ofr_trader_is_vip',
  'ofr_broker_id',
  'ofr_broker_name',
  'ofr_broker_percent',
  'operator_id',
  'operator_name'
];

const SIDE = Side.SideNone;

export const useSubmit = () => {
  const { confirm, cancel } = useDialogLayout();
  const { productType } = useProductParams();
  const { defaultValue, defaultQuote, copyCount } = useMarketDealFormParams();
  const { formState, updateFormState, operationType, bond, tradeDateRange, dealDateState } = useMarketDealForm();
  const { priceInfo } = usePriceGroup();
  const { exerciseBoolean, isSelected } = useExercise();
  const { getLogContext, wrapperSubmit } = useLogger();
  const { trades } = useMarketDealTrades();
  const ctx = () => getLogContext(TraceName.MARKET_DEAL_SUBMIT);

  const sidePriceInfo = priceInfo[SIDE];

  const toggleSubmitting = (val: boolean) => {
    updateFormState(draft => {
      draft.submitting = val;
    });
  };

  const getPrice = () => {
    return sidePriceInfo?.quote_price !== undefined ? Number(sidePriceInfo.quote_price) : void 0;
  };

  const isPriceEmpty = () => {
    return (
      (getPrice() ?? 0) <= 0 ||
      (sidePriceInfo?.flag_rebate && (!sidePriceInfo.return_point || Number(sidePriceInfo.return_point) <= 0)) ||
      sidePriceInfo?.flag_intention
    );
  };

  const getCommonParams = async () => {
    const { direction, dealTime, volume } = formState;
    const { tradedDate, deliveryDate } = dealDateState;
    const { comment, bridge, payFor, internal } = formState;

    const liqSpeedList = [getLiqSpeed(tradeDateRange, dealDateState)];

    const returnPoint =
      sidePriceInfo?.flag_rebate && sidePriceInfo?.return_point && Number(sidePriceInfo.return_point)
        ? Number(sidePriceInfo.return_point)
        : NEW_SERVER_NIL;

    const params = {
      direction,
      deal_time: dealTime.valueOf().toString(),
      price_type: sidePriceInfo?.quote_type,
      price: getPrice(),
      return_point: returnPoint,
      flag_rebate: sidePriceInfo?.flag_rebate,
      volume: volume && Number(volume) ? Number(volume) : 0,
      traded_date: moment(tradedDate).valueOf().toString(),
      delivery_date: moment(deliveryDate).valueOf().toString(),
      comment,
      comment_flag_bridge: !!bridge,
      comment_flag_pay_for: !!payFor,
      flag_internal: !!internal,
      nothing_done: false,
      liquidation_speed_list: liqSpeedList,
      last_action_type: MarketDealLastActionType.Others,
      is_exercise: exerciseBoolean ?? undefined,
      exercise_manual: isSelected ?? undefined,

      bid_institution_id: trades[Side.SideBid].institution_id ?? '',
      bid_trader_id: trades[Side.SideBid].trader_id ?? '',
      bid_trader_tag: trades[Side.SideBid].trader_tag ?? '',
      bid_broker_id: trades[Side.SideBid].broker_id ?? '',
      ofr_institution_id: trades[Side.SideOfr].institution_id ?? '',
      ofr_trader_id: trades[Side.SideOfr].trader_id ?? '',
      ofr_trader_tag: trades[Side.SideOfr].trader_tag ?? '',
      ofr_broker_id: trades[Side.SideOfr].broker_id ?? ''
    };

    formatNumber2ServerNil(params);

    return params;
  };

  const update = async () => {
    logger.ctxInfo(ctx(), '[update] start update marketDeal');
    if (!trades[Side.SideBid].broker_id || !trades[Side.SideOfr].broker_id) {
      message.error('缺少经纪人【（B）/（O）】，不可提交！');
      return;
    }

    const isPriceDisable = productType === ProductType.NCD ? isPriceEmpty() : (getPrice() ?? 0) <= 0;

    if (!defaultValue?.deal_id || isPriceDisable) {
      if (isPriceDisable) {
        message.error('价格无效，不可提交');
      }
      logger.ctxInfo(ctx(), `[update] failed update marketDeal, deal_id=${defaultValue?.deal_id}, price=${getPrice()}`);
      return;
    }

    toggleSubmitting(true);

    try {
      const target: MarketDealUpdate = { ...(await getCommonParams()), deal_id: defaultValue.deal_id };

      await mulUpdateMarketDealWithUndo(
        { market_deal_update_list: [target], operation_info: { operation_type: operationType } },
        // @ts-ignore
        { origin: [defaultValue], productType }
      ).then(() => {
        confirm();
      });
    } finally {
      toggleSubmitting(false);
    }
  };

  const create = async () => {
    logger.ctxInfo(ctx(), `[create] start create marketDeal, quote_type=${sidePriceInfo?.quote_type}`);

    if (!trades[Side.SideBid].broker_id || !trades[Side.SideOfr].broker_id) {
      message.error('缺少经纪人【（B）/（O）】，不可提交！');
      return;
    }
    if (trades[Side.SideBid].trader_id && trades[Side.SideBid].trader_id === trades[Side.SideOfr].trader_id) {
      message.error('存在相同交易员，不可提交！');
      return;
    }
    const isPriceDisable = productType === ProductType.NCD ? isPriceEmpty() : (getPrice() ?? 0) <= 0;

    const keyMarket = bond?.key_market;
    if (!sidePriceInfo?.quote_type || isPriceDisable || !keyMarket) {
      if (isPriceDisable) {
        message.error('价格无效，不可提交');
      }
      logger.ctxInfo(ctx(), `[create]  failed create marketDeal, price=${getPrice()}, keyMarket=${keyMarket}`);
      return;
    }

    toggleSubmitting(true);

    /** 是否基于报价创建（当前选择的债券与默认带入的债券相同，并且有默认的报价 Id） */
    const isCreatedBasedOnQuote = keyMarket === defaultValue?.key_market && defaultQuote?.quote_id;
    // 如果是基于报价创建，则需要把报价 Id 带入
    const quoteId = isCreatedBasedOnQuote ? defaultQuote.quote_id : undefined;

    try {
      const commonParams = await getCommonParams();

      const target: MarketDealCreate = {
        // 如果有 copyCount 则代表为拷贝，需要把之前的信息带进来
        ...(copyCount ? omit(defaultValue, copyUnlessKeys) : undefined),
        ...commonParams,
        quote_id: quoteId,
        key_market: keyMarket,
        product_type: productType,
        source: OperationSource.OperationSourceBdsIdb,
        price_type: sidePriceInfo.quote_type,
        last_action_type: MarketDealLastActionType[copyCount ? 'Join' : 'Others'],
        join_count: copyCount || undefined,
        is_sync_receipt_deal: formState.isSyncReceiptDeal,
        bid_broker_percent: formState.isSyncReceiptDeal ? 100 : void 0,
        ofr_broker_percent: formState.isSyncReceiptDeal ? 100 : void 0
      };

      await mulCreateMarketDealWithUndo(
        {
          market_deal_create_list: new Array(copyCount ?? 1).fill(target),
          operation_info: { operation_type: operationType }
        },
        // @ts-ignore
        // 如果有 copyCount 则代表为拷贝，不需要回滚操作
        copyCount
          ? undefined
          : {
              origin: [{ ...defaultValue, quote_id: quoteId, refer_type: 0, comment: defaultQuote?.comment }],
              productType,
              tag: bond?.short_name
            }
      ).then(() => {
        confirm();
      });
    } finally {
      toggleSubmitting(false);
    }
  };

  const handleSubmitInner = async () => {
    logger.ctxInfo(
      ctx(),
      `[handleSubmitInner] start submit marketDeal, operationType=${operationType} key_market=${bond?.key_market} submitting=${formState.submitting}`
    );
    if (!bond) {
      message.error('产品录入有误');
      return;
    }

    if (formState.submitting) return;

    switch (operationType) {
      case OperationType.BondDealUpdate:
        // 如果为 Nothing Done 的成交记录，需要弹出确认弹窗再更新
        // 如果已经弹出弹窗了，则不需要再弹出弹窗
        if (defaultValue?.nothing_done) {
          await new Promise(resolve => {
            ModalUtils.warning({
              title: '编辑重置',
              content: '编辑会重置成交单状态，确定继续吗？',
              titleSize: 'sm',
              mask: true,
              maskClosable: false,
              onOk: async () => {
                logger.ctxInfo(ctx(), '[handleSubmitInner] confirm reset nothing_done marketDeal state');
                await withCtx(ctx(), update);
                resolve(void 0);
              },
              onCancel: () => {
                logger.ctxInfo(ctx(), '[handleSubmitInner] cancel reset nothing_done marketDeal state');
                resolve(void 0);
              }
            });
          });
        } else {
          await withCtx(ctx(), update);
        }
        break;
      case OperationType.BondDealTrdDeal:
        await withCtx(ctx(), create);
        break;
      default:
        break;
    }
  };

  const handleCancel = () => {
    cancel();
  };

  const handleSubmit = async () => {
    await wrapperSubmit(TraceName.MARKET_DEAL_SUBMIT, handleSubmitInner);
  };

  return { handleSubmit, handleCancel };
};
