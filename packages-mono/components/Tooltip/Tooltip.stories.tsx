import { Tooltip } from '.';

export default {
  title: '通用组件/Tooltip',
  component: Tooltip
};

export const Basic = () => {
  return (
    <Tooltip content="悬停气泡">
      <span>Tooltip will show on mouse enter.</span>
    </Tooltip>
  );
};
