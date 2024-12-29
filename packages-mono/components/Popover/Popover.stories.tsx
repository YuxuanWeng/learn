import { Button } from '@fepkg/components/Button';
import { Popover } from './Popover';

export default {
  title: '通用组件/Popover',
  component: Popover
};

export const Basic = () => {
  return (
    <div className="flex gap-4">
      <Popover content="简单操作文案控制在一行内">
        <Button>Popover</Button>
      </Popover>
    </div>
  );
};
