import { message } from '@fepkg/components/Message';
import { NCDPCheck } from '@fepkg/services/types/common';
import { FRType } from '@fepkg/services/types/enum';
import { NCDPBatchFormListItem, NCDPBatchFormListItemCheckedInfo } from '../types';

export const requiredFields: readonly (keyof NCDPBatchFormListItem)[] = [
  'inst_id',
  'issuer_rating_current',
  'maturity_date',
  'price'
] as const;

const checkBasic = (item: NCDPBatchFormListItem) => {
  let type: NCDPBatchFormListItemCheckedInfo['type'];
  const { inst_id, issuer_rating_current, maturity_date, price } = item ?? {};

  if (!inst_id) type = 'inst';
  else if (!issuer_rating_current) type = 'rating';
  else if (!maturity_date) type = 'maturity-date';
  // 这里加 Number 是因为 price 在表单录入时是一个字符串
  else if (!Number(price)) type = 'price';

  return type;
};

const checkPrice = (item: NCDPBatchFormListItem) => {
  let type: NCDPBatchFormListItemCheckedInfo['type'];
  const { fr_type = FRType.FRD, price = 0 } = item ?? {};

  if ((fr_type === FRType.FRD && price > 10) || (fr_type === FRType.Shibor && (price > 1000 || price < -1000))) {
    type = 'price-limit';
  }

  return type;
};

const checkItem = (item: NCDPBatchFormListItem, line: number) => {
  let needCheck = !!item?.ncdp_id;
  const info: NCDPBatchFormListItemCheckedInfo = { line };

  for (const key of requiredFields) {
    if (item[key]) {
      needCheck = true;
      break;
    }
  }

  if (needCheck) {
    let type = checkBasic(item);
    if (!type) type = checkPrice(item);

    info.error = !!type;
    info.type = type;
  }

  return { needCheck, info };
};

const getChecksMap = (checks: NCDPBatchFormListItemCheckedInfo[] = []) => {
  const map = new Map<NCDPBatchFormListItemCheckedInfo['type'], NCDPBatchFormListItemCheckedInfo[]>();

  // 聚合数据
  for (const item of checks) {
    if (item?.type) {
      const list = map.get(item.type);
      if (list) map.set(item.type, [...list, item]);
      else map.set(item.type, [item]);
    }
  }

  return map;
};

const toastChecks = (map: ReturnType<typeof getChecksMap>, isBatch: boolean) => {
  for (const type of ['inst', 'rating', 'maturity-date', 'price'] as const) {
    const list = map.get(type);
    if (list) {
      let errorMessage = `第${list.map(i => i.line).join('、')}行，`;
      let content = '';

      switch (type) {
        case 'inst':
          content = '未获取到发行机构数据，请核对后重新录入';
          break;
        case 'rating':
          content = '评级不得为空，请核对后重新录入';
          break;
        case 'maturity-date':
          content = '期限不得为空，请核对后重新录入';
          break;
        case 'price':
          content = '未获取到价格信息，请核对后重新录入';
          break;
        default:
          break;
      }

      if (isBatch) errorMessage += content;
      else errorMessage = content;

      message.error(errorMessage);
      break;
    }
  }
};

export const checkList = (list: NCDPBatchFormListItem[], isBatch: boolean) => {
  let valid = true;
  const filtered: NCDPBatchFormListItem[] = [];
  const checks: NCDPBatchFormListItemCheckedInfo[] = [];
  let map: ReturnType<typeof getChecksMap> | undefined;

  for (let i = 0, len = list.length; i < len; i++) {
    const item = list[i];
    const line = i + 1;
    const { needCheck, info } = checkItem(item, line);

    if (needCheck) {
      if (info?.error) valid = false;
      filtered.push({ ...item, line });
      checks.push(info);
    }
  }

  if (checks.length) {
    map = getChecksMap(checks);
    toastChecks(map, isBatch);
  }

  const limitList = map?.get('price-limit');
  // 如果只有价格类型这一种错误，那么是合法的，可以提交，只是弹窗进一步确认而已
  if (map?.size === 1 && map?.has('price-limit')) valid = true;

  return { valid, filtered, checks, limitList };
};

export const toastRequestError = (errList: NCDPCheck[], isBatch: boolean) => {
  let errorMessage = '';

  if (errList.length) {
    errorMessage = `第${errList.map(i => i.line).join('、')}行，`;

    // 目前错误码只有发行机构失效，可以简单这么写
    const content = '发行机构失效，请核对后重新录入';
    if (isBatch) errorMessage += content;
    else errorMessage = content;
  }

  message.error(errorMessage);
};

export const toastNCDPSidebarError = (errList: NCDPCheck[], updateLength: number) => {
  if (!errList.length) return;

  // 批量且非全部报价失效则toast部分
  if (updateLength > 1 && updateLength !== errList.length) message.error('部分报价因发行机构失效，操作失败');
  else message.error('发行机构失效，操作失败');
};
