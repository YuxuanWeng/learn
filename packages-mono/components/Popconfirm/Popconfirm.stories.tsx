import { Button } from '@fepkg/components/Button';
import { Popconfirm } from './Popconfirm';

export default {
  title: '通用组件/Popconfirm',
  components: Popconfirm
};

export const Basic = () => {
  return (
    <div className="flex gap-4">
      <Popconfirm
        type="danger"
        content="简单操作文案控制在一行内"
        confirmBtnProps={{ label: '删除' }}
      >
        <Button type="danger">Delete</Button>
      </Popconfirm>

      <Popconfirm content="简单操作文案控制在一行内">
        <Button>Warning</Button>
      </Popconfirm>
    </div>
  );
};
