import { BondQuoteTableColumnKey } from '@fepkg/business/components/QuoteTableCell/types';
import { message } from '@fepkg/components/Message';
import { ProductType } from '@fepkg/services/types/enum';
import { useAtom } from 'jotai';
import { getDefaultQuoteTableColumnSettings } from '@/common/constants/table';
import { TableColumnSettingsModal as TableColumnSettingsModalInner } from '@/components/TableColumnSettingsModal';
import { tableColumnSettingsMdlOpenAtom } from '@/pages/ProductPanel/atoms/table';
import { BondQuoteTableColumnSettingItem, ProductPanelTableKey } from '@/pages/ProductPanel/types';

type TableColumnSettingsModalProps = {
  productType: ProductType;
  tableKey: ProductPanelTableKey;
  settings: BondQuoteTableColumnSettingItem[];
  onSettingsUpdate: (val: BondQuoteTableColumnSettingItem[]) => void;
};

export const TableColumnSettingsModal = ({
  productType,
  tableKey,
  settings,
  onSettingsUpdate
}: TableColumnSettingsModalProps) => {
  const [open, setOpen] = useAtom(tableColumnSettingsMdlOpenAtom);

  return (
    <TableColumnSettingsModalInner<BondQuoteTableColumnKey>
      visible={open}
      columnSettings={settings}
      onSubmit={val => {
        onSettingsUpdate(val);
        message.success('保存成功');
        setOpen(false);
      }}
      onReset={() => {
        onSettingsUpdate(getDefaultQuoteTableColumnSettings(productType, tableKey));
        message.success('保存成功');
        setOpen(false);
      }}
      onCancel={() => setOpen(false)}
    />
  );
};
