import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { UserSettingFilterGroupUpsert } from '@fepkg/services/types/user/setting-filter-group-upsert';
import request from '@/common/request';

/**
 * @description 创建用户个人高级筛选分组设置
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/user/setting/filter_group/upsert
 */
export const upsertFilterGroup = (params: UserSettingFilterGroupUpsert.Request, config?: RequestConfig) => {
  return request.post<UserSettingFilterGroupUpsert.Response>(APIs.user.setting.upsertFilterGroup, params, config);
};
