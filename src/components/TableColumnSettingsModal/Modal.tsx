import { useCallback, useEffect, useMemo, useState } from 'react';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { Button } from '@fepkg/components/Button';
import { Modal } from '@fepkg/components/Modal';
import { Popconfirm } from '@fepkg/components/Popconfirm';
import { ColumnSettingDef } from '@fepkg/components/Table/types';
import { Transfer } from '../Transfer';
import { TableColumnSettingsModalProps } from './types';

export const TableColumnSettingsModal = <ColumnKey = string,>({
  visible,
  columnSettings,
  onSubmit,
  onReset,
  onCancel
}: TableColumnSettingsModalProps<ColumnKey>) => {
  const [sourceKeys, setSourceKeys] = useState<string[]>([]);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [popconfirmOpen, setPopconfirmOpen] = useState(false);

  // Sync Data
  useEffect(() => {
    const left = columnSettings?.filter(item => !item.visible).map(item => item.key as unknown as string) ?? [];
    const right = columnSettings?.filter(item => item.visible).map(item => item.key as unknown as string) ?? [];
    setSourceKeys(left);
    setTargetKeys(right);
  }, [visible, columnSettings]);

  const options = useMemo(
    () =>
      columnSettings?.map(item => {
        return { key: item.key as unknown as string, title: item.label };
      }) ?? [],
    [columnSettings]
  );

  const handleSubmit = useCallback(() => {
    const left = sourceKeys.map(key => {
      const column = columnSettings?.find(item => (item.key as unknown as string) === key);
      return { ...column, visible: false };
    }) as ColumnSettingDef<ColumnKey>[];

    const right = targetKeys.map(key => {
      const column = columnSettings?.find(item => (item.key as unknown as string) === key);
      return { ...column, visible: true };
    }) as ColumnSettingDef<ColumnKey>[];

    onSubmit?.([...left, ...right]);
  }, [columnSettings, onSubmit, sourceKeys, targetKeys]);

  const handleTransferChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
    setSourceKeys(sourceSelectedKeys);
    setTargetKeys(targetSelectedKeys);
  };

  useEffect(() => {
    const handleEnterSubmit = (evt: KeyboardEvent) => {
      if (evt.code === 'Enter') {
        handleSubmit();
      }
    };
    if (visible) window.addEventListener('keydown', handleEnterSubmit);
    return () => {
      if (visible) window.removeEventListener('keydown', handleEnterSubmit);
    };
  }, [handleSubmit, visible]);

  return (
    <Modal
      visible={visible}
      width={481}
      title="列设置"
      footerProps={{
        confirmBtnProps: {
          label: '保存',

          onKeyDown: evt => {
            if (evt.key === KeyboardKeys.Enter) evt.stopPropagation();
          }
        }
      }}
      footerChildren={
        <Popconfirm
          type="warning"
          trigger="manual"
          content="确认还原为默认显示吗？"
          placement="top-start"
          onConfirm={onReset}
          open={popconfirmOpen}
          onOpenChange={setPopconfirmOpen}
        >
          <Button
            type="primary"
            ghost
            className="h-7"
            onClick={() => {
              setPopconfirmOpen(val => !val);
            }}
            onKeyDown={evt => {
              if (evt.key === KeyboardKeys.Enter) evt.stopPropagation();
            }}
          >
            还原默认
          </Button>
        </Popconfirm>
      }
      keyboard
      onConfirm={handleSubmit}
      onCancel={onCancel}
    >
      <div className="p-3">
        <Transfer
          options={options}
          sourceTitle="隐藏列"
          targetTitle="显示列"
          sourceKeys={sourceKeys}
          targetKeys={targetKeys}
          onChange={handleTransferChange}
        />
      </div>
    </Modal>
  );
};
