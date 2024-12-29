import { MaturityDateType } from '@fepkg/services/types/bds-enum';
import { NCDPInfo } from '@fepkg/services/types/common';

/** 报价信息-评级 */
export enum TableRow {
  /** 期限-评级 */
  None = -1,
  /** 国有大行 */
  SCB,
  /** 国有股份制 */
  JCB,
  /** 其他AAA */
  AAA,
  /** AA+ */
  AAPlus,
  /** AA */
  AA,
  /** AA- */
  AAMinus,
  /** a+ */
  APlus,
  /** A、A-、其他 */
  Other
}

export enum CellType {
  /** 横向表头标题 */
  RowTitle,
  /** 纵向表头标题 */
  ColTitle,
  /** 渲染的数据 */
  CellData
}

export type ReportFormTable = {
  /** 表头标题 */
  label?: string;
  /** 当前评级下的行数 */
  // rowCount: number;
  /** 表格类型 */
  cellType: CellType;
  /** 符合条件的数据 */
  data?: NCDPInfo[];
};

export type SubTableType = (readonly [string, string, string])[];

export type TableType = {
  /** 单元格列类型 */
  colType: MaturityDateType;
  dataType: 'str' | 'arr';
  label?: string; // 如果dataType为str，表格就展示该字段
  // tableData?: RealNcdPInfo[]; // 根据typeof tableData判断单元格展示什么内容
  tableData?: [string[], string[], string[]]; // 根据typeof tableData判断单元格展示什么内容
};
