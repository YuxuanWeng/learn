import { CaptionProps } from '@fepkg/components/Caption';
import { SwitchProps } from '@fepkg/components/Switch';
import { TypeColumnFields } from '@/common/constants/column-fields-map';
import { ColumnFieldsEnum } from '@/common/types/column-fields-enum';

export enum AnchorType {
  Base = 'base',
  Bond = 'bond',
  BestQuote = 'best-quote',
  Deal = 'deal',
  Quote = 'Quote'
}

export type FieldsGroupProps = {
  /** 类别标题 */
  title: string;
  /** 定位锚点 */
  anchorId: AnchorType;
  /** 标题参数 */
  captionProps?: CaptionProps;
  /** 行情推送开关参数 */
  switchProps?: SwitchProps;
  /** 是否支持配置推送开关——编辑状态下不可切换推送开关 */
  switchEnabled?: boolean;
  /** 是否支持配置外发字段 */
  configEnabled?: boolean;
  /** 是否禁用配置——针对字段，不针对开关 */
  disabled?: boolean;
  /** 字段配置 */
  data?: ColumnFieldsEnum[];
  /** 启用转发的字段 */
  enabledFields?: number[];
  /** 切换字段选中状态 */
  onFieldChange?: (val: boolean, id: number) => void;
};

export type FieldsItemProps = Pick<
  FieldsGroupProps,
  'disabled' | 'configEnabled' | 'enabledFields' | 'onFieldChange'
> & {
  item: TypeColumnFields;
};
