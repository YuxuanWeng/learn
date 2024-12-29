import type {
  BaseResponse,
  GeneralFilter,
  InputFilter,
  NCDPInfo,
  QuickFilter,
  SortingMethod,
  TableRelatedFilter
} from '../common';

/**
 * @description 通过筛选条件获取ncd一级
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/bond_quote/ncdp/search
 */
export declare namespace BondQuoteNcdpSearch {
  type Request = {
    quick_filter: QuickFilter;
    general_filter: GeneralFilter;
    table_related_filter: TableRelatedFilter;
    input_filter: InputFilter;
    is_deleted: boolean; // 是否为已删除
    sorting_method?: SortingMethod;
    offset: number;
    count: number;
  };

  type Response = {
    ncdp_list?: NCDPInfo[];
    total: number;
    base_response?: BaseResponse;
  };
}
