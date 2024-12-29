import cx from 'classnames';
import { Button } from '@fepkg/components/Button';
import { IconListFilled, IconListTreeFilled } from '@fepkg/icon-park-react';
import { useFlagSearchChild, useSetFlagSearchChild } from '@/common/atoms';

export const SwitchViewButton = () => {
  const flagSearchChild = useFlagSearchChild();
  const setFlagSearchChild = useSetFlagSearchChild();
  return (
    <div className="mr-4 rounded-lg overflow-hidden border border-solid border-gray-600">
      <Button.Icon
        icon={<IconListFilled />}
        className={cx('h-[30px] w-[30px] rounded-none', !flagSearchChild && 'bg-gray-800')}
        onClick={() => setFlagSearchChild(true)}
      />
      <Button.Icon
        icon={<IconListTreeFilled />}
        size="sm"
        className={cx('h-[30px] w-[30px] rounded-none', flagSearchChild && 'bg-gray-800')}
        onClick={() => setFlagSearchChild(false)}
      />
    </div>
  );
};
