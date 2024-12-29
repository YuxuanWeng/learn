export type QuoteBatchFormProps = {
  /** 用于提交的 hook */
  useSubmit: () => { submitting?: boolean; handleConfirm?: () => void };
  /** 是否展示 flags 修改选择按钮 */
  showFlags?: boolean;
  /** 是否展示机构交易员、经纪人搜索框 */
  showCpb?: boolean;
  /** 是否展示 Modal Footer 中内部报价、紧急 checkbox */
  showFooter?: boolean;
  /** 日志信息 */
  loggerInfo?: { flowName?: string; traceField?: string };
};
