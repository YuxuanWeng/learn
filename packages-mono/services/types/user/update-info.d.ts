import type { BaseResponse, User } from '../common';

/**
 * @description 编辑个人信息
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/user/info/update
 */
export declare namespace UserUpdateInfo {
  type Request = {
    name_cn?: string; // 姓名
    job_num?: string; // 工号
    phone?: string; // 手机
    telephone?: string; // 电话
    email?: string; // 电子邮件
    QQ?: string; // qq
  };

  type Response = {
    status_code: number;
    status_msg: string;
    user: User;
    base_response?: BaseResponse;
  };
}
