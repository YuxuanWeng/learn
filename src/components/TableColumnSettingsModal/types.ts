import { ColumnSettingDef } from '@fepkg/components/Table';

export type TableColumnSettingsModalProps<ColumnKey = string> = {
  /** Modal 是否可见 */
  visible?: boolean;
  /** Table 列设置 */
  columnSettings?: ColumnSettingDef<ColumnKey>[];
  onSubmit?: (val: ColumnSettingDef<ColumnKey>[]) => void;
  onReset?: () => void;
  onCancel?: () => void;
};
