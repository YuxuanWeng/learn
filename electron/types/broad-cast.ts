/**
 * 广播通信机制主逻辑消息类型
 * ps：前端不需要关心
 */
enum BroadcastEventEnum {
  /** 发出广播 */
  emit = 'broadcast-emit',
  on = 'broadcast-on'
}
export default BroadcastEventEnum;

/**
 * 渲染进程广播，消息类型
 */
export enum BroadcastChannelEnum {
  LOCAL_FORGE_UPDATE = 'localforage-update',

  BROADCAST_MERGE_DEAL_GROUP_UPDATE = 'broadcast-merge-deal-group-update',
  BROADCAST_IDC_SPOT_OPEN = 'broadcast-idc-spot-open',
  BROADCAST_PANEL_GROUP_REFETCH = 'broadcast-panel-group-refetch',
  BROADCAST_DEAL_DETAIL_LOCATION = 'broadcast-deal-detail-record-location',
  BROADCAST_ADVANCE_GROUP_CHANGE = 'broadcast-advance-change',
  BROADCAST_RECEIPT_DEAL_REFRESH = 'broadcast-receipt-deal-refresh',
  BROADCAST_SWITCH_RECEIPT_DEAL = 'broadcast-switch-receipt-deal',

  BROADCAST_ACCESS_CHANGE = 'broadcast-access-change'
}
