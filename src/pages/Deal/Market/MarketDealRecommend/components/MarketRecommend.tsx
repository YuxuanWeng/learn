import { useEffect, useRef } from 'react';
import { BondQuoteTableColumnKey } from '@fepkg/business/components/QuoteTableCell/types';
import { Button } from '@fepkg/components/Button';
import { Table } from '@fepkg/components/Table';
import { IconClose, IconManage, IconPin, IconPushpin } from '@fepkg/icon-park-react';
import { useLongPress, useMemoizedFn } from 'ahooks';
import { BasicTarget } from 'ahooks/es/utils/domTarget';
import { DialogEvent } from 'app/types/IPCEvents';
import { DialogChannelAction } from 'app/types/dialog-v2';
import { useParentPort } from '@/common/atoms';
import { MARKET_RECOMMEND_TABLE_COLUMN } from '@/common/constants/table';
import { useDialogWindow } from '@/common/hooks/useDialog';
import { DRAGGABLE_DELAY, useDraggable } from '@/components/HeaderBar/useDraggable';
import { useDialogLayout } from '@/layouts/Dialog/hooks';
import { useProductParams } from '@/layouts/Home/hooks';
import { DealTableColumn, DealTableMouseEvent } from '@/pages/ProductPanel/components/DealTable/types';
import { ProductPanelTableKey } from '@/pages/ProductPanel/types';
import { marketRecommendColumns } from '../columns';
import { LineHeight, PaddingY, WindowWidth } from '../constants';
import { usePanelData } from '../hook/usePanelData';
import { usePanelParams } from '../hook/usePanelParams';
import { useSettings } from '../hook/useSettings';
import { getDealRecommendSettingDialogConfig } from '../utils';

export const MarketRecommend = () => {
  const { cancel } = useDialogLayout();
  const { productType } = useProductParams();
  const { panelId } = usePanelParams();
  const { handleLongPress, handleMouseUp } = useDraggable(true);
  const { openDialog } = useDialogWindow();
  const ref = useRef<HTMLDivElement>(null);
  useLongPress(
    event => {
      handleLongPress(event);
    },
    ref as BasicTarget,
    { delay: DRAGGABLE_DELAY, moveThreshold: { x: 5, y: 5 } }
  );
  const { pageSize, isMy, isTop, setIsTop } = useSettings(productType);
  const { data } = usePanelData({ productType, pageSize, isMy });
  const firstUpdate = useRef(true);

  function onTopChange() {
    window.Main.invoke(DialogEvent.SetDialogAlwaysOnTop, !isTop).then(val => {
      if (val != null) setIsTop(val);
    });
  }

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    window.Main.invoke(DialogEvent.SetWindowSize, WindowWidth, Math.min(pageSize * LineHeight + PaddingY, 500));
  }, [pageSize]);

  // 与父窗口全局搜索联动
  const { post } = useParentPort();

  const handleCellDoubleClick: DealTableMouseEvent = useMemoizedFn((_, original) => {
    const { short_name, bond_key } = original.original.bond_basic_info;

    post({
      action: DialogChannelAction.UpdateGlobalSearch,
      panelId,
      tableKey: ProductPanelTableKey.Deal,
      bond_key_list: [bond_key],
      user_input: short_name
    });
  });

  return (
    <div
      ref={ref}
      className="relative flex flex-col h-full p-3 bg-gray-700"
      onMouseUp={handleMouseUp}
    >
      <div className="absolute z-floating -top-px -right-px py-1 px-2 flex gap-4 justify-center rounded-[8px] border border-solid border-gray-600 bg-gray-800/80 opacity-0 hover:opacity-100 duration-200">
        <Button.Icon
          type="transparent"
          icon={<IconManage />}
          className="h-7 w-7 p-px"
          onClick={() => openDialog(getDealRecommendSettingDialogConfig(productType))}
        />
        <Button.Icon
          type="transparent"
          icon={isTop ? <IconPushpin /> : <IconPin />}
          className="h-7 w-7 p-px"
          onClick={() => onTopChange()}
        />
        <Button.Icon
          type="transparent"
          icon={<IconClose />}
          className="h-7 w-7 p-px"
          onClick={() => cancel()}
        />
      </div>
      <Table<DealTableColumn, BondQuoteTableColumnKey>
        className="h-full rounded-lg s-table-rounded-l s-table-rounded-r border border-solid border-gray-600"
        active
        zebra
        showHeader={false}
        data={data?.list ?? []}
        columns={marketRecommendColumns}
        rowKey={original => original.original.deal_id}
        columnSettings={MARKET_RECOMMEND_TABLE_COLUMN}
        pageSize={pageSize}
        onCellDoubleClick={handleCellDoubleClick}
        placeholderSize={pageSize < 10 ? 'xs' : 'sm'}
        showPlaceholder={!(pageSize < 3)}
      />
    </div>
  );
};
