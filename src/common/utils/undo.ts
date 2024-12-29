import { MarketDealUpdate, QuoteUpdate, TraderLite } from '@fepkg/services/types/common';
import { Enable, ProductType, RefType, OperationType as ServiceOperationType } from '@fepkg/services/types/enum';
import { BroadcastChannelEnum } from 'app/types/broad-cast';
import localforage from 'localforage';
import { last, pick } from 'lodash-es';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { getFlowLogger } from '@/common/utils/logger/flow';
import { miscStorage } from '@/localdb/miscStorage';
import { LogFlowPhase } from '@/types/log';
import { mulUpdateBondQuote } from '../services/api/bond-quote/mul-update';
import { mulUpdateMarketDeal } from '../services/api/market-deal/mul-update';
import { OperationType, UndoOperationItem, UndoQuoteUpdate } from '../undo-services/types';

export const UNDO = 'undo';
export const MAX_SNAPSHOT_RECORDS = 10;

const SERVER_SUCCESS_CODE_FOR_UNDO = new Set([
  /** 未找到报价 */
  21010
]);

export const getUndoSnapshot = async <T>(key: string, callback?: () => void) => {
  const snapshots = ((await localforage.getItem(key, callback)) || []) as T;
  return snapshots;
};

export const setUndoSnapshot = async <T>(key: string, value: T, callback?: () => void) => {
  const { emit } = window.Broadcast;
  const response = await localforage.setItem(key, value, callback);
  emit(BroadcastChannelEnum.LOCAL_FORGE_UPDATE, value, key);
  return response;
};

/**
 * 更新undo快照
 * @param origin 原始数据
 * @param type 操作类型
 * @param productType 台子类型
 * @param tag 标签
 */
export const updateQuoteUndoSnapshot = async (
  origin: (QuoteUpdate & { trader_info?: TraderLite })[],
  type: OperationType,
  productType: ProductType,
  tag?: string
) => {
  let operationType: ServiceOperationType | undefined;
  const { emit } = window.Broadcast;
  const userId = miscStorage.userInfo?.user_id;
  if (!userId) return;
  switch (type) {
    case OperationType.Add:
      operationType = ServiceOperationType.BondQuoteUndoDelete;
      break;

    case OperationType.Edit:
      operationType = ServiceOperationType.BondQuoteUndoUpdate;
      break;

    case OperationType.Refer:
      operationType = ServiceOperationType.BondQuoteUndoUnRefer;
      break;

    case OperationType.Unref:
      operationType = ServiceOperationType.BondQuoteUndoRefer;
      break;

    default:
      operationType = undefined;
  }

  if (!operationType) return;

  const data: QuoteUpdate[] = origin.map(v => ({
    quote_id: v.quote_id,
    broker_id: v.broker_id,
    trader_id: v.trader_id,
    algo_tags: v.algo_tags,
    side: v.side,
    yield: v.yield,
    clean_price: v.clean_price,
    full_price: v.full_price,
    quote_price: v.quote_price,
    volume: v.volume,
    traded_date: v.traded_date,
    settlement_date: v.settlement_date,
    delivery_date: v.delivery_date,
    comment: v.comment,
    return_point: v.return_point,
    spread: v.spread,
    liquidation_speed_list: v.liquidation_speed_list,
    clear_speed: v.clear_speed,
    flag_internal: v.flag_internal,
    flag_urgent: v.flag_urgent,
    flag_exchange: v.flag_exchange,
    flag_star: v.flag_star,
    flag_oco: v.flag_oco,
    flag_package: v.flag_package,
    flag_recommend: v.flag_recommend,
    is_exercise: v.is_exercise,
    flag_rebate: v.flag_rebate,
    quote_type: v.quote_type,
    almost_done: v.almost_done,
    flag_intention: v.flag_intention,
    refer_type: v.refer_type,
    enable: v.enable,
    trader_tag: v.trader_info?.trader_tag,
    operation_type: v.operation_type ?? operationType,
    flag_stock_exchange: v.flag_stock_exchange,
    flag_bilateral: v.flag_bilateral,
    flag_request: v.flag_request,
    flag_indivisible: v.flag_indivisible,
    exercise_manual: v.exercise_manual
  }));

  const snapshots = await getUndoSnapshot<UndoOperationItem[]>(UNDO);
  const today = moment().startOf('day').valueOf();

  const undoList = snapshots.filter(v => v.userId === userId && v.productType === productType && v.timestamp >= today);
  const others = snapshots.filter(v => v.userId !== userId || v.productType !== productType);

  while (undoList.length >= MAX_SNAPSHOT_RECORDS) undoList.shift();

  const idx = (last(undoList)?.idx || 0) + 1;
  undoList.push({
    idx,
    uuid: uuidv4(),
    type,
    data,
    tag,
    userId,
    timestamp: Date.now(),
    productType,
    dataType: 'quote'
  });
  emit(BroadcastChannelEnum.LOCAL_FORGE_UPDATE, others.concat(undoList), UNDO);
};

/**
 * 创建成交记录undoMarket快照
 * @param origin 原始数据
 * @param type 操作类型
 * @param productType 台子类型
 * @param tag 标签
 */
export const createMarketUndoSnapshot = async (
  origin: UndoQuoteUpdate[],
  type: OperationType,
  productType: ProductType,
  tag?: string
) => {
  let operationType: ServiceOperationType | undefined;
  const { emit } = window.Broadcast;
  const userId = miscStorage.userInfo?.user_id;
  if (!userId) return;
  switch (type) {
    case OperationType.Deal:
      operationType = ServiceOperationType.BondDealUndoDelete;
      break;
    default:
      operationType = undefined;
  }

  if (!operationType) return;

  const data = origin.map(v => ({
    ...v,
    operation_type: operationType
  }));

  const snapshots = await getUndoSnapshot<UndoOperationItem[]>(UNDO);
  const today = moment().startOf('day').valueOf();

  const undoList = snapshots.filter(v => v.userId === userId && v.productType === productType && v.timestamp >= today);
  const others = snapshots.filter(v => v.userId !== userId || v.productType !== productType);

  while (undoList.length >= MAX_SNAPSHOT_RECORDS) undoList.shift();

  const idx = (last(undoList)?.idx || 0) + 1;
  undoList.push({
    idx,
    uuid: uuidv4(),
    type,
    data,
    tag,
    userId,
    timestamp: Date.now(),
    productType,
    dataType: 'quote'
  });

  emit(BroadcastChannelEnum.LOCAL_FORGE_UPDATE, [...others, ...undoList], UNDO);
};

/**
 * 更新undoMarket快照(不包含创建成交)
 * @param origin 原始数据
 * @param type 操作类型
 * @param productType 台子类型
 * @param tag 标签
 */
export const updateMarketUndoSnapshot = async (
  origin: MarketDealUpdate[],
  type: OperationType,
  productType: ProductType,
  tag?: string
) => {
  let operationType: ServiceOperationType | undefined;
  const { emit } = window.Broadcast;
  const userId = miscStorage.userInfo?.user_id;
  if (!userId) return;
  switch (type) {
    case OperationType.Update:
      operationType = ServiceOperationType.BondDealUndoUpdateInfo;
      break;
    case OperationType.Edit:
      operationType = ServiceOperationType.BondDealUndoUpdate;
      break;
    default:
      operationType = undefined;
  }

  if (!operationType) return;

  const data = origin.map(v => ({
    ...v,
    operation_type: operationType
  }));

  const snapshots = await getUndoSnapshot<UndoOperationItem[]>(UNDO);
  const today = moment().startOf('day').valueOf();

  const undoList = snapshots.filter(v => v.userId === userId && v.productType === productType && v.timestamp >= today);
  const others = snapshots.filter(v => v.userId !== userId || v.productType !== productType);

  while (undoList.length >= MAX_SNAPSHOT_RECORDS) undoList.shift();

  const idx = (last(undoList)?.idx || 0) + 1;
  undoList.push({
    idx,
    uuid: uuidv4(),
    type,
    data,
    tag,
    userId,
    timestamp: Date.now(),
    productType,
    dataType: 'deal'
  });

  emit(BroadcastChannelEnum.LOCAL_FORGE_UPDATE, [...others, ...undoList], UNDO);
};

/**
 * 根据最大id，删除'undo'快照
 * @param maxIdx 需要删除的最大id
 * @param cb 删除成功后的回调函数
 * @param productType 台子类型
 * @returns
 */
const removeUndoSnapshot = async (maxIdx: number, productType: ProductType, cb?: () => void) => {
  const userId = miscStorage.userInfo?.user_id;
  const snapshots = await getUndoSnapshot<UndoOperationItem[]>(UNDO);
  if (!maxIdx || !snapshots?.length) return;
  const undoIds = new Set(
    snapshots.filter(v => v.idx >= maxIdx && v.userId === userId && v.productType === productType).map(v => v.uuid)
  );

  const undoList = snapshots.filter(v => !undoIds.has(v.uuid));
  await setUndoSnapshot(UNDO, undoList, cb);
};

/**
 * 恢复某些版本的快照
 * @param maxIdx 需要恢复的快照的最大id
 * @param productType 台子类型
 * @returns recovered quote id list
 */
export const recoverUndoSnapshot = async (maxIdx: number, productType: ProductType): Promise<string[]> => {
  const userId = miscStorage.userInfo?.user_id;
  const snapshots = await getUndoSnapshot<UndoOperationItem[]>(UNDO);
  if (!snapshots?.length) return [];
  const recovers = snapshots
    .filter(v => v.idx >= maxIdx && v.userId === userId && v.productType === productType)
    .sort((a, b) => b.idx - a.idx);

  const quoteIdMap: { [key: string]: QuoteUpdate } = {};
  const dealIdMap: { [key: string]: MarketDealUpdate } = {};

  for (const origin of recovers) {
    // 标价相关变更
    if (origin.dataType === 'quote') {
      for (const v of origin.data) {
        // gvn/tkn的报价，相应市场成交需删除
        if (origin.type === OperationType.Deal && v.deal_id) {
          dealIdMap[v.deal_id] = {
            deal_id: v.deal_id,
            enable: Enable.DataDisable,
            operation_type: v.operation_type
          };
        }
        if (!(origin.type === OperationType.Unref && v.refer_type === 0)) {
          // 当undo造成refer报价时，统一处理为手动撤销。 当v.refer_type为0或者undefined时，认为不是refer操作
          // 当operation_type为Undo删除成交时，对应当的报价操作类型应为unRefer
          if (v.quote_id) {
            quoteIdMap[v.quote_id] = {
              ...v,
              refer_type: v.refer_type ? RefType.Manual : v.refer_type,
              operation_type:
                v.operation_type === ServiceOperationType.BondDealUndoDelete
                  ? ServiceOperationType.BondQuoteUndoUnRefer
                  : v.operation_type
            };
          }
        }
      }
    } else {
      // 市场成交修改
      for (const v of origin.data) {
        if (v.deal_id) {
          dealIdMap[v.deal_id] = { ...v };
        }
      }
    }
  }
  const quoteParams = Object.values(quoteIdMap);
  const dealParams = Object.values(dealIdMap);

  if (dealParams.length || quoteParams.length) {
    try {
      const list: Promise<unknown>[] = [];
      if (quoteParams.length) {
        list.push(mulUpdateBondQuote({ quote_item_list: quoteParams }));
      }
      if (dealParams.length) {
        list.push(mulUpdateMarketDeal({ market_deal_update_list: dealParams }));
      }
      await Promise.all(list);
      await removeUndoSnapshot(maxIdx, productType);
    } catch (error: any) {
      if (SERVER_SUCCESS_CODE_FOR_UNDO.has(error?.data?.status_code)) {
        // 后端返回固定的code，前端认为成功
        await removeUndoSnapshot(maxIdx, productType);
      }
    }
  }

  return Object.keys({ ...quoteIdMap, ...dealIdMap });
};

type LogUndoType = Pick<UndoOperationItem, 'type' | 'productType' | 'tag' | 'dataType'> &
  ({ dataType: 'quote'; quote_id_list?: string[] } | { dataType: 'deal'; deal_id_list?: string[] });

type LogUndoParams = { phase: LogFlowPhase; undo?: UndoOperationItem };
const logUndoFlow = getFlowLogger('undo');
export function logUndo({ phase, undo }: LogUndoParams) {
  const ELE_ID = 'undo-saver';
  let $ele = document.getElementById(ELE_ID);
  let logData: LogUndoType | undefined;
  if (undo) {
    logData = pick(undo, 'type', 'productType', 'tag', 'dataType');
    if (undo?.data?.[0]) {
      if (undo.dataType === 'quote' && logData?.dataType === 'quote') {
        logData.quote_id_list = undo.data.map(u => u.quote_id);
      }
      if (undo.dataType === 'deal' && logData?.dataType === 'deal') {
        logData.deal_id_list = undo.data.map(u => u.deal_id);
      }
    }
  }
  if (phase === LogFlowPhase.Submit) {
    if (!undo || !logData) return;
    if (!$ele) {
      $ele = document.createElement('i');
      document.documentElement.appendChild($ele);
      $ele.id = ELE_ID;
      $ele.style.display = 'none';
    }
    $ele.dataset.lastUndo = JSON.stringify(logData);
  } else if (phase === LogFlowPhase.Success) {
    const lastUndo = $ele?.dataset?.lastUndo;
    if (!lastUndo) return;
    logData = JSON.parse(lastUndo);
    delete $ele?.dataset.lastUndo;
  }
  if (logData) logUndoFlow(phase, logData);
  $ele = null;
}
