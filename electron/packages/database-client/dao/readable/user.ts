import { transformProductType } from '@fepkg/business/constants/map';
import { UserSync } from '@fepkg/services/types/common';
import { AccountStatus, Enable, JobStatus, ProductType } from '@fepkg/services/types/enum';
import type { UserList } from '@fepkg/services/types/user/list';
import squel from 'squel';
import { userSql } from '../../sql/user';
import { UserDb } from '../../types';
import { BaseDao } from '../base';
import { Readable } from '../readable';
import { formatUserDb2UserSync, getKeywordParams } from './utils';

export class UserReadableDao extends BaseDao implements Readable {
  fuzzySearch(params: UserList.Request): { list?: UserSync[]; total: number } {
    const { product_type, keyword, post_list, require_job_number, offset, count, need_invalid } = params;

    // 用户搜索时允许keyword为空的情况，此时keyword不作为筛选条件
    let fuzzyParams;
    const queryList = squel
      .select()
      .from('user')
      .field('user.*')
      .where('user.enable = ?', Enable.DataEnable)
      .offset(offset ?? 0)
      .limit(count ?? 20);

    if (keyword) {
      queryList.field(userSql.fuzzyOrder);
      queryList.where(userSql.fuzzyWhere);
      queryList.order('matching_order', true);
      fuzzyParams = getKeywordParams(keyword);
    }

    if (!need_invalid) {
      queryList.where('user.job_status = ?', JobStatus.OnJob);
      queryList.where('user.account_status = ?', AccountStatus.Enable);
    }

    if (product_type) {
      queryList.where('user.product_codes like ?', `%"${transformProductType(product_type).en}"%`);
    }
    if (post_list?.length) {
      queryList.where(`user.post in (${post_list.join(',')})`);
    }
    if (require_job_number) {
      queryList.where("user.job_num != ''");
    }

    queryList.order('user.pinyin', true);
    const list = this.databaseClient.all<UserDb[] | undefined>(queryList.toString(), fuzzyParams);

    if (!list?.length) {
      return { total: 0, list: void 0 };
    }
    return { list: list.map(formatUserDb2UserSync), total: 0 };
  }

  getUsersByIdList(idList: string[], product_type?: ProductType, allStatus?: boolean) {
    if (!idList.length) return void 0;

    const queryList = squel
      .select()
      .from('user')
      .field('user.*')
      .where('user.enable = ?', Enable.DataEnable)
      .where('user_id in '.concat('(', idList.map(id => `'${id}'`).join(','), ')'));

    if (!allStatus) {
      queryList.where('user.job_status = ?', JobStatus.OnJob);
      queryList.where('user.account_status = ?', AccountStatus.Enable);
    }

    if (product_type) {
      queryList.where('user.product_codes like ?', `%"${transformProductType(product_type).en}"%`);
    }

    const result = this.databaseClient.all<UserDb[] | undefined>(queryList.toString());
    if (!result?.length) return void 0;
    return result?.map(formatUserDb2UserSync);
  }

  getLastVersion(): string | undefined {
    const result = this.databaseClient.get<{ sync_version: string } | undefined>(userSql.getLastVersion);
    return result?.sync_version;
  }

  getUserMapByIdSet(userIdSet: Set<string>, product_type?: ProductType, allStatus?: boolean) {
    const userMap = new Map<string, UserSync>();
    const userList = this.getUsersByIdList([...userIdSet], product_type, allStatus);
    userList?.forEach(u => userMap.set(u.user_id, u));
    return userMap;
  }

  getTotal(): number {
    const result = this.databaseClient.get<{ total: number }>(userSql.getTotal);
    return result.total;
  }
}
