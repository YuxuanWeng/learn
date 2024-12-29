import { TableSorter } from '@fepkg/components/Table';
import { Broker, FiccBondBasic, InputFilter } from '@fepkg/services/types/common';
import { ProductType, QuoteSortedField } from '@fepkg/services/types/enum';
import { QuickFilterValue } from '@/components/BondFilter/QuickFilter/types';
import { BondIssueInfoFilterValue, GeneralFilterValue, QuoteFilterValue } from '@/components/BondFilter/types';
import { BondQuoteTableColumnSettingItem, ProductPanelTableKey } from '@/pages/ProductPanel/types';

export type ManageQueryResult = {
  quick_filter?: QuickFilterValue;
  general_filter?: GeneralFilterValue;
  bond_issue_info_filter?: BondIssueInfoFilterValue;
  bond_id_list?: { id: string; order: number }[];
  custom_sorting?: TableSorter<QuoteSortedField>[];
  advance_outer_quick_filter: QuickFilterValue;
  advance_group_ids: string[];
};

// 本地存储的债券筛选项结构
export type GroupStruct = {
  /** 分组id */
  groupId: string;
  /** 快捷筛选 */
  quickFilter?: QuickFilterValue;
  /** 一般筛选 */
  generalFilter?: GeneralFilterValue;
  /** 发行人筛选 */
  bondIssueInfoFilter?: BondIssueInfoFilterValue;
  /** 额外的债券列表 */
  bondIdList?: { id: string; order: number }[];
  /** 自定义筛选 */
  customSorting?: TableSorter<QuoteSortedField>[];
  /** 高级分组快捷筛选 */
  advanceOuterQuickFilter?: QuickFilterValue;
  /** 高级分组选中的数组 */
  advanceGroupIds?: string[];
  /** 是否是高级分组模式(不传远端) */
  isAdvanceMode?: boolean;
};

export type GlobalSearchParams = {
  /** 全局搜索 */
  inputFilter?: InputFilter;
  /** 全局搜索正在搜索的债券 */
  searchingBond?: FiccBondBasic;
};

export type TableParams = {
  /** 报价筛选项 */
  quoteFilterValue?: QuoteFilterValue;
  /** 表格列设置 */
  columnSettings?: BondQuoteTableColumnSettingItem[];
  /** 表格排序 */
  tableSorter?: TableSorter<QuoteSortedField>;
};

// 本地存储的表格相关数据结构
export type TableCache = {
  /** 分组 Id */
  groupId: string;
  /** 表格内缓存信息 */
  tableParamsCache?: Map<ProductPanelTableKey, TableParams>;
  /** 全局搜索缓存信息 */
  searchParamsCache?: GlobalSearchParams;
};

export type GroupManageItem = {
  /** 分组id */
  groupId?: string;
  /** 分组名称 */
  groupName?: string;
  /** 产品类型 */
  productType?: ProductType;
  /** 创建者id */
  creatorId?: string;
  /** 创建者名称 */
  creatorName?: string;
  /** 被分享的brokerList */
  sharedBrokerList?: Broker[];
  /** 服务端保存的分组信息 */
  serverGroup?: GroupStruct;
  /** 本地保存的分组信息 */
  localGroup?: GroupStruct;
};
