import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { InstWithTradersFuzzySearch } from '@fepkg/services/types/inst/with-traders-fuzzy-search';
import request from '@/common/request';

/**
 * @description 根据用户输入模糊查询机构列表（包括所属所有交易员）
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/inst/with_traders/fuzzy_search
 */
export const fuzzySearchInstWithTraders = (params: InstWithTradersFuzzySearch.Request, config?: RequestConfig) => {
  return request.post<InstWithTradersFuzzySearch.Response>(APIs.inst.fuzzySearchWithTraders, params, config);
};
