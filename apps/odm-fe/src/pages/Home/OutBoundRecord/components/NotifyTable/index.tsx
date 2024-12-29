import { useMemo, useState } from 'react';
import { Drawer } from '@fepkg/components/Drawer';
import { Pagination } from '@fepkg/components/Pagination';
import { VirtualTable } from '@fepkg/components/Table/Virtual/VirtualTable';
import { useHomeLayout } from '@/providers/LayoutProvider';
import { useNotify } from '@/providers/NotifyProvider';
import { useMemoizedFn } from 'ahooks';
import { ColumnFieldMap } from '@/common/constants/column-fields-map';
import { OutBoundMap } from '@/layouts/constant';
import { getColumns } from '@/pages/Home/utils';
import { useDataQuery } from '../../useDataQuery';
import './index.less';

export const NotifyTable = () => {
  const { page, pageSize, setPage, params, setPageSize } = useNotify();
  const { current } = useHomeLayout();

  const { fields } = OutBoundMap[current];
  const columns = useMemo(() => getColumns(fields), [fields]);
  const columnVisibleKeys = useMemo(() => fields.map(tag => ColumnFieldMap[tag].name_en), [fields]);

  const { data } = useDataQuery({ params, page, pageSize, acceptor_id: current, tagList: fields });
  const [open, setOpen] = useState(false);
  const handleSwitch = () => setOpen(i => !i);
  const [drawerData, setDrawerData] = useState<string>('');
  const handleCellDoubleClick = useMemoizedFn((_, original) => {
    setDrawerData(JSON.stringify(original.original));
    setOpen(true);
  });
  const list = useMemo(() => {
    return data?.list ?? [];
  }, [data?.list]);

  const total = useMemo(() => {
    return data?.total ?? 0;
  }, [data?.total]);

  return (
    <div className="relative flex flex-col flex-1 mx-4 mb-4 h-[calc(100%_-_140px)] rounded-lg overflow-hidden">
      <VirtualTable
        className="absolute left-0 right-0 top-0 bottom-[49px] !h-auto bg-gray-800 odm-table"
        size="md"
        data={list}
        rowKey={row => row.uuid}
        columns={columns}
        hasColumnSettings={false}
        showHeaderReorder={false}
        showHeaderResizer={false}
        showHeaderContextMenu={false}
        onCellDoubleClick={handleCellDoubleClick}
        // 手动使发送时间列可见
        columnVisibleKeys={['SendTime', ...columnVisibleKeys]}
        noSearchResult
        copyEnabled
      />
      <div className="absolute bottom-0 left-0 right-0 select-none">
        <div className="component-dashed-x h-px" />

        <div className="flex justify-between py-3 px-4 bg-gray-800">
          <div className="flex leading-6 text-gray-300">
            共有<span className="pl-1 pr-1 text-sm text-primary-100">{total}</span>条
          </div>

          <Pagination
            showQuickJumper
            showSizeChanger
            current={page}
            pageSize={pageSize}
            total={total}
            onChange={setPage}
            onShowSizeChange={(curr, size) => {
              setPageSize(size);
              setPage(1);
            }}
            pageSizeOptions={[30, 50, 100]}
          />
        </div>
      </div>
      <Drawer
        className="overflow-hidden"
        onMaskClick={handleSwitch}
        open={open}
      >
        <div className="w-[640px]">
          <header className="bg-gray-800 h-14 flex items-center pl-4 text-md font-bold text-gray-000">消息原文</header>
          <p className="p-6 text-gray-100 text-sm leading-7 font-normal break-all">{drawerData}</p>
        </div>
      </Drawer>
    </div>
  );
};
