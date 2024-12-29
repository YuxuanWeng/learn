import { message } from '@fepkg/components/Message';
import type { GetConfig } from '@fepkg/services/types/algo/get-config';
import type { GetRecommendBond } from '@fepkg/services/types/algo/get-recommend-bond';
import { uploadBcoSendRecommendBondResult } from '@/common/services/api/algo/bond-recommend-api/send-recommend-bond';
import { sendIMMsg } from '@/common/utils/im-helper';
import { BCOBondRecommendStepTableIDSelection } from '@/components/BondRecommend/BCO/table';
import { SendMsgDetail } from '@/components/IMHelper/type';
import { TraderBondSendInfo } from './types';

export const getSendMsgParam = (
  list: GetRecommendBond.TraderRecommendBond[],
  checkedIDs: BCOBondRecommendStepTableIDSelection[]
) => {
  const result: TraderBondSendInfo[] = [];

  if (checkedIDs.length === 0) {
    return list.map(t => ({
      trader_id: t.trader_id,
      trader_name: t.trader_name,
      inst_name: t.inst_name,
      trader_qq: t.trader_qq,
      message_schema: t.message_schema,
      recommend_bond_list: t.list?.map(i => ({ id: i.recommend_bond_id, copyInfo: i.quote_copy })) ?? []
    })) as TraderBondSendInfo[];
  }

  const bonds = list.reduce((prev, next) => {
    return [...prev, ...(next.list ?? [])];
  }, [] as GetRecommendBond.RecommendedBond[]);

  checkedIDs.forEach(({ itemID, parentID }) => {
    const targetTrader = list.find(i => i.trader_id === parentID);
    const resultTargetTrader = result.find(i => i.trader_id === parentID);

    if (targetTrader == null) return;

    if (resultTargetTrader == null) {
      result.push({
        trader_id: parentID,
        trader_qq: targetTrader.trader_qq,
        trader_name: targetTrader.trader_name,
        inst_name: targetTrader.inst_name,
        message_schema: targetTrader.message_schema,
        recommend_bond_list: [{ id: itemID, copyInfo: bonds.find(b => b.recommend_bond_id === itemID)?.quote_copy }]
      });
    } else {
      resultTargetTrader.recommend_bond_list?.push({
        id: itemID,
        copyInfo: bonds.find(b => b.recommend_bond_id === itemID)?.quote_copy
      });
    }
  });

  return result;
};

export const parseListWithSchemaMap = (list: TraderBondSendInfo[], schemaInputMap: Record<string, string>) => {
  return list.map(i => ({
    ...i,
    message_schema: schemaInputMap[i.trader_id] ?? i.message_schema
  }));
};

export const showSendResponse = (msg?: string) => {
  if (msg == null) return;

  // TODO: 不应用msg来判断
  const hasSuccess = msg?.includes('成功');
  const hasFail = msg?.includes('失败');

  if (hasSuccess && hasFail) {
    message.warn(msg);
  }

  if (hasSuccess && !hasFail) {
    message.success(msg);
  }

  if (!hasSuccess && hasFail) {
    message.error(msg);
  }
};

export const bcoSendRecommendBond = async (list: TraderBondSendInfo[], traderConfig: GetConfig.TraderBondConfig[]) => {
  if (list.length === 0) return;

  const messages: SendMsgDetail[] = [];
  list.forEach(trader => {
    let msg = '';

    trader.recommend_bond_list.forEach((bond, index) => {
      msg += `${bond.copyInfo}    `;

      if (index % 4 === 3 || index === trader.recommend_bond_list.length - 1) {
        messages.push({
          recv_qq: trader.trader_qq,
          msg: `${msg}${trader.message_schema}`,
          receiver_id: trader.trader_id,
          receiver_name: trader.trader_name,
          inst_name: trader.inst_name
        });

        msg = '';
      }
    });
  });

  const { result, msgForSend } = await sendIMMsg({
    messages,
    extraPresendFilter: m => {
      if (traderConfig.find(t => t.trader_id === m?.receiver_id)?.im_enabled) return undefined;

      return '未开启提醒渠道，消息发送失败！';
    },
    autoAlert: true
  });

  const successedMessages = msgForSend.filter((_, i) => (result ?? [])[i]?.success);

  if (successedMessages.length !== 0) {
    await uploadBcoSendRecommendBondResult({
      recommend_bond_id_list: list
        .filter(t => successedMessages.some(m => m.receiver_id === t.trader_id))
        .reduce((prev, next) => {
          return [...prev, ...(next.recommend_bond_list ?? []).map(b => b.id)];
        }, [] as string[])
    });
  }
};
