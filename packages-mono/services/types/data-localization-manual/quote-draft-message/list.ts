import { LiveRequest } from 'app/types/DataLocalization';
import { QuoteDraftDetail, QuoteDraftMessage } from 'app/types/DataLocalization/local-common';
import { BaseResponse } from '../../common';
import { QuoteDraftMessageStatus } from '../../enum';

/**
 * @description 根据经纪人列表获取报价审核消息
 */
export declare namespace LocalQuoteDraftMessageList {
  type Request = LiveRequest & {
    user_id?: string;
    creator_list: string[];
    product_type: number;
    status: QuoteDraftMessageStatus;
    observer_disabled?: boolean;
    timestamp?: number;
    offset: number;
    count: number;
  };

  type Response = {
    quote_draft_message_list?: QuoteDraftMessage[];
    upsert_message_list?: QuoteDraftMessage[];
    delete_message_id_list?: string[];
    upsert_detail_list?: QuoteDraftDetail[];
    latestCreateTime?: string;
    total?: number;
    hasMore?: boolean;
    base_response?: BaseResponse;
  };
}
