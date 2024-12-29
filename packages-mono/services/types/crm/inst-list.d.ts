import type { BaseResponse, InstitutionLite } from '../common';
import { BindMbs, CreateType, InstStatus, LegalPerson, Sort, UsageStatus } from '../enum';

/**
 * @description 获取机构列表
 * @method POST
 * @url /api/v1/bdm/crm/api/inst/list
 */
export declare namespace InstList {
  type Request = {
    inst_type_list?: string[]; // 机构类型
    city_list?: string[]; // 城市
    usage_status_list?: UsageStatus[]; // 使用状态
    inst_level_list?: string[]; // 机构级别
    legal_person?: LegalPerson[]; // 法人
    keyword?: string; // 关键字
    create_start_time?: string; // 创建开始时间
    create_end_time?: string; // 创建结束时间
    deal_start_time?: string; // 成交开始时间
    deal_end_time?: string; // 成交结束时间
    product_list?: string[]; // 产品权限
    bind_mbs?: BindMbs[]; // 是否绑定mbs
    create_type?: CreateType[]; // 机构新建方式
    inst_status?: InstStatus[]; // 机构状态
    sort?: Sort; // 升序/降序
    sort_field?: string; // 排序字段
    offset?: number;
    count?: number;
    flag_issuer?: boolean; // 是否需要绑定发行人
  };

  type Response = {
    status_code: number;
    status_msg: string;
    list?: InstitutionLite[];
    total?: number;
    base_response?: BaseResponse;
  };
}
