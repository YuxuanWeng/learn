import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { FuzzySearch } from '@fepkg/services/types/algo/quick-chat-api-fuzzy-search';
import request from '@/common/request';

/**
 * @description 模糊查询
 * @method GET
 * @url /api/v1/algo/helper/quick_chat_api/fuzzy_search
 */
export const fuzzySearch = (params: FuzzySearch.Request, config?: RequestConfig) => {
  return request.get<FuzzySearch.Response>(APIs.algo.fuzzySearch, params, { ...config, isAlgo: true });
};
