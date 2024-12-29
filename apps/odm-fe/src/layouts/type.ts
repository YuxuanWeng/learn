import { ColumnFieldsEnum } from '@/common/types/column-fields-enum';

export type OutBoundInst = {
  imgSrc: string;
  imgAlt: string;
  name: string;
  /** 当前外发机构所需要展示的字段 */
  fields: ColumnFieldsEnum[];
};
