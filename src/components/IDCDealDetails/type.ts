import { ReactElement } from 'react';
import { InstitutionTiny, Trader, TraderLite, UserLite } from '@fepkg/services/types/bdm-common';
import { FiccBondBasic, ReceiptDealDetail } from '@fepkg/services/types/bds-common';
import { BondCategory, BondShortName, MktType, Side } from '@fepkg/services/types/bds-enum';
import { ReceiptDealDetailSearch } from '@fepkg/services/types/receipt-deal/detail-search';
import { ReceiptDealDetailForAdd } from '@/pages/Spot/utils/type';

// 用于拖拽时在localstorage中进行临时存储
export const DRAG_KEY = 'merge-deal-drag-key';

// 用于成交明细拖拽加桥功能的存储Key
export const ADD_BRIDGE_DRAG_KEY = 'add-bridge-drag-key';

export const getAddBridgeDragData = () => {
  try {
    return JSON.parse(localStorage.getItem(ADD_BRIDGE_DRAG_KEY) ?? '') as ReceiptDealDetailForAdd[];
  } catch {
    return undefined;
  }
};

export type TypeDealItem = ReceiptDealDetail & {
  /** 序号  前端填充 */
  index?: number;
  /** id 标识成交页面数据的唯一  可能不同分组有同内码，同交易id的数据 */
  id?: string;
  /** 这条成交明细的交易方向(分组是基于哪个方向) */
  dealSide?: Side;
  /** 这条成交明细属于哪个分组 */
  parentGroupId?: string;
};

export type TypeSearchFilter = Omit<
  ReceiptDealDetailSearch.Request,
  'bond_key_market' | 'inst_id' | 'trader_id' | 'price' | 'mkt_type' | 'bond_category_list'
> & {
  bond?: FiccBondBasic;
  inst?: InstitutionTiny;
  trader?: Trader;
  price: string;
  /** 是否开始筛选价格-输入完价格并按下enter之后才开始筛选价格 */
  filterPrice?: boolean;
  /** 唯一key，用于保存历史筛选 */
  key: string;
  mkt_type: MktType[];
  /** 债券类型选项-包含债券类型和债券子类型 */
  bond_category_total_list?: (BondCategory | BondShortName)[];
  /** 单号 */
  seq_number?: string;
};

/** 展示区域下一个小分组的数据集(根据交易员进行分组) */
export type TypeDealGroup = {
  groupId: string;
  groupName: string;
  trader: string;
  deals: TypeDealItem[];
  historyDeals: TypeDealItem[];
  isHistory?: boolean;
  // 是否展示头部
  showHead?: boolean;
};

/** 新的展示区域数据集，首先根据交易员作区分 */
export type DealBrokerArea = {
  broker: UserLite;
  groups: TypeDealGroup[];
};

export type TypeGroupItem = {
  id?: string;
  name: string;
  // 二级列表
  list?: TypeDealItem[];
  traderList?: Trader[];
};

export type TypeSettingItem = TypeGroupItem;

/**
 * 分组列表的数据结构
 */
export type TypeGroup = {
  title: string;
  subTitle: string;
  list: TypeGroupItem[];
};

/**
 * 显示设置的数据结构
 */
export type TypeSetting = {
  title: string;
  subTitle: string;
  list: TypeSettingItem[];
};

/**
 * 分组弹窗类型
 */
export enum GroupTypeEnum {
  GroupMerge = 1,
  GroupDisplaySettings = 2
}

export type TypeBroker = {
  id?: string;
  name?: string;
};

export type TypeOptionsBroker = {
  label: string;
  value: string;
};

export type TypeDealItemSum = {
  key_market: string;
  short_name?: string;
  // 买入数量
  gvnNum: number;
  // 卖出数量
  tknNum: number;
  sumId: string;
};

export type TypeDealContentSum = {
  key_market: string;
  short_name?: string;
  // 买入数量
  gvnNum: string;
  // 卖出数量
  tknNum: string;
  sumId: string;
};

export type DisplayItem = {
  /** 内码 */
  internalCode?: string;
  /** ofrBroker */
  ofrBroker?: string;
  /** bidBroker */
  bidBroker?: string;
  /** 序号 */
  index: number;
  /**  其他展示字段 */
  fieldList: string[];
  /** ofrBroker 完整版 */
  ofrBrokerFull?: string;
  /** bidBroker 完整版 */
  bidBrokerFull?: string;
};

export type GroupItem = {
  /** 分组id */
  id: string;
  /** 分组名称 */
  name: string;
  /** 分组对应的交易员id */
  idList: string[];
};

/** 交易方向 */
export enum SideEnum {
  /** 默认状态 */
  None,
  /** ofr合单预览 */
  Ofr,
  /** bid合单预览 */
  Bid
}

/** 右键菜单枚举 */
export enum ContextMenuEnum {
  /** 带broker复制 */
  WithBrokerCopy = 'WithBrokerCopy',
  /** 带内码复制 */
  WithInternalCodeCopy = 'WithInternalCodeCopy',
  /* 隐藏对手方复制 */
  HideOtherCopy = 'HideOtherCopy',
  /* 带交易员复制 */
  WithTraderCopy = 'WithTraderCopy',
  /* 催单 */
  SendMsg = 'SendMsg',
  /* 加桥 */
  AddBridge = 'AddBridge',
  /* 换桥 */
  ChangeBridge = 'ChangeBridge',
  /* 发单信息编辑 */
  ModifySendMessage = 'ModifySendMessage',
  /* 删桥 */
  DeleteBridge = 'DeleteBridge',
  /** 成交编辑 */
  DealEdit = 'DealEdit',
  /** 操作日记 */
  OperateLog = 'OperateLog'
}

export type BridgeRecordInfo = {
  bridge_operator?: UserLite;
  bridge_inst?: InstitutionTiny;
  contact_info?: TraderLite;
  contact?: string;
  bridge_record_id: string;
};

export enum DiffKeys {
  /** ofr-经纪人 */
  OfrBroker,
  /** bid-经纪人 */
  BidBroker,
  /** 债券代码 */
  BondCode,
  /** 成交价 */
  DealPrice,
  /** 成交量 */
  DealVolume,
  /** 交割方式 */
  LiqSpeed,
  /** Ofr-CP */
  OfrCp,
  /** Bid-CP */
  BidCp,
  /** 发单信息 */
  SendMsg,
  /** bid发单信息 */
  BidSendMsg,
  /** ofr发单信息 */
  OfrSendMsg,
  /** 是否过桥 */
  FlagBridge
}

export type DiffDeal = { label: string; key: DiffKeys; value?: string; hasChanged?: boolean; icon?: ReactElement };

export type DiffDealType = { hasChanged?: boolean; prev?: DiffDeal[]; next?: DiffDeal[] };

export type DealContainerData = Omit<DealBrokerArea, 'groups'> &
  TypeDealGroup &
  TypeDealItem & {
    category?: 'brokerHead' | 'groupHead' | 'groupFooter' | 'deals' | 'otherTitle';
    isFirst?: boolean;
    /** 是否为最后一条数据-用于区分各个小组 */
    isLast?: boolean;
    /** 是否为最后一个小组-用于区分各个大组 */
    isLastGroup?: boolean;
    isEmpty?: boolean;
    isClosed?: boolean;
  } & DiffDealType;
