// 点价板进入模式
export enum SpotMainEnterType {
  FullMode = 'spot-main-enter-type-full',
  SimpleMode = 'spot-main-enter-type-simple'
}
// 点价弹窗进入方式
export enum SpotModalOpenType {
  FromMain = 'spot-modal-open-from-main',
  FromDetail = 'spot-modal-open-from-detail'
}

// 单券点价板进入
export enum SpotModalDetailType {
  DetailEnter = 'spot-modal-detail-enter'
}

// 点价弹窗提交流程
export enum SpotModalFlow {
  FlowEnter = 'spot-modal-flow-enter',
  FlowSubmit = 'spot-modal-flow-submit',
  FlowSuccess = 'spot-modal-flow-success'
}

// 点价弹窗提交流程（指定模式）
export enum SpotAppointModalFlow {
  FlowEnter = 'spot-appoint-modal-flow-enter',
  FlowSubmit = 'spot-appoint-modal-flow-submit',
  FlowSuccess = 'spot-appoint-modal-flow-success'
}

// 点价提示提交流程
export enum SpotModalHintFlow {
  FlowSubmit = 'spot-hint-single-submit',
  FlowSuccess = 'spot-hint-single-success'
}

/** 行情追踪 */
export enum MarketTrackEnum {
  Enter = 'market-track-enter'
}

export enum MarketTrackOperateEnum {
  Send = 'market-track-operate-send',
  BondSend = 'market-track-operate-send-bond',
  BatchBondSend = 'market-track-operate-send-bond-batch',
  Delete = 'market-track-operate-delete',
  BatchDelete = 'market-track-operate-delete-batch'
}

export enum MarketTrackOperateStatusEnum {
  SendFailure = 'market-track-operate-status-send-failure'
}

export enum ChatQuicklyEnum {
  Enter = 'chat-quickly-enter'
}
