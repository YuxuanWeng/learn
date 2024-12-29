import { ReactNode } from 'react';
import { Checkbox } from '.';

export default {
  title: '通用组件/Checkbox/Checkbox',
  component: Checkbox
};

const renderCheckbox = (title: string, checkbox: ReactNode) => {
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 text-trd-300">{title}</span>
      <div className="flex items-center">{checkbox}</div>
    </div>
  );
};

export const Basic = () => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 p-6 bg-gray-900">
        <h2 className="text-white">Dark theme</h2>

        {renderCheckbox('默认', <Checkbox>选项</Checkbox>)}
        {renderCheckbox(
          '受控半选',
          <Checkbox
            indeterminate
            checked={false}
          >
            选项
          </Checkbox>
        )}
        {renderCheckbox(
          '已选禁用',
          <Checkbox
            disabled
            checked
          >
            选项
          </Checkbox>
        )}
        {renderCheckbox(
          '半选禁用',
          <Checkbox
            indeterminate
            disabled
          >
            选项
          </Checkbox>
        )}
        {renderCheckbox('未选禁用', <Checkbox disabled>选项</Checkbox>)}
      </div>
    </div>
  );
};

Basic.storyName = '基本使用';
