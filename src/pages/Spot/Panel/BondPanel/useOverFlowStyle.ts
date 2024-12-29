import { useState } from 'react';
import { useMatch } from 'react-router-dom';
import { useEventListener } from 'usehooks-ts';
import { trackPoint } from '@/common/utils/logger/point';
import { IDCMainBrowserWindowParams } from '../../utils/openDialog';

export default function useOverFlowStyle() {
  const match = useMatch('/idc');
  // 高度溢出后怎么处理
  const [overflowStyle, setOverflowStyle] = useState('overflow-y-overlay');
  // 监听窗口大小，当窗口尺寸达到最小尺寸的时候，无论是纵向还是横向都不能滚动
  const onResize = ev => {
    if (!match) return;
    const h = ev.target.innerHeight as number;
    const w = ev.target.innerWidth as number;
    setOverflowStyle(() => {
      // 窗口最小尺寸是620*620，初始尺寸和尺寸限制在这里调整=>src/pages/idc/BNCPanel/LoadingDialog/utils.ts
      const { minWidth, minHeight } = IDCMainBrowserWindowParams;
      if (w <= minWidth && h <= minHeight) {
        trackPoint('min-window-size');
        return 'overflow-y-hidden';
      }
      return 'overflow-y-overlay';
    });
  };
  useEventListener('resize', onResize);

  return { overflowStyle };
}
