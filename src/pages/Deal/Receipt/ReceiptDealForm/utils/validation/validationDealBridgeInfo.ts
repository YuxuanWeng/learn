import { message } from '@fepkg/components/Message';
import { IUpsertReceiptDeal, ReceiptDealFormErrorStateType } from '../../types';

/**
 * @description 成交单桥信息校验
 */
export const validationDealBridgeInfo = (
  receipt_deal_info: IUpsertReceiptDeal,
  errorState: ReceiptDealFormErrorStateType
) => {
  const { bridge_info } = receipt_deal_info ?? {};
  if (bridge_info) {
    // 目前只支持三桥
    if (bridge_info.length > 3) {
      message.error('桥数量有误，不可提交！');
      return false;
    }
    const checkBridgeInfo = bridge_info.some((item, index) => {
      if (!item.inst_id) {
        message.error('桥机构无效！请重新输入！');
        errorState.bridgeErrorState = { bridgeIndex: index, instError: true };
        return true;
      }
      if (!item.trader_id) {
        message.error('桥交易员无效！请重新输入！');
        errorState.bridgeErrorState = { bridgeIndex: index, traderError: true };
        return true;
      }

      if (!item.broker_id) {
        message.error('桥经纪人无效！请重新输入！');
        errorState.bridgeErrorState = { bridgeIndex: index, brokerError: true };
        return true;
      }
      return false;
    });
    if (checkBridgeInfo) {
      return false;
    }
  }

  return true;
};
