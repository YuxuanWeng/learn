import { Button } from '@fepkg/components/Button';
import { IconMenuFold } from '@fepkg/icon-park-react';

type HeaderProps = {
  floatingMode?: boolean;
  onExtendClick?: () => void;
};

export const Header = ({ floatingMode, onExtendClick }: HeaderProps) => {
  return floatingMode ? null : (
    <div className="flex items-center justify-between select-none gap-1 h-10">
      {/* 浮动模式不需要展示额外的收起图标 */}
      <Button.Icon
        text
        icon={<IconMenuFold />}
        tooltip={{ content: '收起左边栏', delay: { open: 600 } }}
        onClick={onExtendClick}
      />
    </div>
  );
};
