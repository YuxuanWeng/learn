import cx from 'classnames';
import { FRTypeShortMap, OptionTypeStringMap } from '@fepkg/business/constants/map';
import { hasOption } from '@fepkg/business/utils/bond';
import { transform2DateContent } from '@fepkg/common/utils/date';
import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import type { BondQuoteSearch } from '@fepkg/services/types/bond-quote/search';
import { BondQuote, FiccBondBasic, QuoteLite } from '@fepkg/services/types/common';
import axios from 'axios';
import { uniqBy } from 'lodash-es';
import moment from 'moment';
import request from '@/common/request';
import { getRestDayNum } from '@/common/utils/bond';
import { formatLiquidationSpeedListToString } from '@/common/utils/liq-speed';
import { logDataError } from '@/common/utils/logger/data';
import { isNotIntentional } from '@/common/utils/quote-price';
import { Exercise, Maturity } from '@/components/Quote/types';
import { getCommentFlagLabel, getCommentTagLabel } from '@/components/Quote/utils';
import { CommentInputFlagValue } from '@/components/business/CommentInput';
import { BasicTableColumn } from '@/pages/ProductPanel/components/BasicTable/types';
import {
  transform2ConversionRate,
  transform2PVBP,
  transform2PriceContent,
  transform2RepaymentMethod,
  transform2SpreadContent,
  transform2ValModifiedDuration,
  transform2WeekendDay
} from '@/pages/ProductPanel/utils';

export type GetCommentParams = {
  comment: string;
  flag_bilateral?: boolean;
  flag_indivisible?: boolean;
  flag_request?: boolean;
  flag_stock_exchange?: boolean;
  is_exercise?: boolean;
  exercise_manual?: boolean;
  has_option?: boolean;
  option_type?: string;
};

export const formatComment = ({
  comment,
  flag_bilateral = false,
  flag_indivisible = false,
  flag_request = false,
  flag_stock_exchange = false,
  is_exercise,
  exercise_manual,
  has_option,
  option_type
}: GetCommentParams) => {
  const flagValue: CommentInputFlagValue = { flag_stock_exchange, flag_bilateral, flag_request, flag_indivisible };

  let res = '';
  if (exercise_manual && hasOption({ has_option, option_type })) {
    if (is_exercise) res = Exercise.label + res;
    else res = Maturity.label + res;
  }

  res = getCommentFlagLabel(flagValue) + (res ? ` ${res}` : res) + (comment ? ` ${comment}` : comment);

  return res;
};

/** 转换备注的内容 */
export const transform2CommentContent = (
  {
    liquidation_speed_list,
    comment,
    flag_bilateral = false,
    flag_indivisible = false,
    flag_request = false,
    flag_stock_exchange = false,
    is_exercise, // 是否行权
    exercise_manual, // 是否手动操作行权
    flag_oco,
    flag_sustained_volume, // 续量
    flag_package
  }: QuoteLite | BondQuote,
  bond_info?: Partial<FiccBondBasic>
) => {
  let res = '';
  if (liquidation_speed_list) {
    res = formatLiquidationSpeedListToString(liquidation_speed_list, 'MM.DD');
  }

  const flagLabel = formatComment({
    comment,
    flag_bilateral,
    flag_indivisible,
    flag_request,
    flag_stock_exchange,
    is_exercise,
    exercise_manual,
    has_option: bond_info?.has_option,
    option_type: bond_info?.option_type
  });

  const tagComment = getCommentTagLabel({ flag_oco, flag_package });

  if (flagLabel) {
    if (res) res = `${res};${flagLabel}`;
    else res = flagLabel;
  }
  if (tagComment) res += ` ${tagComment}`;

  // 如果是续量，就在备注后面加上续量
  if (flag_sustained_volume) res += '续量';

  return res;
};

export const transform2BasicTableColumn = (original: QuoteLite): BasicTableColumn => {
  const {
    bond_basic_info,
    volume,
    broker_info,
    full_price,
    clean_price,
    spread,
    operator_id,
    operator_info,
    inst_info,
    trader_info,
    create_time,
    update_time,
    refer_time
  } = original;

  const recommendCls = cx(original.flag_recommend && 'bg-orange-500');
  const restDayNum = getRestDayNum(bond_basic_info?.rest_day_to_workday);
  const listed = isNotIntentional(bond_basic_info?.mkt_type);
  const weekendDay = transform2WeekendDay(bond_basic_info?.maturity_date);
  const frType = bond_basic_info?.fr_type != undefined ? FRTypeShortMap[bond_basic_info.fr_type] : '';
  const bondCode = bond_basic_info?.display_code ?? '';
  const volumeContent = transform2PriceContent(volume);
  const brokerId = broker_info?.broker_id ?? '';
  const brokerName = broker_info?.name_zh ?? '';
  const updateTime = transform2DateContent(update_time, 'HH:mm:ss');
  const comment = transform2CommentContent(original, bond_basic_info);
  const instName = inst_info?.short_name_zh ?? '';
  const traderId = trader_info?.trader_id ?? '';
  const traderName = trader_info?.name_zh ?? '';
  let cp = instName;
  if (traderName) cp += `(${traderName})`;

  const fullPrice = transform2PriceContent(full_price, true);
  const cleanPrice = transform2PriceContent(clean_price, true);
  const spreadContent = transform2SpreadContent(spread, bond_basic_info?.fr_type, original?.yield);
  // const optionType = bond_basic_info?.option_type != undefined ? optionTypeMap.get(bond_basic_info.option_type) : '';
  const optionType = bond_basic_info?.option_type != undefined ? OptionTypeStringMap[bond_basic_info.option_type] : '';
  const listedDate = transform2DateContent(bond_basic_info?.listed_date);
  const repaymentMethod = transform2RepaymentMethod(bond_basic_info?.repayment_method);
  const valModifiedDuration = transform2ValModifiedDuration(bond_basic_info?.val_modified_duration);
  // 如果拿不到 operator_info?.account，就取 operator_id，这个 operator_id 有可能为 IDB 或 SYS
  const operatorName = operator_info?.name_zh ?? operator_id ?? '';
  const createTime = transform2DateContent(create_time, 'MM-DD');
  const conversionRate = transform2ConversionRate(bond_basic_info?.conversion_rate);
  const maturityDate = transform2DateContent(bond_basic_info?.maturity_date);

  const referTimeFormatter = refer_time && moment().isSame(+refer_time, 'day') ? 'HH:mm:ss' : 'MM-DD HH:mm:ss';
  const referTime = transform2DateContent(refer_time, referTimeFormatter);

  const pvbp = transform2PVBP(bond_basic_info?.val_basis_point_value);

  return {
    original,
    recommendCls,
    restDayNum,
    listed,
    weekendDay,
    frType,
    bondCode,
    volume: volumeContent,
    brokerId,
    brokerName,
    updateTime,
    comment,
    instName,
    traderId,
    traderName,
    cp,
    fullPrice,
    cleanPrice,
    spread: spreadContent,
    optionType: optionType ?? '',
    listedDate,
    repaymentMethod,
    valModifiedDuration,
    operatorName,
    createTime,
    conversionRate,
    maturityDate,
    referTime,
    pvbp
  };
};

export type FetchBondQuoteParams = {
  /** 筛选项 */
  params: BondQuoteSearch.Request;
  /** 筛选项是否发生了变化 */
  paramsChanged?: boolean;
  /** requestConfig request 配置项 */
  requestConfig?: RequestConfig;
};

/**
 * @description 通过筛选条件获取报价
 * @url /api/v1/bdm/bds/bds_api/bond_quote/search
 */
export const fetchBondQuote = async ({ params, paramsChanged = true, requestConfig }: FetchBondQuoteParams) => {
  const api = APIs.bondQuote.search;

  let traceId = '';
  try {
    const {
      quote_list = [],
      total,
      base_response
    } = await request.post<BondQuoteSearch.Response>(api, params, requestConfig);
    traceId = base_response?.trace_id ?? '';

    const uniqQuotes = uniqBy(quote_list, 'quote_id');
    // 如果有重复数据
    if (uniqQuotes.length !== quote_list.length) {
      logDataError({ api, logName: 'data-duplication', traceId });
    }

    /** Bond Info 不为空对象总数 */
    const bondInfoTotal = uniqQuotes?.filter(
      ({ bond_basic_info }) => !!bond_basic_info && Object.keys(bond_basic_info).length > 0
    ).length;
    // 如果 Bond Info 的总数与返回的列表数量不相等，说明有返回了空的 BondInfo
    if (bondInfoTotal !== quote_list.length) {
      logDataError({ api, logName: 'bond-info-null', traceId });
    }

    return {
      list: uniqQuotes.map(transform2BasicTableColumn),
      total
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logDataError({ api, logName: 'request-fail', traceId, error });
    } else {
      logDataError({ api, logName: 'transform-fail', traceId, error });
    }

    // 如果筛选项发生了变化，无论发生什么错误，清空 UI 列表
    if (paramsChanged) {
      return { list: [], total: 0 };
    }

    // 反之，无论发生什么错误，不清空 UI 列表
    throw new Error('fetchBondQuote has error but params not changed.');
  }
};
