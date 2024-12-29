import { useEffect } from 'react';
import { usePanelParams, usePanelState } from '../Panel';
import { toggleRootElOpacity } from '../utils';

export const useOpacity = () => {
  const { defaultParams } = usePanelParams();
  const { opacityChangedByCancel } = usePanelState();

  // 在页面渲染初始值渲染完之后再把变为不透明，目的是防止打开面板时 UI 的闪烁
  useEffect(() => {
    if (opacityChangedByCancel.current) {
      opacityChangedByCancel.current = false;
    } else {
      toggleRootElOpacity(true);
    }
  }, [defaultParams, opacityChangedByCancel]);
};
