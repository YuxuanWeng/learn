import { useState } from 'react';
import { fakeGroupData, groupColumns } from '../fakeData';
import { GroupTable } from './GroupTable';

export default {
  title: '业务组件/GroupTable',
  component: GroupTable
};

export const Basic = () => {
  const [data] = useState(() => fakeGroupData(10, 10));
  const [selectedKeys, setSelectedKeys] = useState(new Set<string>());

  return (
    <div className="h-[500px] p-5 bg-gray-900">
      <GroupTable
        data={data}
        columns={groupColumns}
        rowKey={rowData => rowData.id}
        hasColumnSettings={false}
        columnVisibleKeys={['firstName', 'lastName', 'age', 'visits', 'status', 'progress']}
        showHeader={false}
        selectedKeys={selectedKeys}
        onSelect={setSelectedKeys}
      />
    </div>
  );
};

Basic.storyName = '基本表格';
