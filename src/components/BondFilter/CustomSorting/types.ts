import { TableSorter, TableSorterOrder } from '@fepkg/components/Table';
import { QuoteSortedField } from '@fepkg/services/types/bds-enum';

export type CustomSortFieldOptions = TableSorter<QuoteSortedField>[];

export type CustomSortOption = {
  sortedField: QuoteSortedField;
  label: string;
  order?: TableSorterOrder;
  radioGroup: { label: string; value: TableSorterOrder }[];
};

export type CustomSortingProps = {
  /** Modal是否展示 */
  visible: boolean;
  /** 关闭弹窗 */
  onCancel?: () => void;
  /** 保存 */
  onConfirm?: (val: CustomSortFieldOptions) => void;
  /** 排序列表 */
  options: CustomSortFieldOptions;
};

/** 自定义排序选项 */
export const CustomSortOptionsConfig: CustomSortOption[] = [
  {
    label: '剩余期限',
    sortedField: QuoteSortedField.FieldFirstMaturityDate,
    radioGroup: [
      { label: '从近到远', value: TableSorterOrder.ASC },
      { label: '从远到近', value: TableSorterOrder.DESC }
    ]
  },
  {
    label: '方向',
    sortedField: QuoteSortedField.FieldSide,
    radioGroup: [
      { label: 'ofr、bid', value: TableSorterOrder.DESC },
      { label: 'bid、ofr', value: TableSorterOrder.ASC }
    ]
  },
  {
    label: '价格',
    sortedField: QuoteSortedField.FieldPrice,
    radioGroup: [
      { label: '从高到低', value: TableSorterOrder.DESC },
      { label: '从低到高', value: TableSorterOrder.ASC }
    ]
  },
  {
    label: '净价值',
    sortedField: QuoteSortedField.FieldCleanPrice,
    radioGroup: [
      { label: '从高到低', value: TableSorterOrder.DESC },
      { label: '从低到高', value: TableSorterOrder.ASC }
    ]
  },
  {
    label: '票面利率',
    sortedField: QuoteSortedField.FieldCouponRateCurrent,
    radioGroup: [
      { label: '从高到低', value: TableSorterOrder.DESC },
      { label: '从低到高', value: TableSorterOrder.ASC }
    ]
  },
  {
    label: '主体评级',
    sortedField: QuoteSortedField.FieldIssuerRatingVal,
    radioGroup: [
      { label: '从高到低', value: TableSorterOrder.DESC },
      { label: '从低到高', value: TableSorterOrder.ASC }
    ]
  },
  {
    label: '债券评级',
    sortedField: QuoteSortedField.FieldBondRatingVal,
    radioGroup: [
      { label: '从高到低', value: TableSorterOrder.DESC },
      { label: '从低到高', value: TableSorterOrder.ASC }
    ]
  },
  {
    label: '中债资信评级',
    sortedField: QuoteSortedField.FieldCbcRatingVal,
    radioGroup: [
      { label: '从高到低', value: TableSorterOrder.DESC },
      { label: '从低到高', value: TableSorterOrder.ASC }
    ]
  },

  {
    label: '中债净价',
    sortedField: QuoteSortedField.FieldValCleanPrice,
    radioGroup: [
      { label: '从高到低', value: TableSorterOrder.DESC },
      { label: '从低到高', value: TableSorterOrder.ASC }
    ]
  },
  {
    label: '中债YTM(%)',
    sortedField: QuoteSortedField.FieldValYield,
    radioGroup: [
      { label: '从高到低', value: TableSorterOrder.DESC },
      { label: '从低到高', value: TableSorterOrder.ASC }
    ]
  },
  {
    label: '中证净价',
    sortedField: QuoteSortedField.FieldCsiCleanPrice,
    radioGroup: [
      { label: '从高到低', value: TableSorterOrder.DESC },
      { label: '从低到高', value: TableSorterOrder.ASC }
    ]
  },
  {
    label: '中证全价',
    sortedField: QuoteSortedField.FieldCsiFullPrice,
    radioGroup: [
      { label: '从高到低', value: TableSorterOrder.DESC },
      { label: '从低到高', value: TableSorterOrder.ASC }
    ]
  },
  {
    label: '中证YTM(%)',
    sortedField: QuoteSortedField.FieldCsiYield,
    radioGroup: [
      { label: '从高到低', value: TableSorterOrder.DESC },
      { label: '从低到高', value: TableSorterOrder.ASC }
    ]
  }
];
