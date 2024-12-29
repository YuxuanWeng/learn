// 需要使用trace的类型枚举
export enum TraceName {
  SINGLE_QUOTE_SUBMIT = 'single_quote_submit', // 单条报价提交
  BATCH_QUOTE_SUBMIT = 'batch_quote_submit', // 批量报价修改提交
  MARKET_DEAL_SUBMIT = 'market_deal_submit', // 市场成交提交
  SPOT_SUBMIT = 'spot_submit', // 点价提交
  SPOT_APPOINT_SUBMIT = 'spot_appoint_submit', // 点价提交 指定模式
  COLLABORATIVE_SINGLE_QUOTE_SUBMIT = 'collaborative_single_quote_submit', // 协同报价-单条编辑报价
  COLLABORATIVE_BATCH_QUOTE_SUBMIT = 'collaborative_BATCH_quote_submit', // 协同报价-批量编辑报价

  BRIDGE_EDIT_WITH_NONE = 'bridge_edit_with_none', // 无桥桥编辑
  BRIDGE_EDIT_WITH_SINGLE_ONE = 'bridge_edit_with_single_one', // 单条单桥桥编辑
  BRIDGE_EDIT_WITH_SINGLE_TWO = 'bridge_edit_with_single_two', // 单条双桥桥编辑
  BRIDGE_EDIT_WITH_SINGLE_MUL = 'bridge_edit_with_single_mul', // 多桥编辑
  BRIDGE_EDIT_WITH_BATCH = 'bridge_edit_with_batch', // 批量桥编辑

  RECEIPT_DEAL_FORM_SUBMIT = 'receipt_deal_form_submit', // 成交单录入提交
  RECEIPT_DEAL_BATCH_FORM_SUBMIT = 'receipt_deal_batch_form_submit', // 成交单批量录入提交

  LOCAL_SERVER_REQUEST = 'local_server_request' // 本地服务请求
}
