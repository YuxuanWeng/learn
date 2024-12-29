import { LiveRequest } from 'app/types/DataLocalization';
import { ProductType } from '../../bdm-enum';
import { BaseResponse, DealRecord } from '../../common';

export declare namespace LocalDealRecordList {
  type Request = LiveRequest & {
    product_type: ProductType;
    broker_list: string[];
    deal_time?: string;
  };

  type Response = {
    base_response?: BaseResponse;
    confirm_total?: number;
    deal_info_list?: DealRecord[];
  };
}
