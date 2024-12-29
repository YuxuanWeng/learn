import cx from 'classnames';
import { FRTypeShortMap, OptionTypeMap, OptionTypeStringMap } from '@fepkg/business/constants/map';
import { transform2DateContent } from '@fepkg/common/utils/date';
import { BondQuoteOperationLog } from '@fepkg/services/types/common';
import { transform2CommentContent } from '@/common/services/api/bond-quote/search';
import { getRestDayNum } from '@/common/utils/bond';
import { isNotIntentional } from '@/common/utils/quote-price';
import { BasicTableColumn } from '@/pages/ProductPanel/components/BasicTable/types';
import {
  transform2PriceContent,
  transform2RepaymentMethod,
  transform2SpreadContent,
  transform2ValModifiedDuration,
  transform2WeekendDay
} from '../../ProductPanel/utils';

export type OperationLogContext = {
  /** 窗口打开时间戳 */
  timestamp?: number;
  quoteId?: string;
  keyMarket?: string;
};

export type OperationLogColumn = Pick<
  BasicTableColumn,
  | 'recommendCls'
  | 'restDayNum'
  | 'listed'
  | 'weekendDay'
  | 'frType'
  | 'volume'
  | 'comment'
  | 'brokerName'
  | 'updateTime'
  | 'instName'
  | 'traderName'
  | 'cp'
  | 'fullPrice'
  | 'cleanPrice'
  | 'spread'
  | 'optionType'
  | 'listedDate'
  | 'repaymentMethod'
  | 'valModifiedDuration'
  | 'createTime'
  | 'maturityDate'
> & {
  /** 原始接口数据 */
  original: BondQuoteOperationLog;
  /** 展示的债券代码 */
  codeMarket: string;
};

export const transform2OperationLogTableColumn = (original: BondQuoteOperationLog): OperationLogColumn => {
  const {
    volume,
    full_price,
    clean_price,
    spread,
    update_time,
    listed_date,
    maturity_date,
    fr_type,
    trader_name,
    flag_recommend,
    repayment_method,
    broker_name,
    val_modified_duration,
    trader_tag,
    option_type_val,
    inst_short_name_zh,
    rest_day_to_workday,
    mkt_type,
    bond_display_code,
    bond_code
  } = original.quote_snapshot;

  const recommendCls = cx(flag_recommend && 'bg-orange-500');
  const restDayNum = getRestDayNum(rest_day_to_workday);
  const listed = isNotIntentional(mkt_type);
  const weekendDay = transform2WeekendDay(maturity_date);
  const frType = fr_type != undefined ? FRTypeShortMap[fr_type] : '';
  const volumeContent = transform2PriceContent(volume);
  const brokerName = broker_name ?? '';
  const updateTime = transform2DateContent(update_time, 'HH:mm:ss');
  const comment = transform2CommentContent(original.quote_snapshot, {
    has_option: original.quote_snapshot.has_option,
    option_type: original.quote_snapshot.option_type
  });
  const instName = inst_short_name_zh ?? '';

  const traderName = trader_name ?? '';
  const traderTag = trader_tag ?? '';
  let cp = instName;
  if (traderName) cp += `(${traderName}${traderTag})`;

  const fullPrice = transform2PriceContent(full_price, true);
  const cleanPrice = transform2PriceContent(clean_price, true);
  const spreadContent = transform2SpreadContent(spread, fr_type, original.quote_snapshot.yield);
  const optionType = option_type_val != undefined ? OptionTypeStringMap[OptionTypeMap[option_type_val]] : '';
  const listedDate = transform2DateContent(listed_date);
  const repaymentMethod = transform2RepaymentMethod(repayment_method);
  const valModifiedDuration = transform2ValModifiedDuration(val_modified_duration);
  const createTime = transform2DateContent(original.create_time, 'YYYY-MM-DD HH:mm:ss.SSS');
  const maturityDate = transform2DateContent(maturity_date);
  const codeMarket = bond_display_code ?? bond_code;

  return {
    original,
    recommendCls,
    restDayNum,
    listed,
    weekendDay,
    frType,
    volume: volumeContent,
    brokerName,
    updateTime,
    createTime,
    comment,
    instName,
    traderName,
    cp,
    fullPrice,
    cleanPrice,
    spread: spreadContent,
    optionType,
    listedDate,
    repaymentMethod,
    valModifiedDuration,
    maturityDate,
    codeMarket
  };
};
