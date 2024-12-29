import { useState } from 'react';
import { DateType } from '@/pages/Deal/Bridge/types';
import { DateFilter } from './DateFilter';

export default {
  title: 'IDC业务组件/过桥/日期筛选',
  component: DateFilter
};

export const D = () => {
  const [dateParams, setDateParams] = useState({
    type: DateType.RecordDay,
    value: ''
  });

  return (
    <div>
      <p>{JSON.stringify(dateParams)}</p>
      <DateFilter
        dateParams={dateParams}
        onChange={e => setDateParams(e)}
      />
    </div>
  );
};

D.storyName = '筛选日期';
