import { Button } from '@fepkg/components/Button';
import { ModalUtils } from '@fepkg/components/Modal';
import { IconClose, IconCloseCircleFilled, IconFullScreen, IconMinus, IconOffScreen } from '@fepkg/icon-park-react';
import { useMemoizedFn } from 'ahooks';
import { CycleEventEnum } from 'app/types/IPCEvents';
import { useMaximize } from '@/common/hooks/useMaximize';
import { miscStorage } from '@/localdb/miscStorage';

export const Action = ({ beforeClose = () => Promise.resolve(true), isHome = false }) => {
  const { minimize, close } = window.Main;
  const { isMaximize, toggleMaximize } = useMaximize();
  const onClose = useMemoizedFn(async () => {
    if (isHome) {
      miscStorage.offset = undefined;
      await window.Main.invoke(CycleEventEnum.UserHomeClose);
    }
    await beforeClose();
    close();
  });

  const onConfirm = useMemoizedFn(() => {
    ModalUtils.error({
      title: '关闭',
      okText: '关闭系统',
      content: '关闭系统后将无法接收报价数据、点价指令等',
      icon: <IconCloseCircleFilled className="text-danger-100" />,
      onOk: onClose
    });
  });

  return (
    <section
      className="flex-center gap-8 w-[168px] h-full undraggable"
      onClick={e => e.stopPropagation()}
      onDoubleClick={e => e.stopPropagation()}
    >
      <Button.Icon
        text
        icon={<IconMinus />}
        onClick={e => {
          e.stopPropagation();
          minimize();
        }}
      />
      <Button.Icon
        text
        icon={isMaximize ? <IconOffScreen /> : <IconFullScreen />}
        onClick={e => {
          e.stopPropagation();
          toggleMaximize();
        }}
      />
      <Button.Icon
        text
        icon={<IconClose />}
        onClick={e => {
          e.stopPropagation();
          if (isHome) {
            onConfirm();
          } else {
            onClose();
          }
        }}
      />
    </section>
  );
};
