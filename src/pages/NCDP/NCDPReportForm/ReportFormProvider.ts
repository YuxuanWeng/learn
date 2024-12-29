import { useMemo } from 'react';
import { NCDPInfo } from '@fepkg/services/types/bds-common';
import { FRType, Rating } from '@fepkg/services/types/bds-enum';
import { cloneDeep, isEqual } from 'lodash-es';
import { createContainer } from 'unstated-next';
import { BankRowMap, RatingColMap } from './constants';
import { useFullNCDPInfoQuery } from './useFullNCDPInfoQuery';

type Item = { name: string; price: string; volume: string };

const tempList: { title: string; children: Item[][] }[] = [
  { title: '国有大行', children: [] },
  { title: '国有股份制', children: [] },
  { title: '其他AAA', children: [] },
  { title: 'AA+', children: [] },
  { title: 'AA', children: [] },
  { title: 'AA-', children: [] },
  { title: 'A+', children: [] },
  { title: 'A及以下', children: [] }
];

/** 浮息表格排序逻辑 */
const sortShiBor = (a: NCDPInfo, b: NCDPInfo): number => {
  // 优先比较期限，由近到远，期限枚举越小的越近
  if (a.maturity_date !== b.maturity_date) return a.maturity_date - b.maturity_date;
  // 若期限一致，则比较评级，由高到低，评级枚举越小的越高
  // 「其他」除外，如果评级是「其他」则需要排到最后一个
  if (a.issuer_rating_current === Rating.OtherIssuerRating) return 1;
  if (b.issuer_rating_current === Rating.OtherIssuerRating) return -1;
  return a.issuer_rating_current - b.issuer_rating_current;
};

const ReportFormContainer = createContainer(() => {
  // 请求全量的NCDP数据
  const { data: infoData } = useFullNCDPInfoQuery();

  /** 渲染用的数据 */
  const data = useMemo(() => {
    const newData = cloneDeep(tempList);
    const shiBorList: NCDPInfo[] = [];
    const dataList = infoData?.list ?? [];

    for (const { original } of dataList) {
      // 为什么要-1，因为列表是从0开始的，枚举也需要从0开始对应
      const x = original.maturity_date - 1;
      const y = BankRowMap[original.issuer_bank_type ?? ''] ?? RatingColMap[original.issuer_rating_current];

      const { inst_name } = original;
      // 将价格和价格变动两个字段拼接起来，渲染时拆开后判断渲染
      const price = `${original.price}_${original.price_changed ?? 0}`;
      const volume = original.volume?.toString() ?? '';

      // 是不是浮息
      const isShibor = original.fr_type === FRType.Shibor;
      // 是浮息就push到浮息list中
      if (isShibor) shiBorList.push(original);

      // 不是固定利息并且 横纵坐标只要有一个是0那就是无效数据
      if (!isShibor && x >= 0 && y >= 0) {
        const yAxis = newData[y].children;

        // 为什么是5，因为每一行都是5列
        const baseArr = cloneDeep(new Array(5).fill({})) as Item[];
        const baseItem = { name: inst_name, price, volume };
        baseArr[x] = baseItem;

        if (yAxis.length > 0) {
          for (let index = 0; index < yAxis.length; index++) {
            // 如果当前索引对应的是空的，那就直接赋值
            if (isEqual(yAxis[index][x], {})) {
              yAxis[index][x] = baseItem;
              // 赋值之后跳出循环
              break;
              // 如果已经便利到了最后一项还没匹配到空对象，那就直接push一个
            } else if (index === yAxis.length - 1) {
              yAxis.push(baseArr);
              // push后跳出循环
              break;
            }
          }
          // 如果当前y轴长度为0，那就直接push
        } else yAxis.push(baseArr);
      }
    }

    return { shiBorList: shiBorList.sort(sortShiBor), newData };
  }, [infoData?.list]);

  return { ...data, infoData };
});

export const ReportFormProvider = ReportFormContainer.Provider;
export const useReportForm = ReportFormContainer.useContainer;
