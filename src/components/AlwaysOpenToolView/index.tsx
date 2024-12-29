import cx from 'classnames';
import { Button } from '@fepkg/components/Button';
import { atom, useAtom } from 'jotai';
import { isProd } from '@/common/utils';

export const autoCloseAtom = atom(true);

type Props = {
  alignRight?: boolean;
};

export const AlwaysOpenToolView = (props: Props) => {
  const [autoCloseAtomValue, setAutoCloseAtom] = useAtom(autoCloseAtom);

  if (isProd()) return null;

  const leftCls = 'left-2';
  const rightCls = 'right-2';
  return (
    <Button
      type="gray"
      className={cx('absolute top-14', props.alignRight ? rightCls : leftCls)}
      onClick={() => setAutoCloseAtom(prevState => !prevState)}
    >
      {autoCloseAtomValue ? '正常' : '常开'}
    </Button>
  );
};
