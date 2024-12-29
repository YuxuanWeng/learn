import { ReactNode } from 'react';
import cx from 'classnames';
import { Button } from '@fepkg/components/Button';
import { IconClose } from '@fepkg/icon-park-react';
import LoadingApng from '@/assets/image/app-loading.apng';
import { captureMessage } from '@sentry/react';
import { CommonRoute } from 'app/types/window-v2';
import { miscStorage } from '@/localdb/miscStorage';
import styles from './style.module.less';

type RouterLoadingProps = {
  showClose?: boolean;
};

const handleIsHomeOrProduct = () => {
  const { hash } = window.location;
  const homeReg = new RegExp(`^#${CommonRoute.Home}/`);
  const productReg = new RegExp(`^#${CommonRoute.ProductPanel}/`);
  return homeReg.test(hash) || productReg.test(hash);
};

const RouterLoading = ({ showClose = true }: RouterLoadingProps) => {
  const handleClose = () => {
    if (!showClose) return;

    const { close } = window.Main;

    if (window === undefined) captureMessage('RouterLoading has no window', { extra: { window } });
    else if (window.Main === undefined)
      captureMessage('RouterLoading has no window.Main', { extra: { windowMain: window.Main } });
    else if (close === undefined) captureMessage('RouterLoading has no Close function', { extra: { Close: close } });
    else if (window.close === undefined)
      captureMessage('RouterLoading has no window.close function', { extra: { windowClose: window?.close } });

    try {
      close?.();
      miscStorage.offset = undefined;
    } catch {
      window?.close?.();
    }
  };

  const icon: ReactNode = <IconClose />;
  return (
    <>
      <div className={styles.router_loading}>
        <img
          src={LoadingApng}
          alt="router-loading"
          width={84}
          height={42}
        />
        <div className="text-gray-200 font-normal text-sm">加载中...</div>
      </div>

      {showClose && (
        <Button.Icon
          className={cx(
            'absolute  bg-gray-800',
            handleIsHomeOrProduct() ? 'right-[16px] top-[8px]' : 'right-[17px] top-[17px]'
          )}
          key="loading_close"
          icon={icon}
          onClick={handleClose}
        />
      )}
    </>
  );
};

export default RouterLoading;
