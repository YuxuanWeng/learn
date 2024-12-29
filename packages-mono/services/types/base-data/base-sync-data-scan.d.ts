import type {
  BaseResponse,
  BondAppendixSync,
  BondBasicSync,
  BondDetailSync,
  HolidaySync,
  InstSync,
  IssuerLite,
  TraderSync,
  UserSync
} from '../common';
import { ProductType, SyncDataType } from '../enum';

/**
 * @description 初始化拉取基础数据信息
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/base_data/base_sync_data/scan
 */
export declare namespace BaseDataBaseSyncDataScan {
  type Request = {
    sync_data_type: SyncDataType;
    search_after?: string;
    count: number;
    product_type_list?: ProductType[]; // 债券可以分台子拉取
    local_version?: string; // 本地最新版本
    holiday_start_time?: string; // 拉取节假日时的起始点，默认从30天前开始
    unlimited?: boolean; // 是否需要过滤无效数据
    compressed?: boolean; // 是否压缩
    start_time?: string; // 起始时间
    end_time?: string;
  };

  type Response = {
    base_response?: BaseResponse;
    search_after?: string; // 请求下一页使用
    trader_list?: TraderSync[];
    inst_list?: InstSync[];
    user_list?: UserSync[];
    bond_basic_list?: BondBasicSync[];
    bond_appendix_list?: BondAppendixSync[];
    holiday_list?: HolidaySync[];
    bond_detail_list?: BondDetailSync[];
    issuer_lite_list?: IssuerLite[];
    data?: string;
  };
}
