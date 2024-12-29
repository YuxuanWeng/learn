import cx from 'classnames';
import { Logo } from '@fepkg/components/Logo';
import { useDeveloper } from '@/common/hooks/useDeveloper';
import { useMaximize } from '@/common/hooks/useMaximize';
import { isXintangUat } from '@/common/utils/login';
import { DraggableHeader } from '@/components/HeaderBar/DraggableHeader';
import { Action } from './Action';
import { Meta } from './Meta';

type AppBarProps = {
  beforeClose?: () => Promise<boolean>;
  isHome?: boolean;
};
const bgStyle = 'bg-gray-800 bg-system-status-bar bg-left-top bg-[length:100%_100%] bg-no-repeat';

export const AppBar = ({ beforeClose = () => Promise.resolve(true), isHome }: AppBarProps) => {
  const { toggleMaximize } = useMaximize();
  const { handleOpenSysInfo } = useDeveloper();

  return (
    <DraggableHeader
      className={cx(isHome ? bgStyle : 'bg-gray-700', 'home-appbar flex items-center h-10 z-50')}
      onDoubleClick={toggleMaximize}
    >
      <Logo
        className="pl-4"
        uat={isXintangUat()}
        version={window.appConfig?.version}
        onClick={handleOpenSysInfo}
        onDoubleClick={evt => {
          evt.stopPropagation();
        }}
      />

      <div className="relative flex-1">
        {/* TODO Search */}
        {isHome ? <Meta /> : null}
      </div>

      <Action
        beforeClose={beforeClose}
        isHome={isHome}
      />
    </DraggableHeader>
  );
};
