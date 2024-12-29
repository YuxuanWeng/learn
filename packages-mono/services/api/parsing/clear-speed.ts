import { getRequest } from '@fepkg/request';
import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { ParsingClearSpeed } from '../../types/parsing/clear-speed';

/**
 * @description 结算日期识别: 将用户输入识别为清算速度
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/parsing/clear_speed
 */
export const fetchParsingClearSpeed = (params: ParsingClearSpeed.Request, config?: RequestConfig) => {
  return getRequest().post<ParsingClearSpeed.Response>(APIs.parsing.clearSpeed, params, config);
};
