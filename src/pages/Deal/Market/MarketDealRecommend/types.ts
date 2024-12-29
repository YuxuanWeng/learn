export type MarketRecommendDialogContext = {
  /** 对应台子tab_id */
  panelId?: string;
  /** 窗口打开时间戳 */
  timestamp?: number;
  /** 提交成功时的回调 */
  onSuccess?: () => void;
  /** 取消打开时的回调 */
  onCancel?: () => void;
};

export type MarketRecommendSettingDialogContext = {
  /** 窗口打开时间戳 */
  timestamp?: number;
  /** 提交成功时的回调 */
  onSuccess?: () => void;
  /** 取消打开时的回调 */
  onCancel?: () => void;
};
