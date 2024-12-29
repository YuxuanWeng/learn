import { useEffect, useMemo } from 'react';
import { Table } from '@fepkg/components/Table';
import { QuoteDraftDetailStatus } from '@fepkg/services/types/enum';
import { useAtom, useSetAtom } from 'jotai';
import {
  repeatQuoteMdlOpenAtom,
  repeatQuoteMdlSelectedBondAtom,
  repeatQuoteMdlSelectedMessageKeyAtom
} from '@/pages/Quote/Collaborative/atoms/modal';
import { useTableState } from '@/pages/Quote/Collaborative/providers/TableStateProvider';
import {
  DraftGroupTableColumnKey,
  DraftGroupTableDetailData,
  DraftGroupTableMessageData,
  RepeatQuoteTableRowData
} from '@/pages/Quote/Collaborative/types/table';
import { getGroupDetailData } from '@/pages/Quote/Collaborative/utils';
import { columnVisibleKeys, columns } from './columns';
import './index.less';

export const RepeatQuoteTable = () => {
  const { tableData, indexCache } = useTableState();

  const setOpen = useSetAtom(repeatQuoteMdlOpenAtom);
  const [selectedMessageKey, setSelectedMessageKey] = useAtom(repeatQuoteMdlSelectedMessageKeyAtom);
  const [selectedBond, setSelectedBond] = useAtom(repeatQuoteMdlSelectedBondAtom);

  const selectedCache = useMemo(() => {
    /** 已选中的消息 */
    let message: DraftGroupTableMessageData | undefined = void 0;
    /** 已选中的详情的数组 */
    const repeats: DraftGroupTableDetailData[] = [];
    const ignoreKeys = new Set<string>();

    if (selectedMessageKey) {
      const selectedMessageIdx = indexCache.get(selectedMessageKey);
      if (selectedMessageIdx !== void 0 && selectedBond?.key_market) {
        message = tableData[selectedMessageIdx] as DraftGroupTableMessageData;

        getGroupDetailData(message, tableData, indexCache, detail => {
          if (selectedBond.key_market === detail.original?.bond_info?.key_market) {
            repeats.push(detail);
            if (detail.original?.status === QuoteDraftDetailStatus.QuoteDraftDetailStatusIgnored) {
              ignoreKeys.add(detail.id);
            }
          }
        });
      }
    }

    return { message, repeats, ignoreKeys };
  }, [tableData, indexCache, selectedBond?.key_market, selectedMessageKey]);

  // 如果 selectedCache.repeats 没有值了，需要关闭窗口
  useEffect(() => {
    if (!selectedCache.repeats.length) {
      setOpen(false);
      setSelectedBond({});
      setSelectedMessageKey(void 0);
    }
  }, [selectedCache, setSelectedBond, setSelectedMessageKey, setOpen]);

  return (
    <Table<RepeatQuoteTableRowData, DraftGroupTableColumnKey>
      className="oms-repeat-quote-table"
      columns={columns}
      columnVisibleKeys={columnVisibleKeys}
      data={selectedCache.repeats}
      disabledKeys={selectedCache.ignoreKeys}
      rowKey="id"
      hasColumnSettings={false}
      showHeaderReorder={false}
      showHeaderResizer={false}
      showHeaderContextMenu={false}
      showWatermark={false}
    />
  );
};
