import { TraceName } from '@fepkg/business/constants/trace-map';
import { message } from '@fepkg/components/Message';
import { StatusCode } from '@fepkg/request/types';
import { handleRequestError } from '@fepkg/request/utils';
import { OperationSource } from '@fepkg/services/types/bds-enum';
import type { DealParsing } from '@fepkg/services/types/parsing/deal-info';
import type { ReceiptDealMulAdd } from '@fepkg/services/types/receipt-deal/mul-add';
import axios from 'axios';
import { useLogger } from '@/common/providers/LoggerProvider';
import { mulAddReceiptDeal } from '@/common/services/api/receipt-deal/mul-add';
import { logger } from '@/common/utils/logger';
import { useProductParams } from '@/layouts/Home/hooks';
import { useReceiptDealBatchForm } from '../providers/FormProvider';
import { useTextAreaHighlight } from '../providers/TextAreaHighlightProvider';
import { formatReceiptDealFromParsing, getFirstErrorItem } from '../utils';

export const useSubmit = () => {
  const { getLogContext, wrapperSubmit } = useLogger();
  const {
    sendMarket,
    parsingResult,
    checkData,
    formDisabled,
    setText,
    setErrorInfo,
    scrollToItem,
    setSubmitLoading,
    setSendMarket
  } = useReceiptDealBatchForm();
  const { focus } = useTextAreaHighlight();

  const { productType } = useProductParams();

  const ctx = () => {
    return getLogContext(TraceName.RECEIPT_DEAL_BATCH_FORM_SUBMIT);
  };

  const mulAdd = (createReceiptDealList: ReceiptDealMulAdd.CreateReceiptDeal[]) => {
    setSubmitLoading(true);
    return mulAddReceiptDeal(
      {
        create_receipt_deal_list: createReceiptDealList,
        operation_source: OperationSource.OperationSourceReceiptDeal,
        productType
      },
      { traceCtx: ctx(), hideErrorMessage: true }
    )
      .then(() => {
        logger.ctxInfo(ctx(), '[update] success update receipt deal');
        setText('');
        setSendMarket(false);
      })
      .catch(error => {
        handleRequestError({
          error,
          onMessage: (_, code) => {
            if (code !== StatusCode.InternalError) {
              message.error('请修改要素后重新提交');
            } else {
              message.error('录入失败');
            }
          },
          defaultHandler: () => {
            message.error('录入失败');
          }
        });

        if (!axios.isAxiosError(error) && typeof error.data === 'object') {
          setErrorInfo(error.data);
          const firstErrorItem = getFirstErrorItem(createReceiptDealList, error.data);
          scrollToItem(firstErrorItem);
        }

        logger.ctxInfo(ctx(), '[update] failed batch add receipt deal');
      })
      .finally(() => {
        setSubmitLoading(false);
        focus();
      });
  };

  const handleSubmitInner = async (parsingData?: DealParsing[]) => {
    parsingData = parsingData ?? parsingResult;
    if (!parsingData || formDisabled) return void 0;

    if (!checkData()) {
      return void 0;
    }
    // 清除上次后端校验出来的错误
    setErrorInfo({});

    const createReceiptDealList = await formatReceiptDealFromParsing(parsingData, productType, sendMarket);

    return mulAdd(createReceiptDealList);
  };

  const handleSubmit = (parsingData?: DealParsing[]) => {
    return wrapperSubmit(TraceName.RECEIPT_DEAL_BATCH_FORM_SUBMIT, () => handleSubmitInner(parsingData));
  };

  return { handleSubmit };
};
