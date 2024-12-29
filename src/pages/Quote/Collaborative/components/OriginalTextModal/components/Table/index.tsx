import { useMemo } from 'react';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { Table, TableMouseEvent } from '@fepkg/components/Table';
import { useMemoizedFn } from 'ahooks';
import { useAtomValue } from 'jotai';
import { useEventListener } from 'usehooks-ts';
import { v4 } from 'uuid';
import { originalTextMdlTargetMessageAtom } from '@/pages/Quote/Collaborative/atoms/modal';
import { OriginalTextTableColumnKey, OriginalTextTableRowData } from '@/pages/Quote/Collaborative/types/table';
import { columnVisibleKeys, columns } from './columns';
import './index.less';

export const OriginalTextTable = () => {
  const message = useAtomValue(originalTextMdlTargetMessageAtom);

  const data = useMemo(() => {
    const res: OriginalTextTableRowData[] = [];
    if (!message) return res;

    const { text_list = [], detail_order_list = [] } = message;

    for (let i = 0, len = text_list.length; i < len; i++) {
      const text = text_list[i];

      const order = detail_order_list?.find(item => item.corresponding_line === i);
      const valid = order?.detail_id_list?.length || order?.with_trader_info;

      res.push({
        id: v4(),
        index: i + 1,
        text,
        status: valid ? 'valid' : 'invalid'
      });
    }

    return res;
  }, [message]);

  const handleCellClick: TableMouseEvent<OriginalTextTableRowData> = useMemoizedFn((_, row) => {
    window.Main.copy(row.text);
  });

  // 特殊处理复制逻辑，因为使用 user-select: none，只会不让选择复制，但不能禁止在 document.getSelection() 中选择，
  // 直接复制会让复制出来的文本在富文本中出现问题，所以需要特殊处理一波复制逻辑
  useEventListener('keydown', evt => {
    if (evt.key.toLowerCase() === KeyboardKeys.KeyC) {
      if (evt.metaKey || evt.ctrlKey) {
        let text = document.getSelection()?.toString();

        // 移除状态
        text = text?.replaceAll(/(已识别\n|无效文本\n)/g, '');
        // 移除序号
        text = text?.replaceAll(/&ZeroWidthSpace;\n\d{1,}\n&ZeroWidthSpace;\n/g, '');

        if (text) {
          evt.preventDefault();
          window.Main.copy(text);
        }
      }
    }
  });

  return (
    <Table<OriginalTextTableRowData, OriginalTextTableColumnKey>
      className="oms-original-text-table"
      columns={columns}
      columnVisibleKeys={columnVisibleKeys}
      data={data}
      rowKey="id"
      hasColumnSettings={false}
      showHeaderReorder={false}
      showHeaderResizer={false}
      showHeaderContextMenu={false}
      showWatermark={false}
      copyEnabled
      placeholder="无识别结果"
      onCellClick={handleCellClick}
    />
  );
};
