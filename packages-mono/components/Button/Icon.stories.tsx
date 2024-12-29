import { useState } from 'react';
import { IconEdit, IconStar } from '@fepkg/icon-park-react';
import { Button } from '.';
import { ButtonType } from './types';

export default {
  title: '通用组件/Button/Icon',
  component: Button.Icon
};

export const Basic = () => {
  const [checked, setChecked] = useState(false);

  const renderButtons = (title: string, type: ButtonType, text?: boolean, bright?: boolean, ghost?: boolean) => {
    return (
      <div className="flex flex-col gap-4">
        <div>{title}</div>
        <div className="flex gap-8">
          <Button.Icon
            type={type}
            text={text}
            ghost={ghost}
            bright={bright}
            checked={checked}
            icon={<IconStar size={bright ? 20 : 16} />}
            tooltip={{ content: '编辑看板名称' }}
            onClick={() => setChecked(!checked)}
          />
          <Button.Icon
            type={type}
            text={text}
            ghost={ghost}
            bright={bright}
            checked={checked}
            disabled
            icon={<IconStar size={bright ? 20 : 16} />}
            tooltip={{ content: '编辑看板名称' }}
            onClick={() => setChecked(!checked)}
          />
          <Button.Icon
            type={type}
            text={text}
            ghost={ghost}
            bright={bright}
            checked={checked}
            icon={<IconEdit />}
            tooltip={{ content: '编辑看板名称' }}
            onClick={() => setChecked(!checked)}
          >
            操作
          </Button.Icon>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8">
      {renderButtons('图标按钮', 'gray')}
      {renderButtons('图标按钮-文字状态', 'gray', true)}
      {renderButtons('点亮式按钮-辅助按钮', 'secondary', false, true)}
      {renderButtons('点亮式按钮-橙色按钮', 'orange', false, true)}
      {renderButtons('点亮式按钮-绿色按钮', 'green', false, true)}
      {renderButtons('点亮式按钮-危险按钮', 'danger', false, true)}
      {renderButtons('点亮式按钮-紫色按钮', 'purple', false, true)}
      {renderButtons('点亮式按钮-幽灵状态', 'green', false, true, true)}
      {renderButtons('点亮式按钮-幽灵状态', 'orange', false, true, true)}
      {renderButtons('透明按钮', 'transparent')}
    </div>
  );
};
