import { useRef, useState } from 'react';
import { PopoverPosition } from '@fepkg/common/types';
import { ContextMenu, MenuItem, SubMenu } from '.';

export default {
  title: '通用组件/ContextMenu',
  component: ContextMenu
};

export const BasicTable = () => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<PopoverPosition>({ x: 0, y: 0 });

  const ref = useRef<HTMLDivElement>(null);

  return (
    <>
      <div
        ref={ref}
        className="h-[500px] p-5 bg-gray-500"
        onContextMenu={evt => {
          evt.preventDefault();
          setVisible(true);
          setPosition({ x: evt.pageX, y: evt.pageY });
        }}
      />
      <ContextMenu
        open={visible}
        position={position}
        onOpenChange={setVisible}
      >
        <MenuItem>Undo</MenuItem>
        <MenuItem
          onClick={() => {
            console.log('Redo');
          }}
        >
          Redo
        </MenuItem>
        <MenuItem disabled>Cut</MenuItem>
        <SubMenu label="Copy as">
          <MenuItem>Text</MenuItem>
          <MenuItem>Video</MenuItem>
          <SubMenu label="Image">
            <MenuItem>.png</MenuItem>
            <MenuItem>.jpg</MenuItem>
            <MenuItem>.svg</MenuItem>
            <MenuItem>.gif</MenuItem>
          </SubMenu>
          <MenuItem>Audio</MenuItem>
        </SubMenu>
        <SubMenu label="Share">
          <MenuItem>Mail</MenuItem>
          <MenuItem>Instagram</MenuItem>
        </SubMenu>
      </ContextMenu>
    </>
  );
};

BasicTable.storyName = '基本使用';
