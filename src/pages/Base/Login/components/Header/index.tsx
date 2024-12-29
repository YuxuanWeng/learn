import { Button } from '@fepkg/components/Button';
import { Logo } from '@fepkg/components/Logo';
import { IconClose, IconMinus } from '@fepkg/icon-park-react';
import { isXintangUat } from '@/common/utils/login';
import { ForceOpenDevTools } from '@/components/ForceOpenDevTools';

export const Header = () => {
  return (
    <header className="relative flex justify-between items-center h-14 px-4 draggable">
      <div className="flex items-center h-7">
        <Logo
          uat={isXintangUat()}
          version={window.appConfig?.version}
        />
      </div>

      <section className="flex justify-center gap-4 undraggable">
        <Button.Icon
          text
          icon={<IconMinus />}
          onClick={() => window.Main.minimize()}
        />
        <Button.Icon
          text
          icon={<IconClose />}
          onClick={() => window.Main.close()}
        />
      </section>

      <ForceOpenDevTools
        content={' '}
        className="absolute right-0 w-4 h-full -translate-y-1/2 top-1/2"
      />
    </header>
  );
};
