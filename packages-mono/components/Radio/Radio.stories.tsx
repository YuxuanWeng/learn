import { ReactNode } from 'react';
import { Radio, RadioButton } from '.';

export default {
  title: '通用组件/Radio/Radio',
  component: Radio
};

const renderRadio = (title: string, radio: ReactNode) => {
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 text-trd-300">{title}</span>
      <div className="flex items-center">{radio}</div>
    </div>
  );
};

export const Basic = () => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 p-6 bg-gray-900">
        <h2 className="text-white">Dark theme</h2>
        <h3 className="text-white">Radio</h3>
        {renderRadio('默认', <Radio ctrl>选项内容</Radio>)}
        {renderRadio(
          '已选禁用',
          <Radio
            disabled
            checked
          >
            选项内容
          </Radio>
        )}
        {renderRadio('未选禁用', <Radio disabled>选项内容</Radio>)}

        <h3 className="text-white">RadioButton</h3>

        <div className="flex gap-10">
          <div className="flex flex-col gap-2">
            {renderRadio('默认', <RadioButton ctrl>选项</RadioButton>)}
            {renderRadio(
              '已选禁用',
              <RadioButton
                disabled
                checked
              >
                选项
              </RadioButton>
            )}
            {renderRadio('未选禁用', <RadioButton disabled>选项</RadioButton>)}
          </div>

          <div className="flex flex-col gap-2">
            <RadioButton
              buttonType="orange"
              ctrl
            >
              选项
            </RadioButton>
            <RadioButton
              buttonType="orange"
              disabled
              checked
            >
              选项
            </RadioButton>

            <RadioButton
              buttonType="orange"
              disabled
            >
              选项
            </RadioButton>
          </div>

          <div className="flex flex-col gap-2">
            <RadioButton
              buttonType="secondary"
              ctrl
            >
              选项
            </RadioButton>
            <RadioButton
              buttonType="secondary"
              disabled
              checked
            >
              选项
            </RadioButton>

            <RadioButton
              buttonType="secondary"
              disabled
            >
              选项
            </RadioButton>
          </div>
        </div>
      </div>
    </div>
  );
};

Basic.storyName = '基本使用';
