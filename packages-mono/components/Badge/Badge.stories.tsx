import { Badge } from '.';

export default {
  title: '通用组件/Badge',
  component: Badge
};

export const Basic = () => {
  return (
    <div className="flex flexcol gap-2">
      <Badge statusProps={{ dot: true }}>胡歌</Badge>
      <Badge statusProps={{ count: 10 }}>胡歌</Badge>
      <Badge statusProps={{ count: 1, offset: ['1px', '2px'] }}>胡歌</Badge>
    </div>
  );
};
