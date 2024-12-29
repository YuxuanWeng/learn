import { GroupRowData, TableMouseEvent } from '@fepkg/components/Table';
import { GROUP_FOOTER_ID, GROUP_HEADER_ID } from '@fepkg/components/Table/constants';
import { LocalQuoteDraftDetail, LocalQuoteDraftMessage } from '@/common/services/hooks/local-server/quote-draft/types';

export enum DraftGroupTableColumnKey {
  /** 分组头部 */
  Header = GROUP_HEADER_ID,
  /** 分组底部（渲染未识别出报价行） */
  Footer = GROUP_FOOTER_ID,
  /** 识别文本 */
  Text = 'text',
  /** 债券信息 */
  Bond = 'bond',
  /** 方向 */
  Side = 'side',
  /** 价格 */
  Price = 'price',
  /** 量 */
  Volume = 'volume',
  /** 标志 */
  Flag = 'flag',
  /** 备注 */
  Comment = 'comment',
  /** 结算方式 */
  LiqSpeed = 'liqSpeed',
  /** 状态 */
  Status = 'status'
}

export enum DraftGroupTableRowType {
  Message = 'message',
  Detail = 'detail'
}

export type DraftGroupTableMessageData = GroupRowData & {
  /** 行数据唯一标识 */
  id: string;
  /** 行数据类型 */
  type: DraftGroupTableRowType.Message;
  /** 原始接口数据 */
  original: LocalQuoteDraftMessage;
  /** 创建时间 */
  createTime: string;
};

export type DraftGroupTableDetailData = GroupRowData & {
  /** 行数据唯一标识 */
  id: string;
  /** 行数据类型 */
  type: DraftGroupTableRowType.Detail;
  /** 原始接口数据 */
  original?: LocalQuoteDraftDetail;
  /** 对应原文行数 */
  correspondingLine: number;
  /** 识别文本 */
  text: string;
  /** 识别图片 url */
  imageUrl?: string;
  /** 在报价审核消息中是否存在重复债券的前缀（A~Z） */
  bondRepeatedPrefix: string;
};

export type DraftGroupTableRowData = DraftGroupTableMessageData | DraftGroupTableDetailData;

export type DraftGroupTableMouseEvent = TableMouseEvent<DraftGroupTableRowData, DraftGroupTableColumnKey>;

export type RepeatQuoteTableRowData = DraftGroupTableDetailData;

export enum OriginalTextTableColumnKey {
  /** 序号 */
  Index = 'index',
  /** 原文内容 */
  Text = 'text',
  /** 识别状态 */
  Status = 'status'
}

export type OriginalTextTableRowData = {
  /** 行数据唯一标识 */
  id: string;
  /** 序号 */
  index: number;
  /** 原文 */
  text: string;
  /** 识别状态 */
  status: 'valid' | 'invalid';
};
