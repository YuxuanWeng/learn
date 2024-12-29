import { MarketDealUpdate, QuoteUpdate } from '@fepkg/services/types/common';
import { ProductType } from '@fepkg/services/types/enum';

export type HookMethods<T> = [T[] | undefined, (value: T[], type: OperationType) => void, (maxIdx?: number) => void];

export enum OperationType {
  Quote = 'quote',
  Edit = 'edit',
  Refer = 'refer',
  Unref = 'unRefer',
  Add = 'add',
  Deal = 'deal',
  Update = 'update'
}

export type UndoQuoteUpdate = QuoteUpdate & { deal_id?: string };

export type UndoOperationItem = (
  | { data: UndoQuoteUpdate[]; dataType: 'quote' }
  | { data: MarketDealUpdate[]; dataType: 'deal' }
) & {
  idx: number; // 排序id
  uuid: string; // 唯一id
  type: OperationType; // 操作类型
  userId: string; // 用户id
  timestamp: number; // 时间戳
  productType: ProductType; // 台子类型
  tag?: string; // 标签
};

export type OperationTypeRecord = {
  tag: string;
  color: string;
};

export const OperationTypeToNameMap = new Map<OperationType, OperationTypeRecord>([
  [OperationType.Edit, { tag: '编辑', color: 'text-secondary-100' }],
  [OperationType.Refer, { tag: '作废', color: 'text-gray-300' }],
  [OperationType.Unref, { tag: 'Unrefer', color: 'text-green-100' }],
  [OperationType.Add, { tag: '报价', color: 'text-orange-100' }],
  [OperationType.Deal, { tag: '成交', color: 'text-orange-100' }],
  [OperationType.Update, { tag: '编辑', color: 'text-secondary-100' }]
]);

export type LocalForgeProps<T> = {
  key: LocalForageKey;
  isUndo?: boolean;
  initialValue?: T[];
  setCb?: () => void;
  removeCb?: () => void;
};

export enum LocalForageKey {
  UNDO = 'undo'
}
