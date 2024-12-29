import { WeeklyWeekdayMap } from '@fepkg/business/utils/data-manager/next-weekly-weekday-manager';
import { fixFloatDecimal } from '@fepkg/common/utils/utils';
import { InstitutionLite, NCDPInfoLite, NCDPInfoLiteUpdate } from '@fepkg/services/types/common';
import { FRType, IssuerDateType } from '@fepkg/services/types/enum';
import { CommonRoute, WindowName } from 'app/types/window-v2';
import { NCDPBatchFormListItem } from '../types';

export const getNCDPBatchFormConfig = () => ({
  name: WindowName.NCDPBatchForm,
  custom: { route: CommonRoute.NCDPBatchForm },
  options: { width: 1048 + 2, height: 632 + 2, resizable: false }
});

export const getDefaultInst = (item?: NCDPBatchFormListItem) =>
  ({
    inst_id: item?.inst_id ?? '',
    short_name_zh: item?.inst_name ?? '',
    full_name_zh: item?.inst_name ?? '',
    issuer_rating: item?.issuer_rating_current,
    standard_code: item?.inst_standard_code ?? ''
  }) as InstitutionLite;

export const transform2Price = (frType = FRType.FRD, price = 0) => {
  switch (frType) {
    case FRType.Shibor:
      // 若为浮息，录入后的价格已转换为收益率，需要转换 bp，使用 parseInt 是因为浮点数计算精度有问题
      price = parseInt(`${price * 100}`, 10);
      return price;
    default:
      return price;
  }
};

const transform2Yield = (frType = FRType.FRD, price = 0) => {
  switch (frType) {
    case FRType.Shibor:
      // 若为浮息，说明价格为 Bp，此时单位为 bp，需要转换
      price /= 100;
      return price;
    default:
      // 否则按照目前来看，都是收益率
      return price;
  }
};

export const transform2CommonRequest = (
  item: NCDPBatchFormListItem,
  defaultIssuerDateType: IssuerDateType,
  weekdayMap: WeeklyWeekdayMap
) => {
  const issuerType = item?.issuer_type ?? defaultIssuerDateType;
  const frType = item?.fr_type ?? FRType.FRD;

  return {
    key: undefined,
    line: item?.line ?? 0,
    inst_id: item?.inst_id ?? '',
    issuer_rating_current: item?.issuer_rating_current ?? 0,
    issuer_date: weekdayMap[issuerType],
    issuer_type: issuerType,
    maturity_date: item?.maturity_date ?? 0,
    fr_type: frType,
    // 录入进去的价格全是收益率，即使选了浮息，也要转换
    price: (item?.price ? transform2Yield(frType, Number(item.price)) : 0) ?? 0,
    volume: (item?.volume ? Number(item.volume) : 0) ?? 0
  };
};

export const transform2NCDPInfoLite = (
  item: NCDPBatchFormListItem,
  defaultIssuerDateType: IssuerDateType,
  weekdayMap: WeeklyWeekdayMap
): NCDPInfoLite => {
  return {
    ...item,
    ...transform2CommonRequest(item, defaultIssuerDateType, weekdayMap)
  };
};

const updatedFields = [
  'inst_id',
  'issuer_rating_current',
  'maturity_date',
  'fr_type',
  'price',
  'price_changed',
  'volume',
  'issuer_date',
  'issuer_type',
  'comment',
  'flag_internal',
  'flag_brokerage',
  'flag_full'
];

const diffUpdated = (updated: NCDPInfoLiteUpdate, original: NCDPBatchFormListItem['original']) => {
  const res: NCDPInfoLiteUpdate = { ncdp_id: updated.ncdp_id, line: updated.line };

  for (const key of updatedFields) {
    if (!Object.hasOwn(updated, key)) continue;

    if (updated[key] !== undefined) {
      if (updated[key] !== original?.[key]) res[key] = updated[key];
    }
  }

  return res;
};

export const transform2NCDPInfoLiteUpdate = (
  item: NCDPBatchFormListItem,
  defaultIssuerDateType: IssuerDateType,
  weekdayMap: WeeklyWeekdayMap,
  original?: NCDPBatchFormListItem['original']
): NCDPInfoLiteUpdate => {
  let updated: NCDPInfoLiteUpdate = {
    ...item,
    ncdp_id: item?.ncdp_id ?? '',
    ...transform2CommonRequest(item, defaultIssuerDateType, weekdayMap)
  };

  if (original) {
    updated = diffUpdated(updated, original);

    // 价格变动特殊处理
    if (updated?.price) {
      updated.price_changed = fixFloatDecimal((updated.price - (original?.price ?? 0)) * 100);
    }

    // 如果发行机构、期限、价格类型、发行日期变动，价格变动值重置为 0
    for (const key of ['inst_id', 'maturity_date', 'fr_type', 'issuer_date']) {
      if (Object.hasOwn(updated, key)) {
        updated.price_changed = 0;
        break;
      }
    }
  }

  // 机构 id 在更新时一定要传
  updated.inst_id = item?.inst_id ?? '';

  return updated;
};
