import {
  IconBO,
  IconJian,
  IconOco,
  IconPack,
  IconStar,
  IconStar2,
  IconTime,
  IconToExternal,
  IconToInternal,
  IconTransferLrSmall,
  IconUrgent,
  IconZhai
} from '@fepkg/icon-park-react';
import { preventEnterDefault } from '@/pages/ProductPanel/utils';
import { ActionValue } from './types';

export const OTHER_SHORTCUT_BUTTON_LIST = [
  { title: '意向价', icon: <IconBO />, actionValue: ActionValue.BID_OFR },
  { title: '更新报价时间', icon: <IconTime />, actionValue: ActionValue.UpdateTime },
  { title: '可议价', icon: <IconStar />, actionValue: ActionValue.SingleStar },
  { title: '更可议价', icon: <IconStar2 />, actionValue: ActionValue.DoubleStar },
  { title: 'OCO', icon: <IconOco />, actionValue: ActionValue.OCO },
  { title: '估值报价', icon: <IconZhai />, actionValue: ActionValue.Val },
  { title: '内部报价变外部报价', icon: <IconToExternal />, actionValue: ActionValue.External },
  { title: '外部报价变内部报价', icon: <IconToInternal />, actionValue: ActionValue.Internal },
  { title: '紧急', icon: <IconUrgent />, actionValue: ActionValue.Urgent },
  { title: '打包', icon: <IconPack />, actionValue: ActionValue.Pack },
  { title: '推荐', icon: <IconJian />, actionValue: ActionValue.Recommend },
  { title: '换方向', icon: <IconTransferLrSmall />, actionValue: ActionValue.ExchangeSide }
];

export const UPDATE_PRICE_LIST = [5, -5, 1, -1, 0.5, -0.5, 0.25, -0.25];
export const UPDATE_VOL_LIST = [1000, -1000, 5000, -5000];

/** 快捷备注的最大条数 */
export const SETTLEMENT_LENGTH_MAX = 8;
/** 最少多少条可以开始删除备注 */
export const CAN_DELETE_SETTLEMENT_LENGTH_MIN = 5;

const btnClass =
  'w-16 h-16 flex flex-col gap-2 text-gray-100 text-xs font-medium justify-center [&_.s-btn-icon]:w-6 [&_.s-btn-icon]:h-6 p-0';
export const NCDP_BTN_COMMON_PROPS = {
  type: 'gray',
  plain: true,
  throttleWait: 300,
  tabIndex: -1,
  className: btnClass,
  onKeyDown: preventEnterDefault
} as const;

export enum MulCreateMarketDealErrorEnum {
  /** 内部报错 */
  InternalError = 1,
  /** 计算器计算失败 */
  CalcError = 24064
}

export const QUOTE_BATCH_FORM_LOGGER_TRACE_FIELD = 'ShortcutSidebarQuoteBatchFormTraceId';
export const QUOTE_BATCH_FORM_LOGGER_FLOW_NAME = 'shortcut-sidebar-quote-batch-form';
