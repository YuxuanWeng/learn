import { ReactNode } from 'react';
import { TextArea } from '.';

export default {
  title: '通用组件/TextArea',
  component: TextArea
};

const renderTextArea = (title: string, textArea: ReactNode, long = true) => {
  return (
    <div className="flex gap-3">
      <span className="w-20 py-1.5 text-trd-300">{title}</span>
      <div className={long ? 'w-72' : 'w-24'}>{textArea}</div>
    </div>
  );
};

export const Basic = () => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 p-6 bg-gray-900">
        <h2 className="text-white">Dark theme</h2>
        <h3 className="text-white">有标题</h3>
        {renderTextArea(
          '默认',
          <TextArea
            label="标题"
            placeholder="请输入"
            autoSize={{ minRows: 2, maxRows: 3 }}
          />
        )}
        {renderTextArea(
          '展示字数限制',
          <TextArea
            label="标题"
            placeholder="请输入"
            showWordLimit
            maxLength={{ errorOnly: true, length: 100 }}
            autoSize={{ minRows: 1, maxRows: 3 }}
          />
        )}
        {renderTextArea(
          '展示',
          <TextArea
            label="标题"
            value="内容文本"
          />
        )}
        {renderTextArea(
          '禁用-空',
          <TextArea
            label="标题"
            placeholder="请输入"
            disabled
          />
        )}
        {renderTextArea(
          '禁用-有内容',
          <TextArea
            label="标题"
            disabled
            value="内容文本"
          />
        )}

        <h3 className="text-white">无标题</h3>
        {renderTextArea(
          '默认',
          <TextArea
            placeholder="搜索代码"
            size="xs"
            rounded
          />,
          false
        )}
        {renderTextArea(
          '展示',
          <TextArea
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
