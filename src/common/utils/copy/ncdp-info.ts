import { MaturityDateTypeMap, RatingMap } from '@fepkg/business/constants/map';
import { SPACE_TEXT } from '@fepkg/common/constants';
import { fixFloatDecimal, sleep } from '@fepkg/common/utils/utils';
import { NCDPInfo } from '@fepkg/services/types/common';
import { FRType, IssuerDateType, MaturityDateType, Rating } from '@fepkg/services/types/enum';
import moment from 'moment';
import { mulFetchNCDP } from '@/common/services/api/bond-quote/ncdp-mul-get-by-id';
import { formatPrice } from '@/common/utils/copy/quote';
import { IssueMaturityCache } from '@/pages/ProductPanel/components/NCDPTable/types';
import { trackSpecialSlow } from '../logger/special';

const splitLine = '========================================';

const RatingWeightMap = new Map<Rating, number>([
  [Rating.AAAPlus, 0],
  [Rating.AAA, 1],
  [Rating.AAAMinus, 2],
  [Rating.AAPlus, 3],
  [Rating.AA, 4],
  [Rating.AAMinus, 5],
  [Rating.APlus, 6],
  [Rating.A, 7],
  [Rating.AMinus, 8],
  [Rating.BBBPlus, 9],
  [Rating.BBB, 10],
  [Rating.OtherIssuerRating, 11]
]);

const getNcdPInfoPriceText = (ncdpInfo: NCDPInfo) => {
  let arrow = '';
  if (!!ncdpInfo.price_changed && ncdpInfo.price_changed > 0) {
    arrow = '↑';
  } else if (!!ncdpInfo.price_changed && ncdpInfo.price_changed < 0) {
    arrow = '↓';
  }
  const suffix = `${arrow}${ncdpInfo.issuer_type === IssuerDateType.IssuerDateTypeToday ? '（今日公开）' : ''}${
    ncdpInfo.flag_full ? '（满）' : ''
  }`;

  if (ncdpInfo.fr_type === FRType.Shibor) {
    return `浮息 3m shibor${ncdpInfo.price >= 0 ? '+' : ''}${fixFloatDecimal(ncdpInfo.price * 100)}bp${suffix}`;
  }
  return formatPrice(ncdpInfo.price, 4) + suffix;
};

const getNcdPInfoVolumeText = (volume?: number) => {
  if (!volume) return '';
  return `（${volume ?? 0}亿）`;
};

const getNcdPInfoCopyText = (ncdpInfo: NCDPInfo) => {
  return [
    ncdpInfo.flag_internal ? '暗盘' : '',
    MaturityDateTypeMap[ncdpInfo.maturity_date],
    ncdpInfo.inst_name,
    RatingMap[ncdpInfo.issuer_rating_current],
    getNcdPInfoPriceText(ncdpInfo) +
      getNcdPInfoVolumeText(ncdpInfo.volume) +
      (ncdpInfo.comment ? `（${ncdpInfo.comment}）` : '')
  ]
    .filter(Boolean)
    .join(SPACE_TEXT.repeat(4));
};

const getNcdPInfoCopyAttentionText = (issueMaturityCache: IssueMaturityCache) => {
  const updateTime = moment().format('YYYY年MM月DD日 HH:mm');
  return [
    '请注意：',
    `发行日：${issueMaturityCache.tomorrow}`,
    `缴款日：${issueMaturityCache.tomorrowPlus1}`,
    `1M 到期日：${issueMaturityCache.oneM.date}，${issueMaturityCache.oneM.isTradeDate ? '工作日' : '节假日'}`,
    `3M 到期日：${issueMaturityCache.threeM.date}，${issueMaturityCache.threeM.isTradeDate ? '工作日' : '节假日'}`,
    `6M 到期日：${issueMaturityCache.sixM.date}，${issueMaturityCache.sixM.isTradeDate ? '工作日' : '节假日'}`,
    `9M 到期日：${issueMaturityCache.nineM.date}，${issueMaturityCache.nineM.isTradeDate ? '工作日' : '节假日'}`,
    `1Y 到期日：${issueMaturityCache.oneY.date}，${issueMaturityCache.oneY.isTradeDate ? '工作日' : '节假日'}`,
    `更新时间：${updateTime}`
  ];
};

const ratingSortFn = (a: NCDPInfo, b: NCDPInfo) => {
  const rattingDiff =
    (RatingWeightMap.get(a.issuer_rating_current) ?? 0) - (RatingWeightMap.get(b.issuer_rating_current) ?? 0);
  if (rattingDiff !== 0) return rattingDiff;
  return b.price - a.price;
};

const getSortedNcdPInfos = (ncdPInfos: NCDPInfo[]) => {
  const oneM: NCDPInfo[] = [];
  const threeM: NCDPInfo[] = [];
  const sixM: NCDPInfo[] = [];
  const nineM: NCDPInfo[] = [];
  const oneY: NCDPInfo[] = [];
  const shibor: NCDPInfo[] = [];

  for (const ncdPInfo of ncdPInfos) {
    if (ncdPInfo.fr_type === FRType.Shibor) {
      shibor.push(ncdPInfo);
      continue;
    }
    switch (ncdPInfo.maturity_date) {
      case MaturityDateType.OneMonth:
        oneM.push(ncdPInfo);
        break;
      case MaturityDateType.ThreeMonth:
        threeM.push(ncdPInfo);
        break;
      case MaturityDateType.SixMonth:
        sixM.push(ncdPInfo);
        break;
      case MaturityDateType.NineMonth:
        nineM.push(ncdPInfo);
        break;
      case MaturityDateType.OneYear:
        oneY.push(ncdPInfo);
        break;
      default:
        break;
    }
  }
  return [
    oneM.sort(ratingSortFn),
    threeM.sort(ratingSortFn),
    sixM.sort(ratingSortFn),
    nineM.sort(ratingSortFn),
    oneY.sort(ratingSortFn),
    shibor.sort((a, b) => b.price - a.price)
  ];
};
const getNcdPInfosContent = (ncdpInfos: NCDPInfo[], issueMaturityCache: IssueMaturityCache) => {
  const result: string[] = [];
  const sortedNcdPInfo = getSortedNcdPInfos(ncdpInfos);

  for (const ncdPInfoList of sortedNcdPInfo) {
    if (ncdPInfoList.length) {
      if (result.length) {
        result.push(splitLine);
      }
      for (const ncdPInfo of ncdPInfoList) {
        result.push(getNcdPInfoCopyText(ncdPInfo));
      }
    }
  }
  if (ncdpInfos.length === 1) {
    return result;
  }
  return [...result, ...getNcdPInfoCopyAttentionText(issueMaturityCache)];
};

export const copyNcdPInfos = (ncdPInfos: NCDPInfo[], issueMaturityCache: IssueMaturityCache) => {
  const result = getNcdPInfosContent(ncdPInfos, issueMaturityCache);
  const copyContent = result.join('\n');
  window.Main.copy(copyContent);
};

export const copyNCDPByID = async (ncdpIdList: string[], issueMaturityCache?: IssueMaturityCache) => {
  await sleep(100);

  try {
    ncdpIdList = [...new Set(ncdpIdList)].filter(Boolean);
    const res = await mulFetchNCDP({ ncdp_id_list: ncdpIdList });
    if (res.ncdp_list && issueMaturityCache) {
      copyNcdPInfos(res.ncdp_list, issueMaturityCache);
    }
  } catch (err) {
    trackSpecialSlow('NCDP复制失败', err);
  }
};
