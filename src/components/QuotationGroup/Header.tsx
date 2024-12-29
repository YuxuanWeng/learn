import { Button } from '@fepkg/components/Button';
import { IconAddCircle, IconMenuFold } from '@fepkg/icon-park-react';

type HeaderProps = {
  title: string;
  floatingMode?: boolean;
  onExtendClick?: () => void;
  onAddClick?: () => void;
  disabledAdd?: boolean;
};

export const Header = ({ title, floatingMode, onExtendClick, onAddClick, disabledAdd }: HeaderProps) => {
  return (
    <div className="flex items-center justify-between select-none pr-2">
      <div className="flex items-center h-10">
        {/* 浮动模式不需要展示额外的收起图标 */}
        {!floatingMode && (
          <Button.Icon
            text
            icon={<IconMenuFold />}
            tooltip={{ content: '收起左边栏', delay: { open: 600 } }}
            onClick={onExtendClick}
          />
        )}
        <span className="pl-1 text-sm font-bold text-gray-000">{title}</span>
      </div>
      <Button.Icon
        text
        icon={<IconAddCircle />}
        disabled={disabledAdd}
        tooltip={{ content: disabledAdd ? '看板数量已达上限' : '', visible: true }}
        throttleWait={500}
        onClick={onAddClick}
      />
    </div>
  );
};
