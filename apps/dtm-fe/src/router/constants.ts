import { AccessCode } from '@fepkg/services/access-code';

export enum RouteUrl {
  /** 根路由 */
  Root = '/',
  /** 登录页 */
  Login = '/login',
  /** 404 页 */
  NotFound = '/404',
  /** 审核列表页 */
  ApprovalList = '/approval/list',
  /** 全量查询页 */
  ApprovalHistoryList = '/approval/history/list',
  /** 成交查询页 */
  ApprovalDealList = '/approval/deal/list',
  /** 后台配置 */
  BackendSetting = '/backend/setting',
  /** 预览页 */
  Preview = '/preview',
  /** 预览打印页 */
  PreviewPrint = '/preview/print'
}

export type AuthRouteUrl = Exclude<RouteUrl, RouteUrl.Root | RouteUrl.Login | RouteUrl.NotFound>;

export const AuthRouteMap = new Map<string, AccessCode>([
  [RouteUrl.ApprovalList, AccessCode.CodeDTMApprovalPage],
  [RouteUrl.ApprovalHistoryList, AccessCode.CodeDTMHistoryPage],
  [RouteUrl.ApprovalDealList, AccessCode.CodeDTMCompletedHistoryPage],
  [RouteUrl.BackendSetting, AccessCode.CodeDTMSettingRole],
  [RouteUrl.Preview, AccessCode.CodeDTM]
]);
