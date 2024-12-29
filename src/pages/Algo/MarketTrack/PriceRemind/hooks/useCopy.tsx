import { MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useMemoizedFn } from 'ahooks';
import { isEqual } from 'lodash-es';
import { TypeCardItem } from '../../type';
import { fromCardItemToCopyMsg } from '../../util';

/** 复制的相关逻辑 */
export const useCopyHook = ({ cardList }: { cardList: TypeCardItem[] }) => {
  const [selectedKeyMarketList, setSelectedKeyMarketList] = useState<string[]>([]);

  const copyMsgRef = useRef<string>('');

  const handleMouseDown = useMemoizedFn((evt: MouseEvent<HTMLDivElement>, row: TypeCardItem) => {
    // 如果是鼠标右键
    if (evt.button === 2) return;
    const { keyMarket } = row;
    let selectedList = [keyMarket];
    if (evt.ctrlKey || evt.metaKey) {
      if (!selectedKeyMarketList?.includes(keyMarket)) {
        selectedList = [...selectedKeyMarketList, keyMarket];
      }
    }
    setSelectedKeyMarketList(selectedList);
  });

  const selectedCardList = useMemo(() => {
    return cardList.filter(card => selectedKeyMarketList.includes(card.keyMarket));
  }, [cardList, selectedKeyMarketList]);

  useEffect(() => {
    if (selectedCardList.length > 0) {
      const copyList = selectedCardList.map(card => fromCardItemToCopyMsg(card));
      const copyContent = copyList.join('\n');
      if (!isEqual(copyMsgRef.current, copyContent)) {
        window.Main.copy(copyContent);
        copyMsgRef.current = copyContent;
      }
    }
  }, [selectedCardList]);

  return { handleMouseDown };
};
