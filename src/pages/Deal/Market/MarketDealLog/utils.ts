import { FRTypeShortMap, OperationSourceMap, OptionTypeStringMap } from '@fepkg/business/constants/map';
import { transform2DealTime } from '@fepkg/business/utils/deal';
import { transform2DateContent } from '@fepkg/common/utils/date';
import { MarketDealOperationLog } from '@fepkg/services/types/common';
import { Side } from '@fepkg/services/types/enum';
import { getComment, getSideInfo } from '@/common/services/api/market-deal/search';
import { getRestDayNum } from '@/common/utils/bond';
import { isNotIntentional } from '@/common/utils/quote-price';
import {
  transform2PriceContent,
  transform2RepaymentMethod,
  transform2ValModifiedDuration,
  transform2WeekendDay
} from '@/pages/ProductPanel/utils';
import { DealLogColumn } from './types';

export function getDealStatus(nothing_done: boolean) {
  if (nothing_done) {
    return 'Nothing Done';
  }
  return '正常';
}

export const transform2DealLogTableColumn = (original: MarketDealOperationLog): DealLogColumn => {
  const { bond_basic_info: bond_info, volume, deal_time, nothing_done } = original.market_deal_snapshot;
  const {
    rest_day_to_workday,
    mkt_type,
    maturity_date,
    fr_type,
    option_type,
    listed_date,
    repayment_method,
    val_modified_duration
  } = bond_info;

  const restDayNum = getRestDayNum(rest_day_to_workday);
  const listed = isNotIntentional(mkt_type);
  const weekendDay = transform2WeekendDay(maturity_date);
  const frType = fr_type != undefined ? FRTypeShortMap[fr_type] : '';
  const bondCode = bond_info.display_code;
  const volumeContent = transform2PriceContent(volume);
  const bidInfo = getSideInfo(Side.SideBid, original.market_deal_snapshot);
  const ofrInfo = getSideInfo(Side.SideOfr, original.market_deal_snapshot);
  const dealTime = transform2DealTime(deal_time);
  const optionType = option_type != undefined ? OptionTypeStringMap[option_type] ?? '' : '';
  const listedDate = transform2DateContent(listed_date);
  const repaymentMethod = transform2RepaymentMethod(repayment_method);
  const valModifiedDuration = transform2ValModifiedDuration(val_modified_duration);
  const comment = getComment(original.market_deal_snapshot);
  const operationSource = OperationSourceMap[original?.operation_source] ?? '';
  const dealStatus = getDealStatus(nothing_done);

  return {
    original,
    restDayNum,
    bondCode,
    listed,
    frType,
    weekendDay,
    volume: volumeContent,
    dealTime,
    bidInfo,
    ofrInfo,
    optionType,
    listedDate,
    repaymentMethod,
    valModifiedDuration,
    comment,
    operationSource,
    dealStatus
  };
};
