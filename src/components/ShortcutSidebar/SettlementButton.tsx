import { MouseEventHandler, forwardRef, useState } from 'react';
import { PopoverPosition } from '@fepkg/common/types';
import { Button } from '@fepkg/components/Button';
import { ContextMenu, MenuItem } from '@fepkg/components/ContextMenu';
import { Popconfirm } from '@fepkg/components/Popconfirm';
import { Tooltip } from '@fepkg/components/Tooltip';
import { IconDeleteFilled, IconEdit } from '@fepkg/icon-park-react';

type SettlementButtonProps = {
  /** 显示文案 */
  label: string;
  /** 是否被禁用 */
  disabled?: boolean;
  /** 是否展示删除菜单 */
  showDelete?: boolean;
  /** 点击按钮时的回调 */
  onClick?: () => void;
  /** 点击编辑按钮时的回调 */
  onEdit?: () => void;
  /** 点击确认删除时的回调 */
  onDelete?: () => void;
};

export const SettlementButton = forwardRef<HTMLButtonElement, SettlementButtonProps>(
  ({ label, disabled, showDelete, onClick, onEdit, onDelete }, ref) => {
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState<PopoverPosition>({ x: 0, y: 0 });
    const [popconfirmOpen, setPopconfirmOpen] = useState(false);

    const handleEdit = () => {
      if (disabled) return;
      onEdit?.();
    };

    const handleContextMenu: MouseEventHandler<HTMLElement> = evt => {
      if (disabled || !showDelete) return;
      setVisible(true);
      setPosition({ x: evt.pageX, y: evt.pageY });
    };

    const handlePopconfirmShow = () => {
      if (disabled) return;
      setPopconfirmOpen(true);
    };

    return (
      <>
        <Popconfirm
          type="danger"
          trigger="manual"
          content="确认删除该条备注吗？"
          placement="left"
          destroyOnClose
          confirmBtnProps={{ label: '删除' }}
          open={popconfirmOpen}
          onOpenChange={setPopconfirmOpen}
          onConfirm={onDelete}
        >
          <div className="flex bg-gray-800 border border-solid border-gray-800 rounded-lg select-none overflow-hidden">
            <Tooltip
              placement="top-start"
              content={label}
            >
              <button
                tabIndex={-1}
                ref={ref}
                className="flex items-center flex-1 flex-nowrap px-3 text-gray-000 bg-transparent border-none hover:text-primary-000 active:text-primary-100 disabled:cursor-not-allowed disabled:text-gray-300"
                disabled={disabled}
                onClick={onClick}
                onContextMenu={handleContextMenu}
              >
                <span className="inline-block w-[70px] text-sm text-start truncate">{label}</span>
              </button>
            </Tooltip>

            <Button.Icon
              icon={<IconEdit />}
              className="w-6.5 h-6.5 !rounded-none"
              disabled={disabled}
              onClick={handleEdit}
            />
          </div>
        </Popconfirm>

        {showDelete && (
          <ContextMenu
            open={showDelete && visible}
            position={position}
            className="!p-0 !min-w-fit"
            onOpenChange={setVisible}
          >
            <MenuItem
              className="flex-center gap-2 !w-[116px] !h-9 !text-sm"
              icon={<IconDeleteFilled />}
              onClick={handlePopconfirmShow}
            >
              删除备注
            </MenuItem>
          </ContextMenu>
        )}
      </>
    );
  }
);
