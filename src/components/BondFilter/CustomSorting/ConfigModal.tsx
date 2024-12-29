import { Checkbox } from '@fepkg/components/Checkbox';
import { Modal } from '@fepkg/components/Modal';
import { TableSorterOrder } from '@fepkg/components/Table';
import { QuoteSortedField } from '@fepkg/services/types/bds-enum';
import { enableMapSet } from 'immer';
import { useImmer } from 'use-immer';
import { useCustomSorting } from './provider';
import { CustomSortOptionsConfig } from './types';

enableMapSet();

const Inner = () => {
  const { options, configModalVisible, setConfigModalVisible, saveConfig } = useCustomSorting();

  const [selectedKeys, setSelectedKeys] = useImmer(new Set(options.map(v => v.sortedField)));

  const handleChange = (key: QuoteSortedField, checked: boolean) => {
    if (checked) {
      setSelectedKeys(draft => {
        draft.add(key);
      });
    } else {
      setSelectedKeys(draft => {
        draft.delete(key);
      });
    }
  };

  const handleConfirm = () => {
    const selected = [...selectedKeys].map(v => {
      /** 剩余期限默认升序 */
      if (v === QuoteSortedField.FieldFirstMaturityDate) return { sortedField: v, order: TableSorterOrder.ASC };
      return { sortedField: v, order: TableSorterOrder.DESC };
    });
    saveConfig(selected);
  };

  return (
    <Modal
      keyboard
      draggable={false}
      confirmByEnter
      visible={configModalVisible}
      width={360}
      title="配置字段"
      onCancel={() => {
        setConfigModalVisible(false);
      }}
      onConfirm={handleConfirm}
      footerProps={{ centered: true, confirmBtnProps: { label: '保存' } }}
    >
      <div className="p-3 flex flex-wrap gap-3 select-none h-[200px] overflow-x-hidden overflow-y-overlay justify-between">
        {CustomSortOptionsConfig.map(v => (
          <Checkbox
            key={v.sortedField}
            checked={selectedKeys.has(v.sortedField)}
            className="w-[156px] flex justify-start h-6"
            onChange={val => {
              handleChange(v.sortedField, val);
            }}
          >
            {v.label}
          </Checkbox>
        ))}
      </div>
    </Modal>
  );
};

export const ConfigModal = () => {
  const { configModalVisible } = useCustomSorting();
  if (!configModalVisible) return null;
  return <Inner />;
};
