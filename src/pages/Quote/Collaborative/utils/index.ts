import { KeyboardEventHandler } from 'react';
import { SERVER_NIL } from '@fepkg/common/constants';
import { QuoteDraftDetailConfirm, QuoteDraftDetailOrder, QuoteDraftMessageConfirm } from '@fepkg/services/types/common';
import { ProductType, QuoteDraftDetailStatus, QuoteDraftModifiedStatus } from '@fepkg/services/types/enum';
import { DialogEvent } from 'app/types/IPCEvents';
import { CommonRoute, WindowName } from 'app/types/window-v2';
import { CreateDialogParams } from 'app/windows/models/base';
import { LocalQuoteDraftDetail, LocalQuoteDraftMessage } from '@/common/services/hooks/local-server/quote-draft/types';
import { miscStorage } from '@/localdb/miscStorage';
import {
  DraftGroupTableDetailData,
  DraftGroupTableMessageData,
  DraftGroupTableRowData,
  DraftGroupTableRowType
} from '../types/table';

const MIN_WIDTH = 1000;
const MIN_HEIGHT = 700;

export const getCollaborativeQuoteDialogConfig = (
  productType: ProductType,
  panelId: string
): Omit<CreateDialogParams, 'category'> => ({
  name: WindowName.CollaborativeQuote,
  custom: { route: CommonRoute.CollaborativeQuote, routePathParams: [productType.toString(), panelId] },
  options: {
    width: MIN_WIDTH,
    height: MIN_HEIGHT,
    minWidth: MIN_WIDTH,
    minHeight: MIN_HEIGHT,
    resizable: true
  }
});

export const stopPropagation: KeyboardEventHandler = evt => evt.stopPropagation();

export const isDraftDetailData = (
  rowData: DraftGroupTableMessageData | DraftGroupTableDetailData
): rowData is DraftGroupTableDetailData => {
  return rowData.type === DraftGroupTableRowType.Detail;
};

/** 报价审核详情是否为待处理状态 */
export const isPendingStatus = (status?: QuoteDraftDetailStatus) => {
  if (!status) return false;
  return new Set([QuoteDraftDetailStatus.QuoteDraftDetailStatusPending]).has(status);
};

/** 状态缓存中是否有待处理状态 */
export const hasPendingStatus = (statuses: Set<QuoteDraftDetailStatus>) => {
  return statuses.has(QuoteDraftDetailStatus.QuoteDraftDetailStatusPending);
};

/** 报价审核消息是否他人正在编辑中 */
export const isOtherProcessing = (operatorId?: string, status?: QuoteDraftModifiedStatus) => {
  const userId = miscStorage.userInfo?.user_id;
  return (
    (status === QuoteDraftModifiedStatus.QuoteDraftMulModifiedStatusOnce && operatorId !== userId) ||
    status === QuoteDraftModifiedStatus.QuoteDraftMulModifiedStatusMul
  );
};

/** 标签内容是否改变 */
export const isFlagsChanged = (flags?: Record<string, boolean | number>) => {
  if (!flags) return false;

  for (const key in flags) {
    if (Object.hasOwn(flags, key)) {
      if (flags[key]) return true;
    }
  }

  return false;
};

/** 获取该分组中每列的 id 集合 */
export const getGroupDetailKeys = (list: DraftGroupTableRowData[], start: number, end: number) => {
  const keys = new Set<string>();
  list.slice(start, end).forEach(item => keys.add(item.id));
  return keys;
};

/** 获取分组下所有的 detail data */
export const getGroupDetailData = (
  message: DraftGroupTableMessageData,
  list: DraftGroupTableRowData[],
  indexCache: Map<string, number>,
  callback?: (detail: DraftGroupTableDetailData) => void
) => {
  /** 已选中的消息分组下所有详情的数组 */
  const details: DraftGroupTableDetailData[] = [];

  const firstKey = message.groupItemRowKeys?.at(0);
  const lastKey = message.groupItemRowKeys?.at(-1);

  const start = indexCache.get(firstKey ?? '') ?? 0;
  const end = (indexCache.get(lastKey ?? '') ?? 0) + 1;

  for (let i = start; i < end; i++) {
    const item = list[i];
    if (isDraftDetailData(item)) {
      callback?.(item);
      details.push(item);
    }
  }

  return details;
};

/** 获取分组下所有的 detail index 的缓存 */
export const getGroupDetailIndexCache = (orders: QuoteDraftDetailOrder[]) => {
  const cache = new Map<string, number>();
  let index = 0;

  for (let i = 0, len = orders.length; i < len; i++) {
    const order = orders[i];
    const { detail_id_list = [] } = order;
    const detailIdsLen = detail_id_list.length;

    if (detailIdsLen) {
      for (let j = 0; j < detailIdsLen; j++) {
        const id = detail_id_list[j];
        cache.set(id, index);
        index += 1;
      }
    } else {
      index += 1;
    }
  }

  return cache;
};

/**
 * 对协同报价的行数map排序后重新赋值，从0开始重新计数，用于在倒挂提醒中展示忽略无效文本后报价的实际行数
 * reorderDetailIndexCache({'a': 2, 'b': 4}) => {'a': 0, 'b': 1}
 */
export const reorderDetailIndexCache = (orderCache: Map<string, number>) => {
  const ids: string[] = [...orderCache.keys()];
  const reorderCache = new Map<string, number>();
  ids.sort((a, b) => orderCache[a] - orderCache.get[b]);
  let i = 0;
  ids.forEach(id => {
    reorderCache.set(id, i);
    i += 1;
  });
  return reorderCache;
};

export const updateMessageDetails = <T extends keyof LocalQuoteDraftDetail>({
  message,
  field,
  value,
  changer
}: {
  message: LocalQuoteDraftMessage;
  field?: T;
  value?: LocalQuoteDraftDetail[T];
  changer?: (detail: LocalQuoteDraftDetail) => LocalQuoteDraftDetail;
}): LocalQuoteDraftMessage => {
  return {
    ...message,
    detail_list: message?.detail_list?.map(detail => {
      if (field) return { ...detail, [field]: value };
      if (changer) return changer(detail);

      return detail;
    })
  };
};

export const transform2MessageConfirm = (data: DraftGroupTableMessageData): QuoteDraftMessageConfirm => {
  const { inst_info, trader_info, broker_info } = data.original;
  return {
    message_id: data.original.message_id,
    inst_id: inst_info?.inst_id ?? '',
    trader_id: trader_info?.trader_id ?? '',
    trader_tag: trader_info?.trader_tag ?? '',
    broker_id: broker_info?.user_id ?? ''
  };
};

export const transform2DetailConfirm = (detail?: LocalQuoteDraftDetail): QuoteDraftDetailConfirm | undefined => {
  if (!detail) return void 0;

  const {
    detail_id,
    message_id,
    corresponding_line,
    side,
    quote_type,
    price = SERVER_NIL,
    volume = SERVER_NIL,
    return_point = SERVER_NIL,
    flag_rebate = false,
    flag_star = 0,
    flag_package = false,
    flag_oco = false,
    flag_exchange = false,
    flag_intention = false,
    flag_indivisible = false,
    flag_stock_exchange = false,
    flag_bilateral = false,
    flag_request = false,
    flag_urgent = false,
    flag_internal = false,
    flag_recommend = false,
    liquidation_speed_list,
    comment = '',
    is_exercise = false,
    exercise_manual = false,
    flag_inverted = false,
    bond_info
  } = detail;
  let { status } = detail;

  if (!message_id || corresponding_line === void 0 || !side || !quote_type || !bond_info?.key_market || !status) {
    return void 0;
  }

  if (status === QuoteDraftDetailStatus.QuoteDraftDetailStatusPending) {
    status = QuoteDraftDetailStatus.QuoteDraftDetailStatusConfirmed;
  }

  return {
    detail_id,
    message_id,
    corresponding_line,
    side,
    key_market: bond_info.key_market,
    quote_type,
    price,
    volume,
    return_point,
    flag_rebate,
    flag_star,
    flag_package,
    flag_oco,
    flag_exchange,
    flag_intention,
    flag_indivisible,
    flag_stock_exchange,
    flag_bilateral,
    flag_request,
    flag_urgent,
    flag_internal,
    flag_recommend,
    liquidation_speed_list,
    comment,
    is_exercise,
    exercise_manual,
    status,
    flag_inverted
  };
};

/** 关闭协同报价窗口 */
export const closeCollaborativeQuote = async () => {
  await window.Main.invoke(DialogEvent.CloseByName, WindowName.CollaborativeQuote);
};
