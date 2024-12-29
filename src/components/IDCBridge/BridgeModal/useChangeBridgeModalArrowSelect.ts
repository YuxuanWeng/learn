import { KeyboardEventHandler, useEffect, useState } from 'react';
import { useMemoizedFn } from 'ahooks';
import { BridgeOption } from '@/pages/Deal/Bridge/hooks/useBridgeSearch';

type Props = {
  optionList?: BridgeOption[];
  onEnter?: (bridgeOption: BridgeOption) => void;
};

export const useChangeBridgeModalArrowSelect = ({ optionList, onEnter }: Props) => {
  const [bridgeOption, setBridgeOption] = useState<BridgeOption | undefined>(optionList?.[0]);

  const handleKeyDown: KeyboardEventHandler<HTMLElement> = useMemoizedFn(evt => {
    if (!optionList?.length) return;
    if (evt.code === 'ArrowUp') {
      evt.preventDefault();
      const index = optionList?.findIndex(item => item?.key === bridgeOption?.key);
      const nextIndex = index > 0 ? index - 1 : 0;
      setBridgeOption(optionList[nextIndex]);
    }

    if (evt.code === 'ArrowDown') {
      evt.preventDefault();
      const index = optionList?.findIndex(item => item?.key === bridgeOption?.key);
      const nextIndex = index === (optionList?.length || 0) - 1 ? 0 : index + 1;
      setBridgeOption(optionList[nextIndex]);
    }

    if (evt.code === 'Enter') {
      if (bridgeOption) {
        onEnter?.(bridgeOption);
      }
    }
  });

  return {
    bridgeOption,
    setBridgeOption,
    handleKeyDown
  };
};
