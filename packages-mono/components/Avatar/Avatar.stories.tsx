import { Avatar } from '.';

export default {
  title: '通用组件/Avatar',
  component: Avatar
};

export const Basic = () => {
  return (
    <div className="flex flexcol gap-2">
      <Avatar>胡歌</Avatar>
      <Avatar background="bg-danger-100">胡歌</Avatar>
      <Avatar size="large">胡歌</Avatar>
    </div>
  );
};
