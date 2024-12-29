import { NCDPInfo, NCDPInfoLiteUpdate } from '@fepkg/services/types/common';
import { IssuerDateType } from '@fepkg/services/types/enum';
import { Updater } from 'use-immer';

export enum NCDPBatchFormMode {
  Add = 'add',
  Edit = 'edit'
}

export declare namespace NCDPBatchFormListProps {
  type Action = {
    /** 是否点亮佣金按钮 */
    brokerage?: boolean;
    /** 是否点亮暗盘按钮 */
    internal?: boolean;
    /** 是否展示删除按钮 */
    showDelete?: boolean;
    /** 是否展示 popconfirm */
    showPopconfirm?: boolean;
    /** 点击佣金按钮时的回调 */
    onBrokerage?: () => void;
    /** 点击暗盘按钮时的回调 */
    onInternal?: () => void;
    /** 点击删除按钮时的回调 */
    onDelete?: () => void;
  };

  type Item = {
    /** 索引 */
    index: number;
    /** 是否展示索引值，单条编辑时不展示 */
    showIndex?: boolean;
    /** 是否展示删除按钮 */
    showDelete?: boolean;
    /** 默认的 IssuerDateType */
    defaultIssuerDateType?: IssuerDateType;
    /** value 这样传下去是为了让 memo 生效，context 会让 memo 失效，下同） */
    value: NCDPBatchFormListItem;
    /** 更新时的调用的函数（ */
    onUpdate: Updater<NCDPBatchFormListItem[]>;
  };
}

export type NCDPBatchFormListItem = {
  /** 唯一标识 */
  key: string;
  /** 原检查行序号 */
  line?: number;
  /** 编辑时的原始数据，用于 diff 用 */
  original?: Partial<NCDPInfoLiteUpdate>;
} & Partial<NCDPInfo>;

export type NCDPBatchFormListItemCheckedInfo = {
  /** 原检查行序号 */
  line: number;
  /** 是否提示错误 */
  error?: boolean;
  /** 错误类型 */
  type?: 'inst' | 'rating' | 'maturity-date' | 'price' | 'price-limit';
};
