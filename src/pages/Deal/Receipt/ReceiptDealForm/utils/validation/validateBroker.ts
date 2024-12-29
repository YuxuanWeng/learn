import { ReceiptDealTrade, ReceiptDealTradeOp } from '@fepkg/services/types/bds-common';
import { Side } from '@fepkg/services/types/bds-enum';
import { getBroker } from '..';
import { ReceiptDealFormErrorStateType } from '../../types';

/**
 * @description 成交单Broker校验，按顺序输入broker，至少有一个broker，否则返回false
 * 有佣金则需要broker
 */
export function validateBroker(
  trade_info: ReceiptDealTradeOp | ReceiptDealTrade | undefined,
  side?: Side.SideBid | Side.SideOfr,
  errorState?: ReceiptDealFormErrorStateType
) {
  const [broker_id, broker_id_b, broker_id_c, broker_id_d] = getBroker(trade_info);

  const { broker_percent_b, broker_percent_c, broker_percent_d } = trade_info ?? {};

  if (!broker_id || (broker_id_b && !broker_id)) {
    if (errorState && side) errorState.traderErrorState = { [side]: { broker: true } };

    return false;
  }
  if ((broker_id_c && !broker_id_b) || (broker_percent_b && !broker_id_b)) {
    if (errorState && side) errorState.traderErrorState = { [side]: { broker_b: true } };
    return false;
  }
  if ((broker_id_d && !broker_id_c) || (broker_percent_c && !broker_id_c)) {
    if (errorState && side) errorState.traderErrorState = { [side]: { broker_c: true } };
    return false;
  }
  if (broker_percent_d && !broker_id_d) {
    if (errorState && side) errorState.traderErrorState = { [side]: { broker_d: true } };
    return false;
  }
  return true;
}
