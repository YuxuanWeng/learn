import { useRef, useState } from 'react';
import { Table } from './Table';
import { autoWidthColumns, columns, fakeData } from './fakeData';
import { TableInstance } from './types';

export default {
  title: '业务组件/表格组件',
  component: Table
};

const columnSettings = [
  { key: 'firstName', label: '最前名称', width: 150, visible: true },
  { key: 'lastName', label: '最后名称', width: 400, visible: true },
  { key: 'age', label: '年龄', width: 150, visible: true },
  { key: 'visits', label: '观看数', width: 150, visible: true },
  { key: 'status', label: '状态', width: 150, visible: true },
  { key: 'progress', label: '进度', width: 150, visible: true }
];

export const BasicTable = () => {
  const [data] = useState(() => fakeData(100));
  const [selectedKeys, setSelectedKeys] = useState(new Set<string>());

  const ref = useRef<TableInstance>(null);

  const handleScrollRowIntoView = () => {
    ref?.current?.scrollRowIntoView(data[20].id);
  };

  return (
    <div className="h-[500px] p-5 bg-gray-900">
      <button onClick={handleScrollRowIntoView}>滚过去</button>
      <Table
        tableRef={ref}
        data={data}
        columns={columns}
        columnSettings={columnSettings}
        rowKey={original => original.id}
        selectedKeys={selectedKeys}
        onSelect={setSelectedKeys}
      />
    </div>
  );
};

BasicTable.storyName = '基本表格';

export const LoadingTable = () => {
  return (
    <div className="h-[500px] p-5 bg-gray-900">
      <Table
        loading
        data={[]}
        columns={columns}
        columnSettings={columnSettings}
        rowKey={original => original.id}
      />
    </div>
  );
};

LoadingTable.storyName = '表格 Loading 样式';

export const NoDataTable = () => {
  return (
    <div className="h-[500px] p-5 bg-gray-900">
      <Table
        noSearchResult
        data={[]}
        columns={columns}
        columnSettings={columnSettings}
        rowKey={original => original.id}
      />
    </div>
  );
};

NoDataTable.storyName = '表格 No Data 样式';

export const NoHeaderTable = () => {
  const [data] = useState(() => fakeData(100));
  const [selectedKeys, setSelectedKeys] = useState(new Set<string>());

  return (
    <div className="h-[500px] p-5 bg-gray-900">
      <Table
        data={data}
        columns={columns}
        columnSettings={columnSettings}
        showHeader={false}
        rowKey={original => original.id}
        selectedKeys={selectedKeys}
        onSelect={setSelectedKeys}
      />
    </div>
  );
};

NoHeaderTable.storyName = '表格 No Header 样式';

export const AutoHeaderWidthTable = () => {
  const [data] = useState(() => fakeData(100));
  const [selectedKeys, setSelectedKeys] = useState(new Set<string>());

  return (
    <div className="h-[500px] p-5 bg-gray-900">
      <Table
        data={data}
        columns={autoWidthColumns}
        hasColumnSettings={false}
        columnVisibleKeys={['firstName', 'lastName', 'age', 'visits', 'status', 'progress']}
        showHeaderReorder={false}
        showHeaderResizer={false}
        showHeaderContextMenu={false}
        rowKey={original => original.id}
        selectedKeys={selectedKeys}
        onSelect={setSelectedKeys}
      />
    </div>
  );
};

AutoHeaderWidthTable.storyName = '表格列宽度自适应样式';
