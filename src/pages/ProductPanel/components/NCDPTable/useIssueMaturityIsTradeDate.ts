import { getNextTradedDate } from '@fepkg/business/hooks/useDealDateMutation';
import { DEAL_TRADED_DATE_RANGE, useTradedDateRange } from '@fepkg/business/hooks/useTradedDateRange';
import { WeekdayItem } from '@fepkg/services/types/bds-common';
import { QueryFunction, useQuery } from '@tanstack/react-query';
import { useMemoizedFn } from 'ahooks';
import moment from 'moment';
import { mulFetchNextWeekday } from '@/common/services/api/base-data/next-weekday-mul-get';
import { IssueMaturityCache } from './types';

export const useIssueMaturityIsTradeDate = () => {
  const [tradeDateRange] = useTradedDateRange(...DEAL_TRADED_DATE_RANGE);

  const queryFn: QueryFunction<IssueMaturityCache | undefined> = useMemoizedFn(async () => {
    if (!tradeDateRange.length) return void 0;
    const nextTradedDate = getNextTradedDate();
    const tomorrow = moment(nextTradedDate).startOf('day');
    const tomorrowDate = getNextTradedDate(nextTradedDate);
    const tomorrowPlus1 = moment(tomorrowDate).startOf('day');
    const oneM = tomorrowPlus1.clone().add(1, 'month');
    const threeM = tomorrowPlus1.clone().add(3, 'month');
    const sixM = tomorrowPlus1.clone().add(6, 'month');
    const nineM = tomorrowPlus1.clone().add(9, 'month');
    const oneY = tomorrowPlus1.clone().add(1, 'year');

    const date_list: WeekdayItem[] = [
      { target_date: oneM.valueOf().toString(), with_today: true },
      { target_date: threeM.valueOf().toString(), with_today: true },
      { target_date: sixM.valueOf().toString(), with_today: true },
      { target_date: nineM.valueOf().toString(), with_today: true },
      { target_date: oneY.valueOf().toString(), with_today: true }
    ];

    const response = await mulFetchNextWeekday({ date_list });

    return {
      tomorrow: `${tomorrow.format('YYYY-MM-DD')}（${tomorrow.format('ddd')}）`,
      tomorrowPlus1: `${tomorrowPlus1.format('YYYY-MM-DD')}（${tomorrowPlus1.format('ddd')}）`,
      oneM: {
        date: `${oneM.format('YYYY-MM-DD')} ${oneM.format('ddd')}`,
        isTradeDate: response.next_weekday_list?.at(0) === oneM.valueOf().toString()
      },
      threeM: {
        date: `${threeM.format('YYYY-MM-DD')} ${threeM.format('ddd')}`,
        isTradeDate: response.next_weekday_list?.at(1) === threeM.valueOf().toString()
      },
      sixM: {
        date: `${sixM.format('YYYY-MM-DD')} ${sixM.format('ddd')}`,
        isTradeDate: response.next_weekday_list?.at(2) === sixM.valueOf().toString()
      },
      nineM: {
        date: `${nineM.format('YYYY-MM-DD')} ${nineM.format('ddd')}`,
        isTradeDate: response.next_weekday_list?.at(3) === nineM.valueOf().toString()
      },
      oneY: {
        date: `${oneY.format('YYYY-MM-DD')} ${oneY.format('ddd')}`,
        isTradeDate: response.next_weekday_list?.at(4) === oneY.valueOf().toString()
      }
    };
  });

  const query = useQuery({
    queryKey: ['IssueMaturityIsTradeDate'],
    queryFn,
    enabled: !!tradeDateRange.length,
    notifyOnChangeProps: ['data'],
    retry: true
  });

  return query.data;
};
