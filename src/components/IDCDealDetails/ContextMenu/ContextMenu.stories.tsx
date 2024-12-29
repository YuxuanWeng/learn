import { useRef, useState } from 'react';
import { PopoverPosition } from '@fepkg/common/types';
import { ContextMenu, MenuItem } from '.';

export default {
  title: 'IDC业务组件/成交明细/右键菜单',
  component: ''
};

export const ContextMenu1 = () => {
  const [visible, setVisible] = useState(false);
  const [anchorPoint, setPosition] = useState<PopoverPosition>({ x: 0, y: 0 });

  const ref = useRef<HTMLDivElement>(null);

  return (
    <>
      <div
        ref={ref}
        className="h-[500px] p-5 bg-white"
        onContextMenu={evt => {
          evt.preventDefault();
          setVisible(true);
          setPosition({ x: evt.pageX, y: evt.pageY });
        }}
      />
      <ContextMenu
        open={visible}
        position={anchorPoint}
        onOpenChange={val => {
          setVisible(val);
        }}
      >
        <MenuItem>Undo</MenuItem>
        <MenuItem>Redo</MenuItem>
        <MenuItem>Cut</MenuItem>
      </ContextMenu>
    </>
  );
};

ContextMenu1.storyName = '基本使用';
