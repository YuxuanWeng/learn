import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { ParsingNcdFilter } from '@fepkg/services/types/parsing/ncd-filter';
import request from '@/common/request';

/**
 * @description ncd二级录入文本识别筛选项
 * @url /api/v1/bdm/bds/bds_api/parsing/ncd_filter
 */
export const parsingNCDFilter = (params: ParsingNcdFilter.Request, config?: RequestConfig) => {
  return request.post<ParsingNcdFilter.Response>(APIs.parsing.ncdFilter, params, config);
};
