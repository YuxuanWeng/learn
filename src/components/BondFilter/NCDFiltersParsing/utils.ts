import { SERVER_NIL } from '@fepkg/common/constants';
import { InputFilter, RangeInteger } from '@fepkg/services/types/bds-common';
import { DateType } from '@fepkg/services/types/bds-enum';
import { ParsingNcdFilter } from '@fepkg/services/types/parsing/ncd-filter';
import { isEmpty, isEqual, uniq } from 'lodash-es';
import moment, { Moment } from 'moment';
import { parsingNCDFilter } from '@/common/services/api/parsing/ncd-filter';
import { IssuerCode, IssuerMapToBankType } from '@/common/services/hooks/useIssuerInstQuery';
import { RemainDaysSeasonLabel } from '@/common/types/remain-days';
import { getCurrentMoment, getMonthRemainDaysConfigMap, getTermRemainDaysConfigMap } from '@/common/utils/date';
import { BondIssueInfoFilterValue, GeneralFilterValue, RemainDaysType } from '@/components/BondFilter/types';
import { NCD_ISSUER_RATING_SET, getNCDRemainDaysConfigOptions } from '@/components/Filter/constants/options';
import { RangeInputValue } from '@/components/RangeInput';
import { formatGeneralFilter } from '@/pages/ProductPanel/providers/MainGroupProvider/utils';
import { TransformParsingDateResult } from './types';

const SECONDS_OF_DAY = 60 * 60 * 24;
const EMPTY = {
  code_market_list: [],
  inst_id_list: [],
  inst_name_list: [],
  inst_types: [],
  key_market_list: [],
  maturity_max: -1,
  maturity_max_type: -1,
  maturity_min: -1,
  maturity_min_type: -1,
  rating_list: []
};
const getRemainDaysStr = (num?: number, type?: DateType) => {
  if (!num || !type) return '';
  // @ts-expect-error 这里type服务端返回了-1，DateType枚举没有-1，前端兜底
  if (num === SERVER_NIL || type === SERVER_NIL) return '';
  switch (type) {
    case DateType.Day:
      return `${num}D`;
    case DateType.Month:
      // 如果识别出来是月
      return `${Math.ceil((moment().add(num, 'month').unix() - moment().unix()) / SECONDS_OF_DAY)}D`;
    case DateType.Year:
      return `${num}Y`;
    default:
      return num.toString();
  }
};
/**
 * 识别转换规则
 * 1. 识别结果类行为'天'，则转换后带单位：D
 * 2. 识别结果类型为'年'，转换后带单位：Y
 * 3. 识别结果为日期，转换成日期格式
 * 4. 识别结果为-1，表示没有识别出来
 * 5. 识别结果为0，表示无上/下限，也就是输入框中的内容为空
 * 6. 如果识别结果为'月'，则min取当月的第一天，max取当月的最后一天
 */
const transformParsingDate = (ncdFilter?: ParsingNcdFilter.NcdParsingFilter) => {
  const { maturity_min, maturity_min_type, maturity_max, maturity_max_type } = ncdFilter ?? {};
  let min: string | Moment | null = '';
  let max: string | Moment | null = '';
  let parsingType: 'date' | 'string' = 'string';
  // 识别类型为月，取当月的第一天和当月的最后一天，并且类型为日期
  if (maturity_min_type === maturity_max_type && maturity_max_type === DateType.Month) {
    parsingType = 'date';
    const { year } = getCurrentMoment();
    if (!maturity_min) {
      min = null;
    } else if (!maturity_max) {
      // eg: 3m以上
      // 如果 maturity_min 是 12月，则year+1，maturity_min = 1
      if (maturity_min === 12) {
        min = moment(`${year + 1}-1`, 'YYYY-MM').startOf('month');
      } else {
        min = moment(`${year}-${maturity_min + 1}`, 'YYYY-MM').startOf('month');
      }
    } else {
      min = moment(`${year}-${maturity_min}`, 'YYYY-MM').startOf('month');
    }

    if (!maturity_max) max = null;
    else max = moment(`${year}-${maturity_max}`, 'YYYY-MM').endOf('month');
  } else {
    min = getRemainDaysStr(maturity_min, maturity_min_type);
    max = getRemainDaysStr(maturity_max, maturity_max_type);
  }
  return { max, min, parsingType };
};
const SeasonMap = {
  1: RemainDaysSeasonLabel.Season_1,
  2: RemainDaysSeasonLabel.Season_2,
  3: RemainDaysSeasonLabel.Season_3,
  4: RemainDaysSeasonLabel.Season_4
};
const transformParsingWrapper = (ncdFilter?: ParsingNcdFilter.NcdParsingFilter) => {
  const { maturity_min, maturity_min_type, maturity_max, maturity_max_type, season } = ncdFilter ?? {};

  if (maturity_min === SERVER_NIL && maturity_max === SERVER_NIL) return undefined;
  if (maturity_min === undefined && maturity_max === undefined) return undefined;

  const options = new Set(getNCDRemainDaysConfigOptions(RemainDaysType.Term).map(v => v.label));
  const parseResult: TransformParsingDateResult = {
    remain_days_options_type: RemainDaysType.Term,
    remain_days_type: 'string',
    remain_days_list: [],
    remain_days_range: ['', '']
  };

  // 识别到季度
  if (season !== undefined) {
    parseResult.remain_days_options_type = RemainDaysType.Season;
    parseResult.remain_days_list = [SeasonMap[season]];
    return parseResult;
  }
  // 识别到月
  if (
    maturity_min_type === maturity_max_type &&
    (maturity_max_type === DateType.Month || maturity_max_type === DateType.Year)
  ) {
    const maturityMin = maturity_min_type === DateType.Year ? (maturity_min ?? 0) * 12 : maturity_min;
    const maturityMax = maturity_max_type === DateType.Year ? (maturity_max ?? 0) * 12 : maturity_max;

    // 匹配已有选项
    const terms = getTermRemainDaysConfigMap().filter(v => options.has(v.label));

    for (const v of terms) {
      if (v.match?.min === maturityMin && v.match?.max === maturityMax) {
        // 匹配到期限
        parseResult.remain_days_list = [v.label];
        return parseResult;
      }
    }
    const months = getMonthRemainDaysConfigMap();
    for (const v of months) {
      if (v.match?.min === maturityMin && v.match?.max === maturityMax) {
        // 匹配到月份
        parseResult.remain_days_options_type = RemainDaysType.Month;
        parseResult.remain_days_list = [v.label];
        return parseResult;
      }
    }
  }
  // 都没有匹配到，则填入日期/数字输入框
  const { min, max, parsingType } = transformParsingDate(ncdFilter) ?? {};
  parseResult.remain_days_range = [min, max] as RangeInputValue;
  parseResult.remain_days_type = parsingType;
  return parseResult;
};
export const getRecognizeResult = async (text: string) => {
  const { ncd_filter } = await parsingNCDFilter({ user_input: text });
  if (isEqual(ncd_filter, EMPTY)) {
    return { generalFilterValue: void 0, bondIssueInfoFilterValue: void 0, inputFilter: void 0 };
  }
  const { key_market_list, rating_list, inst_id_list, inst_types } = ncd_filter ?? {};

  const g: GeneralFilterValue = {};

  const transDate = transformParsingWrapper(ncd_filter);

  const ncd_subtype_list = inst_types?.map(v => IssuerMapToBankType[v as IssuerCode]) ?? [];

  if (ncd_subtype_list.length) g.ncd_subtype_list = ncd_subtype_list.filter(Boolean);

  /** 主体评级过滤掉不在筛选项中的评级 */
  const filterRatingList = rating_list?.filter(v => NCD_ISSUER_RATING_SET.has(v));

  if (filterRatingList?.length) g.issuer_rating_list = uniq(filterRatingList);

  if (transDate) {
    const { remain_days_options_type, remain_days_type, remain_days_list, remain_days_range } = transDate;
    g.remain_days_options_type = remain_days_options_type;
    g.remain_days_list = remain_days_list as RangeInteger[];
    g.remain_days_range = remain_days_range;
    g.remain_days_type = remain_days_type;
  }

  const b: BondIssueInfoFilterValue = {};

  if (inst_id_list?.length) b.issuer_id_list = inst_id_list;

  const i: InputFilter = {};

  if (key_market_list?.length) i.bond_key_list = key_market_list;

  return {
    generalFilterValue: isEmpty(g) ? undefined : formatGeneralFilter(g),
    bondIssueInfoFilterValue: isEmpty(b) ? undefined : b,
    inputFilter: isEmpty(i) ? undefined : i
  };
};
