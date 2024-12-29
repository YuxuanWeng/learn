import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from '@fepkg/business/hooks/useLocalStorage';

/**
 *  头部区域高度  209(包括dialogTitle和上边的数据展示区域)
 *  报价区域最小高度142(显示2行数据) 默认最小214(显示4行数据)
 *  成交单 referred区域最小高度186(142+36) 36表示分页组件的高度
 *  拖拽线的宽度 1
 *  minClientY = 142(报价区域的最小高度)+ 209(头部区域高度) + 3(dialog边框宽度) +1(拖拽线的宽度) = 355
 * 弹窗框未被占用高度  11(边框3+3 底部未被使用5)

 */

// 鼠标拖拽线的clientY最小值是355
const MIN_CLIENT_Y = 423;
/** 默认成交单区域的最小高度 */
const INIT_MIN_DEAL_TABLE_HEIGHT = 186;
/** 默认报价区域的最小高度 */
const INIT_MIN_QUOTE_TABLE_HEIGHT = 214;
/** 成交单区域的最小高度 */
const MIN_DEAL_TABLE_HEIGHT = 182;
/** 报价区域的最小高度 */
const MIN_QUOTE_TABLE_HEIGHT = 162;
/** 头部区域高度 */
const TOP_AREA_HEIGHT = 256;
/** modal边框宽度 */
const BORDER_WIDTH = 3;
/** dialog最小高度 */
const MIN_DIALOG_HEIGHT = 720;
/** 拖拽线的高度 */
const DRAG_BORDER_WIDTH = 2;

export const useResizeTable = (height: number) => {
  // 内容区高度
  const contentHeight = height < MIN_DIALOG_HEIGHT ? MIN_DIALOG_HEIGHT : height - TOP_AREA_HEIGHT - DRAG_BORDER_WIDTH;
  const [isResizing, setIsResizing] = useState(false);
  const initQuoteHeightPercent =
    INIT_MIN_QUOTE_TABLE_HEIGHT / (INIT_MIN_QUOTE_TABLE_HEIGHT + INIT_MIN_DEAL_TABLE_HEIGHT);
  const [quoteHeightPerCent, setQuoteHeightPerCent] = useLocalStorage(
    'singleBondDetail-quoteHeightPercent',
    initQuoteHeightPercent
  );

  // quoteHeight上半表格高度, dealTableHeight下半表格高度
  const { quoteHeight, dealTableHeight } = useMemo(() => {
    let quoteH = contentHeight * quoteHeightPerCent;
    let dealTableH = contentHeight - quoteH;
    if (quoteH < MIN_QUOTE_TABLE_HEIGHT) {
      quoteH = MIN_QUOTE_TABLE_HEIGHT;
      dealTableH = contentHeight - quoteH;
    } else if (dealTableH < MIN_DEAL_TABLE_HEIGHT) {
      dealTableH = MIN_DEAL_TABLE_HEIGHT;
      quoteH = contentHeight - dealTableH;
    }
    return {
      quoteHeight: quoteH,
      dealTableHeight: dealTableH
    };
  }, [contentHeight, quoteHeightPerCent]);

  const onResize = useCallback(
    e => {
      if (!isResizing) {
        return;
      }
      const { clientY } = e;
      const quoteH = clientY - TOP_AREA_HEIGHT - BORDER_WIDTH;
      const maxClientY = height - MIN_DEAL_TABLE_HEIGHT + BORDER_WIDTH;
      if (clientY >= MIN_CLIENT_Y && clientY <= maxClientY) {
        setQuoteHeightPerCent(quoteH / (height - TOP_AREA_HEIGHT - DRAG_BORDER_WIDTH));
      }
    },
    [height, isResizing]
  );

  const startResize = () => {
    setIsResizing(true);
  };

  const finishResize = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    document.addEventListener('mouseup', finishResize);

    return () => {
      document.removeEventListener('mouseup', finishResize);
    };
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', onResize);

    return () => {
      document.removeEventListener('mousemove', onResize);
    };
  }, [onResize]);

  return {
    startResize,
    quoteHeight,
    dealTableHeight
  };
};
