import { TraceName } from '@fepkg/business/constants/trace-map';
import { message } from '@fepkg/components/Message';
import { OperationSource } from '@fepkg/services/types/bds-enum';
import { ReceiptDealMulAdd } from '@fepkg/services/types/receipt-deal/mul-add';
import { ReceiptDealUpdate } from '@fepkg/services/types/receipt-deal/update';
import { useEnterDown } from '@/common/hooks/useEnterDown';
import { useLogger } from '@/common/providers/LoggerProvider';
import { RequestWithModalOptions } from '@/common/request/with-modal-factory';
import { addReceiptDeal } from '@/common/services/api/receipt-deal/add';
import { updateWithModal } from '@/common/services/api/receipt-deal/update';
import { logger } from '@/common/utils/logger';
import { trackPoint } from '@/common/utils/logger/point';
import { useDialogLayout } from '@/layouts/Dialog/hooks';
import { useProductParams } from '@/layouts/Home/hooks';
import { checkIllegalList } from '@/pages/Spot/utils/bridge';
import { LogReceiptDealFlowPhase } from '../constants';
import { useReceiptDealForm } from '../providers/FormProvider';
import { getUpdateDiffData } from '../utils';
import { handleDealChanged } from '../utils/handleDealChanged';
import { commonValidationDeal, validationUpdateDeal } from '../utils/validation';
import { useFormErrorCheck } from './useFormErrorCheck';
import { useSubmitData } from './useSubmitData';

const operationSource = OperationSource.OperationSourceReceiptDeal;

export const useSubmit = () => {
  const { confirm } = useDialogLayout();
  const { productType } = useProductParams();

  const { getLogContext, wrapperSubmit } = useLogger();
  const ctx = () => getLogContext(TraceName.RECEIPT_DEAL_FORM_SUBMIT);

  const { initialRowData, isUpdate, getReceiptDealUpdatedData } = useSubmitData();

  const { formDisabled, setFormLoading } = useReceiptDealForm();
  const { getDefaultErrorState, setFormError, handleReceiptRequestError } = useFormErrorCheck();

  const update = (receiptDealInfo: ReceiptDealUpdate.UpdateReceiptDeal, options?: RequestWithModalOptions) => {
    if (!options?.withModal) {
      setFormLoading(true);
    }
    return updateWithModal(
      {
        receiptDealInfo,
        operationSource,
        productType
      },
      {
        config: { traceCtx: ctx(), hideErrorMessage: true },
        ...options,
        onSuccess: async result => {
          await checkIllegalList(result?.receipt_deal_operate_illegal_list ?? []);

          trackPoint(LogReceiptDealFlowPhase.Success);
          logger.ctxInfo(ctx(), '[update] success update receipt deal');
          return confirm();
        },
        onError: error => {
          logger.ctxInfo(ctx(), '[update] failed update receipt deal');
          return handleReceiptRequestError(receiptDealInfo, error, confirm);
        }
      }
    ).finally(() => {
      if (!options?.withModal) {
        setFormLoading(false);
      }
    });
  };

  const add = (receiptDealInfo: ReceiptDealMulAdd.CreateReceiptDeal) => {
    setFormLoading(true);
    return addReceiptDeal(
      {
        receiptDealInfo,
        operationSource,
        productType
      },
      { traceCtx: ctx(), hideErrorMessage: true }
    )
      .then(() => {
        trackPoint(LogReceiptDealFlowPhase.Success);
        logger.ctxInfo(ctx(), '[add] success add receipt deal');
        return confirm();
      })
      .catch(error => {
        logger.ctxInfo(ctx(), `[add] failed add receipt deal, error = ${error}`);
        return handleReceiptRequestError(receiptDealInfo, error);
      })
      .finally(() => {
        setFormLoading(false);
      });
  };

  const handleSubmitInner = async () => {
    if (formDisabled) {
      return;
    }

    trackPoint(LogReceiptDealFlowPhase.Submit);

    const { receipt_deal_id: receiptDealId, receipt_deal_status: receiptDealStatus } = initialRowData ?? {};
    const { formattedRawData, receiptDealInfo } = getReceiptDealUpdatedData();

    const errorState = getDefaultErrorState();

    logger.ctxInfo(ctx(), `[handleSubmitInner] start. receipt_deal_info = ${JSON.stringify(receiptDealInfo)}`);

    if (!receiptDealInfo) {
      message.error('产品录入有误！');
      errorState.formErrorState.bond = true;
      setFormError(errorState);

      logger.ctxInfo(ctx(), '[handleSubmitInner] receipt_deal_info is undefined');
      return;
    }

    if (
      !commonValidationDeal({
        receiptDealInfo,
        errorState
      })
    ) {
      setFormError(errorState);

      logger.ctxInfo(ctx(), '[validationDeal] validationDeal is error');
      return;
    }

    if (!isUpdate) {
      await add(receiptDealInfo);
      return;
    }

    // 仅限编辑面板中的字段，不包含update接口的全部字段
    if (!receiptDealId || !receiptDealStatus) {
      message.error('产品信息有误！');
      logger.ctxInfo(ctx(), '[checkParams] start with update params id or receipt_deal_status is error');
      return;
    }
    if (!validationUpdateDeal({ receiptDealInfo, formattedRawData, errorState })) {
      setFormError(errorState);
      return;
    }

    const options = await handleDealChanged({ receiptDealInfo, formattedRawData, initialRowData });

    const diff = getUpdateDiffData(receiptDealInfo, formattedRawData);
    const updateReceiptDealInfo = {
      ...diff,
      receipt_deal_id: receiptDealId,
      // 错期不参与 diff
      diff_settlement_type: receiptDealInfo?.diff_settlement_type
    };

    await update(updateReceiptDealInfo, options);
  };

  const handleSubmit = () => {
    return wrapperSubmit(TraceName.RECEIPT_DEAL_FORM_SUBMIT, handleSubmitInner);
  };

  useEnterDown(handleSubmit);

  return { handleSubmit };
};
