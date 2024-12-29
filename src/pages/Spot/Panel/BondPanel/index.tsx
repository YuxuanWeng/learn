import { useCallback, useLayoutEffect } from 'react';
import cx from 'classnames';
import { BroadcastChannelEnum } from 'app/types/broad-cast';
import { range } from 'lodash-es';
import { IDCPanel } from '@/components/IDCBoard/Panel';
import { usePanelState } from '../Providers/PanelStateProvider';
import useSpot, { OpenSpotParam } from './useSpot';

export default function BondPanel() {
  const { activeBondTabId, column, isSimplify, width } = usePanelState();

  const BOARD_COUNT = isSimplify ? 16 : 6;

  // 完整模式下的宽
  const widthStyle = isSimplify ? 'w-[300px]' : 'w-[616px]';
  const heightStyle = isSimplify ? 'h-[252px]' : 'h-[328px]';
  const lastRowHeightStyle = isSimplify ? '!h-[252px]' : '!h-[320px]';
  const pxPadding = isSimplify ? 'px-1' : 'px-2';

  const { openSpotPricing } = useSpot();

  const messageForwarder = useCallback(
    (openSpotParam: OpenSpotParam, fromDetail = false) => {
      openSpotPricing(openSpotParam, fromDetail);
    },
    [openSpotPricing]
  );

  useLayoutEffect(() => {
    const createSpotReceiver = window.Broadcast.on(
      BroadcastChannelEnum.BROADCAST_IDC_SPOT_OPEN,
      (message: OpenSpotParam) => {
        messageForwarder(message, true);
      }
    );
    return () => {
      createSpotReceiver();
    };
  }, [messageForwarder]);

  if (!activeBondTabId) return null;

  return (
    <div
      className={cx('flex flex-wrap relative content-start')}
      style={{ width, minWidth: width }}
    >
      {range(BOARD_COUNT).map((_, idx) => {
        const currentRow = Math.floor(idx / column);
        const currentColumn = idx % column;
        const key = `${activeBondTabId}-panel-${idx}`;
        const showRightBorder = currentColumn != column - 1;
        const showBottomBorder = currentRow < BOARD_COUNT / column - 1;

        return (
          <div
            key={key}
            className={cx(
              ' border-0 border-transparent border-solid pb-2 box-border',
              pxPadding,
              showRightBorder && 'border-r-gray-600 !border-r',
              showBottomBorder && ' border-b-gray-600 !border-b',
              !showBottomBorder && cx('!pb-0', lastRowHeightStyle),
              widthStyle,
              heightStyle
            )}
          >
            <IDCPanel
              idx={idx}
              showSubOptimal={!isSimplify}
              onSpot={messageForwarder}
            />
          </div>
        );
      })}
    </div>
  );
}
