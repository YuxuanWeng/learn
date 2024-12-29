import { SelectOption } from '@fepkg/components/Select';
import type { Moment, MomentInput } from 'moment';
import moment from 'moment';
import { RemainDaysType } from '@/components/BondFilter/types';
import {
  NCD_REMAIN_DAYS_MONTH_CONFIG_OPTIONS,
  NCD_REMAIN_DAYS_SEASON_CONFIG_OPTIONS
} from '@/components/Filter/constants/options';
import { FilterConfigOption, RangeConfigItemValue } from '@/components/Filter/types';
import { RangeInputValue } from '@/components/RangeInput';
import { RemainDaysTermLabel } from '../types/remain-days';

const SECONDS_OF_DAY = 60 * 60 * 24;
const DAYS_OF_YEAR = 365;

/** 公式法，只有周六周日为非工作日 */
export const getNextWeekday = (current: MomentInput, dayOfWeek = 0): Moment => {
  const curr = moment(current);
  const weekday = curr.isoWeekday();
  let dw = dayOfWeek % 7;
  if (!dw && dayOfWeek > 0) dw = 7;

  let offset: number;
  if (dw > 0) {
    // 明确指定了下一个星期几
    offset = dayOfWeek - weekday;
    if (dayOfWeek <= weekday) offset += 7;
  } else {
    // 下一个有效工作日
    switch (weekday) {
      case 5:
        offset = 3;
        break;
      case 6:
        offset = 2;
        break;
      default:
        offset = 1;
        break;
    }
  }
  return curr.add(offset, 'days');
};

const getLaterDays = (preUnix: number, laterUnix: number) => {
  return Math.ceil((laterUnix - preUnix) / SECONDS_OF_DAY);
};

/** 期限 */
export const getTermRemainDaysConfigMap = () => {
  const config: FilterConfigOption<RangeConfigItemValue>[] = [];
  let item: FilterConfigOption<RangeConfigItemValue> = {
    label: '',
    value: { min: 0, max: 0 },
    match: { min: -1, max: -1 }
  };

  // 1M
  const oneMonthsUnix = moment().add(1, 'months').unix();
  const oneMonthsDays = getLaterDays(moment().unix(), oneMonthsUnix);
  item = {
    label: RemainDaysTermLabel.M_1,
    value: { min: oneMonthsDays, max: oneMonthsDays },
    match: { min: 1, max: 1 }
  };
  config.push(item);

  // 3M
  const threeMonthsUnix = moment().add(3, 'months').unix();
  const threeMonthsDays = getLaterDays(moment().unix(), threeMonthsUnix);
  item = {
    label: RemainDaysTermLabel.M_3,
    value: { min: threeMonthsDays, max: threeMonthsDays },
    match: { min: 3, max: 3 }
  };
  config.push(item);

  // 6M
  const sixMonthsUnix = moment().add(6, 'months').unix();
  const sixMonthsDays = getLaterDays(moment().unix(), sixMonthsUnix);
  item = {
    label: RemainDaysTermLabel.M_6,
    value: { min: sixMonthsDays, max: sixMonthsDays },
    match: { min: 6, max: 6 }
  };
  config.push(item);

  // 9M
  const nineMonthsUnix = moment().add(9, 'months').unix();
  const nineMonthsDays = getLaterDays(moment().unix(), nineMonthsUnix);
  item = {
    label: RemainDaysTermLabel.M_9,
    value: { min: nineMonthsDays, max: nineMonthsDays },
    match: { min: 9, max: 9 }
  };
  config.push(item);

  // 1Y
  const oneYearUnix = moment().add(9, 'months').unix();
  const oneYearDays = getLaterDays(moment().unix(), oneYearUnix);
  item = { label: RemainDaysTermLabel.Y_1, value: { min: oneYearDays, max: oneYearDays }, match: { min: 12, max: 12 } };
  config.push(item);

  // <3M
  const threeMonthsLaterUnix = moment().add(3, 'months').unix();
  const threeMonthsLaterDays = getLaterDays(moment().unix(), threeMonthsLaterUnix);
  item = {
    label: RemainDaysTermLabel.M_0_3,
    value: { min: 0, max: threeMonthsLaterDays },
    match: { min: 0, max: 3 }
  };
  config.push(item);

  // 3~6M
  const sixMonthsLaterUnix = moment().add(6, 'months').unix();
  const sixMonthsLaterDays = getLaterDays(moment().unix(), sixMonthsLaterUnix);
  item = {
    label: RemainDaysTermLabel.M_3_6,
    value: { min: threeMonthsLaterDays, max: sixMonthsLaterDays },
    match: { min: 3, max: 6 }
  };
  config.push(item);

  // 6~9M
  const nineMonthsLaterUnix = moment().add(9, 'months').unix();
  const nineMonthsLaterDays = getLaterDays(moment().unix(), nineMonthsLaterUnix);
  item = {
    label: RemainDaysTermLabel.M_6_9,
    value: { min: sixMonthsLaterDays, max: nineMonthsLaterDays },
    match: { min: 6, max: 9 }
  };
  config.push(item);

  // 9~12M
  const twelveMonthsLaterUnix = moment().add(12, 'months').unix();
  const twelveMonthsLaterDays = getLaterDays(moment().unix(), twelveMonthsLaterUnix);
  item = {
    label: RemainDaysTermLabel.M_9_12,
    value: { min: nineMonthsLaterDays, max: twelveMonthsLaterDays },
    match: { min: 9, max: 12 }
  };
  config.push(item);

  // 1~2Y
  const twoYearsLaterUnix = moment().add(2, 'years').unix();
  const twoYearsLaterDays = getLaterDays(moment().unix(), twoYearsLaterUnix);
  item = {
    label: RemainDaysTermLabel.Y_1_2,
    value: { min: twelveMonthsLaterDays, max: twoYearsLaterDays },
    match: { min: 12, max: 24 }
  };
  config.push(item);

  // >2Y
  item = { label: RemainDaysTermLabel.Y_2_E, value: { min: twoYearsLaterDays }, match: { min: 24, max: 0 } };
  config.push(item);

  // 2~3Y
  const threeYearsLaterUnix = moment().add(3, 'years').unix();
  const threeYearsLaterDays = getLaterDays(moment().unix(), threeYearsLaterUnix);
  item = {
    label: RemainDaysTermLabel.Y_2_3,
    value: { min: twoYearsLaterDays, max: threeYearsLaterDays },
    match: { min: 24, max: 36 }
  };
  config.push(item);

  // 3~4Y
  const fourYearsLaterUnix = moment().add(4, 'years').unix();
  const fourYearsLaterDays = getLaterDays(moment().unix(), fourYearsLaterUnix);
  item = {
    label: RemainDaysTermLabel.Y_3_4,
    value: { min: threeYearsLaterDays, max: fourYearsLaterDays },
    match: { min: 36, max: 48 }
  };
  config.push(item);

  // 4~5Y
  const fiveYearsLaterUnix = moment().add(5, 'years').unix();
  const fiveYearsLaterDays = getLaterDays(moment().unix(), fiveYearsLaterUnix);
  item = {
    label: RemainDaysTermLabel.Y_4_5,
    value: { min: fourYearsLaterDays, max: fiveYearsLaterDays },
    match: { min: 48, max: 60 }
  };
  config.push(item);

  // 5~10Y
  const tenYearsLaterUnix = moment().add(10, 'years').unix();
  const tenYearsLaterDays = getLaterDays(moment().unix(), tenYearsLaterUnix);
  item = {
    label: RemainDaysTermLabel.Y_5_10,
    value: { min: fiveYearsLaterDays, max: tenYearsLaterDays },
    match: { min: 60, max: 120 }
  };
  config.push(item);

  // >10Y
  item = { label: RemainDaysTermLabel.Y_10_E, value: { min: tenYearsLaterDays }, match: { min: 120, max: 0 } };
  config.push(item);

  return config;
};

export const getCurrentMoment = () => {
  const day = moment().date();
  const month = Number(moment().format('M'));
  const year = Number(moment().format('Y'));
  const daysInMonth = moment(`${year}-${month}`, 'YYYY-MM').daysInMonth();
  return { day, month, year, daysInMonth };
};

/** 获取当年当月有多少天 */
const getDaysInMonth = (year: number, month: number) => moment(`${year}-${month}`, 'YYYY-MM').daysInMonth();

/** 月份 */
export const getMonthRemainDaysConfigMap = () => {
  const { day: currDay, year: currYear, month: currMonth, daysInMonth: currDaysInMonth } = getCurrentMoment();
  const config: FilterConfigOption<RangeConfigItemValue>[] = [];

  for (const [index, v] of NCD_REMAIN_DAYS_MONTH_CONFIG_OPTIONS.entries()) {
    const selectedMonth = index + 1;

    const item: FilterConfigOption<RangeConfigItemValue> = {
      label: v.label,
      value: { min: 0, max: 0 },
      match: { min: selectedMonth, max: selectedMonth }
    };

    /**
     * 当前月 |所选月| 计算方式
     *  5.9  |  4  | max: 5(31-9)+6(30)+7(31)+8(31)+9(30)+10(31)+11(30)+12(31)+1(31)+2(29|28)+3(31)+4(30) + 1 = 358; min: max - 4(30) = 328
     *  5.9  |  6  | max: 5(31-9) + 6(30) + 1 = 53  min: max - 6(30) = 23
     */

    const isNextYearMonth = currMonth > selectedMonth; // 筛选的月份已过本年
    const daysInMonth: number[] = [];

    let min = 0;

    if (currMonth === selectedMonth) {
      // 选中本月
      item.value.min = 0;
      item.value.max = currDaysInMonth - currDay + 1;
      config.push(item);
      continue;
    }

    min += currDaysInMonth - currDay;
    const maxForLength = isNextYearMonth ? 12 : selectedMonth;

    // 本年
    for (let i = currMonth + 1; i <= maxForLength; i++) daysInMonth.push(getDaysInMonth(currYear, i));

    // 如果筛选的月份已经过了，则需要找到下一年的该月的min和max
    if (isNextYearMonth) {
      // 下一年
      for (let i = 1; i <= selectedMonth; i++) daysInMonth.push(getDaysInMonth(currYear + 1, i));
    }

    min += daysInMonth.slice(0, -1).reduce((acc, curr) => acc + curr, 0);
    const max = min + (daysInMonth.at(-1) ?? 0);

    item.value.min = Math.max(0, min + 1);
    item.value.max = Math.max(0, max + 1);
    config.push(item);
  }
  return config;
};

/** 季度区间 */
const SeasonRange: { [key: number]: [number, number, number] } = {
  1: [1, 2, 3],
  2: [4, 5, 6],
  3: [7, 8, 9],
  4: [10, 11, 12]
};

/** 季度 */
export const getQuarterRemainDaysConfigMap = () => {
  const months = getMonthRemainDaysConfigMap();
  const config: FilterConfigOption<RangeConfigItemValue>[] = [];
  for (const v of NCD_REMAIN_DAYS_SEASON_CONFIG_OPTIONS) {
    // 当前季度的三个月
    const [first, _, third] = SeasonRange[v.season];
    const item: FilterConfigOption<RangeConfigItemValue> = {
      label: v.label,
      value: { min: 0, max: 0 },
      match: { min: first, max: third }
    };

    item.value.min = months[first - 1].value.min;
    item.value.max = months[third - 1].value.max;
    config.push(item);
  }
  return config;
};

const getConfigFuncMap: { [key in RemainDaysType]: () => FilterConfigOption<RangeConfigItemValue>[] } = {
  [RemainDaysType.Term]: getTermRemainDaysConfigMap,
  [RemainDaysType.Month]: getMonthRemainDaysConfigMap,
  [RemainDaysType.Season]: getQuarterRemainDaysConfigMap
};

export const transformRemainDaysConfig = (value: string, optionType = RemainDaysType.Term) => {
  const configs = getConfigFuncMap[optionType]();
  return configs.find(v => v.label === value)?.value;
};

/**
 * @description 获取目标年份至今所有年份的配置项
 */
export const getYearConfig = (target = 1998) => {
  const current = moment();
  const currentYear = current.year();

  const config: SelectOption<number>[] = [{ label: currentYear.toString(), value: currentYear }];

  if (currentYear > target) {
    let lastYear = currentYear - 1;
    while (lastYear >= target) {
      config.push({ label: lastYear.toString(), value: lastYear });
      lastYear -= 1;
    }
  } else if (currentYear <= target) {
    let nextYear = currentYear + 1;
    while (nextYear !== target) {
      config.push({ label: nextYear.toString(), value: nextYear });
      nextYear += 1;
    }
  }

  return config;
};

/**
 * @description 根据输入的日期或者字符串，获取距当前天数
 */
export const transformDaysWithDate = (v: RangeInputValue, t: 'date' | 'string'): { min?: number; max?: number } => {
  let min: undefined | number;
  let max: undefined | number;
  if (t === 'string') {
    const v0 = v[0] as string;
    const v1 = v[1] as string;

    const offset0 = /[DYdy|]$/.test(v0) ? Number(v0.slice(0, Math.max(0, v0.length - 1))) : Number(v0);
    const offset1 = /[DYdy|]$/.test(v1) ? Number(v1.slice(0, Math.max(0, v1.length - 1))) : Number(v1);

    if (/[Yy|]$/.test(v0)) {
      if (offset0 % 1 === 0) min = moment().add(offset0, 'years').unix();
      else min = offset0 * DAYS_OF_YEAR * SECONDS_OF_DAY + moment().unix();
    } else min = moment().add(Math.ceil(offset0), 'days').unix();

    if (/[Yy|]$/.test(v1)) {
      if (offset1 % 1 === 0) max = moment().add(offset1, 'years').unix();
      else max = offset1 * DAYS_OF_YEAR * SECONDS_OF_DAY + moment().unix();
    } else max = moment().add(Math.ceil(offset1), 'days').unix();

    min = Math.ceil((min - moment().unix()) / SECONDS_OF_DAY);
    max = Math.ceil((max - moment().unix()) / SECONDS_OF_DAY);
  } else {
    min = Math.ceil((moment(v[0]).unix() - moment().unix()) / SECONDS_OF_DAY);
    max = Math.ceil((moment(v[1]).unix() - moment().unix()) / SECONDS_OF_DAY);
  }

  if (!v[0]) min = undefined;
  if (!v[1]) max = undefined;

  return { min, max };
};

/** 判断两个moment是不是同一天 */
export const isEqualWithMomentOfDay = (pre: Moment, next: Moment) => {
  return pre.startOf('day').valueOf() === next.startOf('day').valueOf();
};
