import { useMemo, useRef, useState } from 'react';
import { message } from '@fepkg/components/Message';
import { createContainer } from 'unstated-next';
import { miscStorage } from '@/localdb/miscStorage';
import { useParsingDealInfo } from '../hooks/useParsingDealInfo';
import { ReceiptDealMulAddErrorInfo } from '../utils';

const NULL_ERROR = '不可为空';
const INVALID_ERROR = '要素有误';
const SETTLEMENT_AMOUNT_ERROR = '结算金额计算失败';

const ReceiptDealBatchFormContainer = createContainer(() => {
  const listRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollToItem = index => {
    listRefs.current[index]?.scrollIntoView();
  };

  const [text, setText] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errorInfo, setErrorInfo] = useState<ReceiptDealMulAddErrorInfo>({});

  const [sendMarket, setSendMarket] = useState(false);

  const { data: parsingResult, isFetching } = useParsingDealInfo(text);

  const warningStatus = useMemo(() => {
    const ofr_broker = miscStorage.userInfo?.user_id;

    return parsingResult?.map(i => {
      const nullList: string[] = [];
      const invalidList: string[] = [];
      const settlementAmountError = i.line_id !== undefined && errorInfo.illegal_line_id_list?.includes(i.line_id);

      const nullChecks = [
        [i.bond_basic, '债券'],
        [i.price, '成交价'],
        [i.volume, '券面总额'],
        [i.bid_broker?.broker_id, '对手方经纪人']
      ] as const;

      for (const [value, label] of nullChecks) {
        if (!value) nullList.push(label);
      }

      if (
        i.bid_broker?.broker_id &&
        ofr_broker &&
        errorInfo.illegal_broker_list?.includes(i.bid_broker?.broker_id) &&
        errorInfo.illegal_broker_list?.includes(ofr_broker)
      ) {
        invalidList.push('双方经纪人');
      } else if (i.bid_broker?.broker_id && errorInfo.illegal_broker_list?.includes(i.bid_broker?.broker_id)) {
        invalidList.push('对手方经纪人');
      } else if (ofr_broker && errorInfo.illegal_broker_list?.includes(ofr_broker)) {
        invalidList.push('本方经纪人');
      }

      /** 有交易员 */
      const checkInstTrader = (trader_id?: string, inst_id?: string) => {
        return Boolean(
          (trader_id && errorInfo.illegal_trader_list?.includes(trader_id)) ||
            (inst_id && errorInfo.illegal_inst_list?.includes(inst_id))
        );
      };

      if (
        checkInstTrader(i.bid_trader?.trader_id, i.bid_inst?.inst_id) &&
        checkInstTrader(i.ofr_trader?.trader_id, i.ofr_inst?.inst_id)
      ) {
        invalidList.push('双方-机构(交易员)');
      } else if (checkInstTrader(i.bid_trader?.trader_id, i.bid_inst?.inst_id)) {
        invalidList.push('对手方-机构(交易员)');
      } else if (checkInstTrader(i.ofr_trader?.trader_id, i.ofr_inst?.inst_id)) {
        invalidList.push('本方-机构(交易员)');
      } else if (i.bid_trader?.trader_id && i.bid_trader?.trader_id === i.ofr_trader?.trader_id) {
        invalidList.push('双方-机构(交易员)');
      }

      const warningTextArr: string[] = [];

      if (nullList.length) {
        warningTextArr.push(`${nullList.join('、')}${NULL_ERROR}`);
      }

      if (invalidList.length) {
        warningTextArr.push(`${invalidList.join('、')}${INVALID_ERROR}`);
      }

      if (settlementAmountError) {
        warningTextArr.push(SETTLEMENT_AMOUNT_ERROR);
      }

      return { nullList, invalidList, settlementAmountError, warningText: warningTextArr.join('，') };
    });
  }, [parsingResult, errorInfo]);

  // 无输入与无识别结果（有防抖清空时不准）时，录入按钮禁用
  const formDisabled = submitLoading || !parsingResult?.length || !text;

  /** 校验数据是否可以录入，不能则false */
  const checkData = () => {
    // 识别中与无数据时，不能录入
    if (isFetching || !warningStatus) {
      return false;
    }

    return warningStatus.every(({ nullList }) => {
      if (nullList?.length) {
        message.error('请补充要素后重新提交');
        return false;
      }
      return true;
    });
  };

  return {
    text,
    setText,
    sendMarket,
    setSendMarket,

    listRefs,
    scrollToItem,

    setErrorInfo,

    warningStatus,
    checkData,

    formDisabled,

    submitLoading,
    setSubmitLoading,

    parsingResult
  };
});

export const ReceiptDealBatchFormProvider = ReceiptDealBatchFormContainer.Provider;
export const useReceiptDealBatchForm = ReceiptDealBatchFormContainer.useContainer;
