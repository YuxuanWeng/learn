import { MarketNotifyMsgType, ProductType } from '@fepkg/services/types/enum';

export type OutBoundConfValue = Record<
  ProductType,
  {
    /** 行情推送开关状态 */
    msgTypeList: MarketNotifyMsgType[]; // 行情推送开关打开的类别集合
    /** 字段配置状态 */
    fieldList: number[]; // 勾选中的字段集合
  }
>;
