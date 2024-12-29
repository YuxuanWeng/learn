import { ReactNode } from 'react';
import { Input } from '.';

export default {
  title: '通用组件/Input',
  component: Input
};

const renderInput = (title: string, input: ReactNode, long = true) => {
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 text-purple-300">{title}</span>
      <div className={long ? 'w-72' : 'w-24'}>{input}</div>
    </div>
  );
};

export const Basic = () => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 p-6 bg-gray-900">
        <h2 className="text-white">Dark theme</h2>
        <h3 className="text-white">有标题</h3>
        {renderInput(
          '默认',
          <Input
            label="标题"
            placeholder="请输入"
            suffixIcon={null}
          />
        )}
        {renderInput(
          '展示',
          <Input
            label="标题"
            suffixIcon={null}
            value="内容文本"
          />
        )}
        {renderInput(
          '禁用-空',
          <Input
            label="标题"
            placeholder="请输入"
            suffixIcon={null}
            disabled
          />
        )}
        {renderInput(
          '禁用-有内容',
          <Input
            label="标题"
            suffixIcon={null}
            disabled
            value="内容文本"
          />
        )}
        {renderInput(
          '错误-有内容',
          <Input
            label="标题"
            suffixIcon={null}
            error
            value="内容文本"
          />
        )}

        <h3 className="text-white">无标题</h3>
        {renderInput(
          '默认',
          <Input
            placeholder="搜索代码"
            suffixIcon={null}
            size="xs"
            rounded
          />,
          false
        )}
        {renderInput(
          '展示',
          <Input
            suffixIcon={null}
            value="内容文本"
            size="xs"
            rounded
          />,
          false
        )}
      </div>
    </div>
  );
};

Basic.storyName = '基本使用';
