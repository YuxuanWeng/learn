import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { UserSettingFilterGroupGet } from '@fepkg/services/types/user/setting-filter-group-get';
import request from '@/common/request';

/**
 * @description 获取用户个人高级筛选分组设置
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/user/setting/filter_group/get
 */
export const getFilterGroup = (params: UserSettingFilterGroupGet.Request, config?: RequestConfig) => {
  return request.post<UserSettingFilterGroupGet.Response>(APIs.user.setting.getFilterGroup, params, config);
};
