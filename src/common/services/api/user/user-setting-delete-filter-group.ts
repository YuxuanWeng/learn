import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { UserSettingFilterGroupDelete } from '@fepkg/services/types/user/setting-filter-group-delete';
import request from '@/common/request';

/**
 * @description 删除用户个人高级筛选分组设置
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/user/setting/filter_group/delete
 */
export const deleteFilterGroup = (params: UserSettingFilterGroupDelete.Request, config?: RequestConfig) => {
  return request.post<UserSettingFilterGroupDelete.Response>(APIs.user.setting.deleteFilterGroup, params, config);
};
