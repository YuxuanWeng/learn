import { useEffect, useRef } from 'react';
import cx from 'classnames';
import { Button } from '@fepkg/components/Button';
import { IconRefresh } from '@fepkg/icon-park-react';
import { UserHotkeyFunction } from '@fepkg/services/types/enum';
import { userHotkeyManager } from '@/common/utils/hotkey';
import { useProductParams } from '@/layouts/Home/hooks';

type ShowAllProps = {
  onShowAll?: () => void;
  disableHotKey?: boolean;
  className?: string;
  // isFilterEmpty?: boolean;
  // disabled?: boolean;
};

const ShowAll = ({ onShowAll, disableHotKey, className }: ShowAllProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { panelId } = useProductParams();

  useEffect(() => {
    if (disableHotKey) {
      return;
    }
    userHotkeyManager.registerInTab(
      UserHotkeyFunction.UserHotkeyShowAll,
      () => {
        buttonRef.current?.click();
      },
      panelId
    );
  }, [buttonRef, panelId, disableHotKey]);

  return (
    <Button
      ref={buttonRef}
      // type={isFilterEmpty ? 'auxiliary-border' : 'auxiliary'}
      // className="min-w-[100px] h-6 truncate select-none transition-none"
      // disabled={disabled}
      type="gray"
      ghost
      icon={<IconRefresh />}
      onClick={onShowAll}
      className={cx('h-7', className)}
    >
      清空条件
    </Button>
  );
};
export default ShowAll;
