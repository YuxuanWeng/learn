import { getNextTradedDate } from '@fepkg/business/hooks/useDealDateMutation';
import { MaturityDateType } from '@fepkg/services/types/enum';
import moment, { Moment } from 'moment';

/**
 * 1. 计划发行日是明天
 * 2. 缴款/起息日是后天
 * 3. 上市日是大后天(后天+1)
 * 4. 期限日期的计算是(缴款/起息日)加期限月份，不用考虑节假日
 * 5. 例如：今天是2023-01-01，发行日2023-01-02，缴款起息日2023-01-03，上市日2023-01-04
 * 5. 1M是2023-02-02
 * @returns 返回报表日期信息
 */
export const useDateInfo = () => {
  // 发行日
  const issueDate = getNextTradedDate();
  // 缴款/起息日
  const interestStartDate = getNextTradedDate(issueDate);
  // 上市日
  const listedDate = getNextTradedDate(interestStartDate);

  const date = moment(interestStartDate);
  // 期限
  const maturityDate: Record<MaturityDateType, Moment> = {
    [MaturityDateType.MaturityDateTypeNone]: date,
    [MaturityDateType.OneMonth]: date.clone().add(1, 'M'),
    [MaturityDateType.ThreeMonth]: date.clone().add(3, 'M'),
    [MaturityDateType.SixMonth]: date.clone().add(6, 'M'),
    [MaturityDateType.NineMonth]: date.clone().add(9, 'M'),
    [MaturityDateType.OneYear]: date.clone().add(1, 'y')
  };

  const dateInfoList = [
    { label: '计划发行日', value: issueDate },
    { label: '缴款/起息日', value: interestStartDate },
    { label: '上市日', value: listedDate }
  ];

  const maturityDateList = [
    ['期限', '到期日', '星期'],
    [
      '1M',
      maturityDate[MaturityDateType.OneMonth].format('YYYY-MM-DD'),
      maturityDate[MaturityDateType.OneMonth].format('ddd')
    ],
    [
      '3M',
      maturityDate[MaturityDateType.ThreeMonth].format('YYYY-MM-DD'),
      maturityDate[MaturityDateType.ThreeMonth].format('ddd')
    ],
    [
      '6M',
      maturityDate[MaturityDateType.SixMonth].format('YYYY-MM-DD'),
      maturityDate[MaturityDateType.SixMonth].format('ddd')
    ],
    [
      '9M',
      maturityDate[MaturityDateType.NineMonth].format('YYYY-MM-DD'),
      maturityDate[MaturityDateType.NineMonth].format('ddd')
    ],
    [
      '1Y',
      maturityDate[MaturityDateType.OneYear].format('YYYY-MM-DD'),
      maturityDate[MaturityDateType.OneYear].format('ddd')
    ]
  ];

  return { dateInfoList, maturityDate, maturityDateList };
};
