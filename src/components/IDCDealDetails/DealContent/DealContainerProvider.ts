import { createContainer } from 'unstated-next';
import { MouseEvent } from 'react';

type ContainerProps = {
  onItemContextMenu?: (evt: MouseEvent<HTMLDivElement>) => void;
  onDoubleClick?: () => void;
};

export const DealContainer = createContainer((initialState: ContainerProps | undefined) => {
  return {
    onItemContextMenu: initialState?.onItemContextMenu,
    onDoubleClick: initialState?.onDoubleClick
  };
});

/** 明细内容部分的全局状态 */
export const DealContainerProvider = DealContainer.Provider;
export const useDealContainer = DealContainer.useContainer;
