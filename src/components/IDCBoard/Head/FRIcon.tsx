import cx from 'classnames';
import { FRType } from '@fepkg/services/types/enum';

const icons = {
  [FRType.Shibor]: ['S', 'bg-danger-200'],
  [FRType.LPR]: ['L', 'bg-auxiliary-200'],
  [FRType.DR]: ['DR', 'bg-ofr-400'],
  [FRType.Depo]: ['D', 'bg-ofr-200']
};

export const FRIcon = ({ frType }: { frType?: FRType }) => {
  if (!frType || !Object.keys(icons).includes(String(frType))) return null;
  const [abbr, bg] = icons[frType];
  return (
    <i className={cx(bg, 'inline-block h-4 min-w-[16px] px-px text-xs text-white text-center rounded-sm not-italic')}>
      {abbr}
    </i>
  );
};
