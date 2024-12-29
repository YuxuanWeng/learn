import { ProductType, QuoteDraftMessageStatus } from '@fepkg/services/types/enum';

export const API = 'local-quote-draft-message-list/search';

export type QuoteDraftMessageListQueryKey = readonly [
  typeof API,
  {
    /** 台子类型 */
    productType: ProductType;
    /** 消息状态 */
    status: QuoteDraftMessageStatus;
    /** 用户 Id */
    userId?: string;
    /** 创建用户 Id 列表 */
    creatorIdList?: string[];
    /** 分页起始位置 */
    offset: number;
    /** 每页大小 */
    count: number;
    /** 查询时间戳（若传入，则会使用传入时间戳查询比其创建时间更小的数据） */
    timestamp?: number;
    /** 是否禁用实时订阅 */
    disabled: boolean;
  }
];
