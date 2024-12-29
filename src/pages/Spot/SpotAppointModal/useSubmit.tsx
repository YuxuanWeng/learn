import { SpotAppointModalFlow } from '@fepkg/business/constants/log-map';
import { TraceName } from '@fepkg/business/constants/trace-map';
import { message } from '@fepkg/components/Message';
import { ModalUtils } from '@fepkg/components/Modal';
import { BondDeal, DealQuote } from '@fepkg/services/types/common';
import type { DealRecordCheck } from '@fepkg/services/types/deal/record-check';
import type { DealRecordCreate } from '@fepkg/services/types/deal/record-create';
import { DealOperationType, OperationSource } from '@fepkg/services/types/enum';
import { pick, uniqWith } from 'lodash-es';
import { useLogger } from '@/common/providers/LoggerProvider';
import { idcDealCheckSpotPricing as checkPricing } from '@/common/services/api/deal/check-spot-pricing';
import { idcDealCreateSpotPricingRecord as createPricing } from '@/common/services/api/deal/create-spot-pricing-record';
import { getDefaultTagsByProduct } from '@/common/utils/liq-speed';
import { logger } from '@/common/utils/logger';
import { trackPoint } from '@/common/utils/logger/point';
import { getBondQuoteSyncLikePriceFromSpotPricing, isSameQuote } from '@/components/IDCSpot/utils';
import { useDialogLayout } from '@/layouts/Dialog/hooks';
import { useProductParams } from '@/layouts/Home/hooks';
import { miscStorage } from '@/localdb/miscStorage';
import DealCheckConfirm from '../SpotModal/DealCheckConfirm';
import { useSpotAppoint } from './provider';

const DEAL_CHECK_SECONDS = 4;

export default function useSubmit() {
  const {
    defaultValue,
    volume,
    dealQuote: optimal,
    quoteState,
    disabled,
    flagInternal,
    submitting,
    setSubmitting
  } = useSpotAppoint();

  const { productType } = useProductParams();
  const { confirm, cancel } = useDialogLayout();

  const { getLogContext, wrapperSubmit } = useLogger();
  const ctx = () => getLogContext(TraceName.SPOT_APPOINT_SUBMIT);
  const spotVol = Number(volume);

  const { dealType, quote } = defaultValue;

  const checkLatest = async (): Promise<Partial<DealQuote> | undefined> => {
    if (!defaultValue) return undefined;

    const params: DealRecordCheck.Request = {
      bond_key_market: defaultValue.bond.key_market,
      current_timestamp: Date.now().toString(),
      seconds: DEAL_CHECK_SECONDS
    };
    const res = await checkPricing(params, { traceCtx: ctx() });
    logger.ctxInfo(ctx(), `[checkLatest] check Pricing return value: ${JSON.stringify(res)}`);

    const newList: BondDeal[] = (res?.deal_list || []).filter(deal => {
      if (!deal.deal_type) return true;
      const q = getBondQuoteSyncLikePriceFromSpotPricing(deal.deal_type, deal);
      return !isSameQuote(q as DealQuote, optimal);
    });
    if (!newList.length) return void 0;
    return getBondQuoteSyncLikePriceFromSpotPricing(dealType, newList[0]);
  };

  const doSubmit = async () => {
    if (!quote?.quote_id) return;

    logger.ctxInfo(ctx(), '[doSubmit] really do submit');
    trackPoint(SpotAppointModalFlow.FlowSubmit);

    const price_type = optimal?.quote_type ?? quote.quote_type;
    const return_point = optimal?.return_point ?? quote.return_point;
    const side = optimal?.side ?? quote.side;
    const price = optimal?.quote_price ?? quote.quote_price;

    if (!side || !price || !price_type) return;

    const uniqSettlements = uniqWith(
      optimal?.deal_liquidation_speed_list ?? quote?.deal_liquidation_speed_list,
      (a, b) => {
        return a.tag === b.tag && a.offset === b.offset && a.date === b.date;
      }
    );

    const submitParams: DealRecordCreate.Request = {
      quote_id: defaultValue.quote?.quote_id,
      deal_type: dealType,
      bond_key_market: defaultValue?.bond.key_market,
      broker_id: miscStorage.userInfo?.user_id || optimal?.broker_info?.broker_id || '',
      price_type,
      return_point,
      side,
      liquidation_speed_list: getDefaultTagsByProduct(uniqSettlements, productType).liqSpeeds,
      volume: Math.min(spotVol, 999) * 1000,
      // 上传时不分情况，无脑取quote_price中的值，by服务端
      price,
      clean_price: optimal?.clean_price ?? 0,
      operation_info: {
        operator: miscStorage.userInfo?.user_id ?? '',
        operation_type: DealOperationType.DOTNewDeal,
        operation_source: OperationSource.OperationSourceSpotPricing
      },
      flag_internal_deal: flagInternal
    };

    try {
      const res = await createPricing(submitParams, { traceCtx: ctx() });

      logger.ctxInfo(ctx(), `[doSubmit] after create ${JSON.stringify(res)}`);
      trackPoint(SpotAppointModalFlow.FlowSuccess);

      confirm();
    } catch (ex: unknown) {
      logger.ctxInfo(ctx(), `[doSubmit] upload error ${ex}`);
    } finally {
      setSubmitting(false);
    }
  };

  const showConfirmDialog = async (): Promise<boolean> => {
    return new Promise(resolve => {
      logger.ctxInfo(ctx(), '[showConfirmDialog] double check show');
      ModalUtils.confirm({
        content: <DealCheckConfirm deal={{ ...optimal, quote_price: optimal?.quote_price ?? quoteState.quotePrice }} />,
        buttonsCentered: true,
        onOk: async () => {
          logger.ctxInfo(ctx(), '[showConfirmDialog] double check confirm');
          await doSubmit();
          resolve(true);
        },
        onCancel: () => {
          logger.ctxInfo(ctx(), '[showConfirmDialog] double check cancel');
          setSubmitting(false);
          cancel?.();
          resolve(true);
        },
        showIcon: false,
        autoFocusButton: null,
        keyboard: false,
        mask: true,
        maskClosable: false,
        wrapClassName: 'idc-spot-check-confirm',
        width: 290,
        zIndex: 2000,
        okButtonProps: {
          tabIndex: -1,
          onKeyDown(evt) {
            if (evt.key === 'Enter' || evt.key === ' ') {
              evt.preventDefault();
            }
          }
        },
        bodyStyle: {
          textAlign: 'center',
          borderRadius: 2
        }
      });
    });
  };

  const onSubmit = async () => {
    logger.ctxInfo(ctx(), '[onSubmit] start spot');
    if (submitting) {
      logger.ctxInfo(ctx(), '[onSubmit] return by submitting');
      return;
    }
    if (disabled) {
      logger.ctxInfo(ctx(), '[onSubmit] return by disabled');
      return;
    }
    setSubmitting(true);

    if (!spotVol || spotVol < 1) {
      message.error('点价量为空，请重新输入');
      logger.ctxInfo(ctx(), '[onSubmit] return by spot value empty');
      setSubmitting(false);
      return;
    }

    try {
      const newDeal = await checkLatest();
      if (!newDeal) {
        await doSubmit();
        setSubmitting(false);
        return;
      }
      logger.ctxInfo(ctx(), `[onSubmit] has latest deal: ${JSON.stringify(newDeal)}`);
    } catch {
      setSubmitting(false);
      logger.ctxInfo(ctx(), '[onSubmit] submit error');
      message.error('点价失败');
      return;
    }

    await showConfirmDialog();
  };

  const handleSubmit = async () => {
    await wrapperSubmit(TraceName.SPOT_APPOINT_SUBMIT, onSubmit);
  };

  const onCancel = () => {
    setSubmitting(false);
    cancel?.();
  };

  return { handleSubmit, onCancel, submitting };
}
