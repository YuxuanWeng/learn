import { useState } from 'react';
import { Cascader } from './Cascader';
import { CascaderOption } from './types';

export default {
  title: '通用组件/Cascader',
  component: Cascader
};

export const Default = () => {
  const [value, setValues] = useState<string[]>([]);

  const items: CascaderOption[] = [
    {
      label: '钢铁',
      value: 'GTY0101',
      children: [
        {
          label: '钢铁',
          value: 'GTY0201'
        }
      ]
    },
    {
      label: '有色金属',
      value: 'YSJ0101',
      children: [
        {
          label: '工业金属',
          value: 'YSJ0201'
        },
        {
          label: '金属非金属新材料',
          value: 'YSJ0204'
        },
        {
          label: '黄金',
          value: 'YSJ0202'
        },
        {
          label: '稀有金属',
          value: 'YSJ0203'
        }
      ]
    },
    {
      label: '银行',
      value: 'YHY0101',
      children: [
        {
          label: '银行',
          value: 'YHY0102'
        }
      ]
    },
    {
      label: '综合',
      value: 'ZHY0101',
      children: [
        {
          label: '综合',
          value: 'ZHY0201'
        }
      ]
    },
    {
      label: '机械设备',
      value: 'JXS0101',
      children: [
        {
          label: '运输设备',
          value: 'JXS0205',
          children: [
            {
              label: '金属制品',
              value: 'JXS0204'
            },
            {
              label: '仪器仪表',
              value: 'JXS0203'
            }
          ]
        },
        {
          label: '通用机械',
          value: 'JXS0201'
        },
        {
          label: '专用设备',
          value: 'JXS0202'
        }
      ]
    },
    {
      label: '休闲服务',
      value: 'XXF0101'
    },
    {
      label: '房地产',
      value: 'FDC0101',
      children: [
        {
          label: '房地产开发',
          value: 'FDC0201'
        },
        {
          label: '园区开发',
          value: 'FDC0202'
        }
      ]
    },
    {
      label: '房地产1',
      value: 'FDC01011'
    },
    {
      label: '房地产2',
      value: 'FDC01012'
    },
    {
      label: '房地产3',
      value: 'FDC01013'
    },
    {
      label: '房地产4',
      value: 'FDC01014'
    },
    {
      label: '房地产5',
      value: 'FDC01015'
    }
  ];

  return (
    <div className="flex gap-2">
      <Cascader
        label="行业"
        // disabled={disabled}
        className="flex-shrink-0 w-[262px] h-7"
        options={items}
        value={value}
        onChange={(v, val) => {
          setValues(v as string[]);
        }}
      />
    </div>
  );
};

Default.storyName = '树形选择';
