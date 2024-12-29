import { MouseEvent, useMemo, useRef, useState } from 'react';
import { hasRegistered } from '@fepkg/common/utils/hotkey/register';
import { useMemoizedFn } from 'ahooks';
import { max, min, slice } from 'lodash-es';
import { useEventListener } from 'usehooks-ts';
import {
  DetailShowConfig,
  defaultDetailShowConfig,
  useIDCDetailPreference
} from '@/components/IDCDealDetails/hooks/usePreference';
import { useBridgeContext } from '@/pages/Deal/Bridge/providers/BridgeProvider';
import { ArrowAreaEnum } from '@/pages/Deal/Bridge/types';
import { DealContainerData } from '../type';
import { getDisplayItemData } from '../utils';
import { useProductParams } from '@/layouts/Home/hooks';
import { isNCD } from '@fepkg/business/utils/product';

/**
 *
 * 相关行选中的hook，包括
 * 1.键盘上下选中
 * 2.鼠标点击，按住ctrl,shift多行选中
 */

/**
 *
 * @param list 所有的成交明细数据  主界面和合单组中使用
 * @returns
 */
export const useMultiSelectedHook = (list: DealContainerData[], enabled: boolean) => {
  const selectableList = useMemo(() => list.filter(item => item.category === 'deals'), [list]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const lastSelectedRowKey = useRef<string>(); // 最后一次点击的条目id
  // 当前选中的成交单(单个) 的行id
  const [activeRowKey, setActiveRowKey] = useState<string>();
  const { activeArea, setActiveArea } = useBridgeContext();
  const { productType } = useProductParams();

  // 整个容器的ref
  const containerRef = useRef<HTMLDivElement>(null);
  /**  一行成交明细记录组件的ref */
  const itemRef = useRef<HTMLDivElement>(null);

  const selectedDeals = useMemo(
    () => selectableList.filter(item => selectedIds.includes(item.id ?? '')),
    [selectableList, selectedIds]
  );

  const selectedDealIds = useMemo(
    () => selectedDeals.map(item => item?.parent_deal.parent_deal_id || ''),
    [selectedDeals]
  );

  const { getPreferenceValue } = useIDCDetailPreference();

  /** 获取从当前选择的数据中获取展示配置 */
  const getShowConfigByDeals = (copyDeals?: DealContainerData[]): DetailShowConfig => {
    if (!copyDeals?.length) return defaultDetailShowConfig;
    const currentRecord = copyDeals[0];
    const value = getPreferenceValue(currentRecord.groupId);
    return value ?? defaultDetailShowConfig;
  };

  const normalCopy = useMemoizedFn((copyDeals: DealContainerData[]) => {
    const displayItemList = copyDeals.map(item =>
      getDisplayItemData(item, getShowConfigByDeals(copyDeals), false, isNCD(productType))
    );
    let str = '';
    for (const item of displayItemList) {
      str += `${item.index}) ${item.fieldList.join(' ')}`;
      str += '\n';
    }
    window.Main.copy(str);
  });

  // 是否是跨区选择
  const isCrossZoneSelect = (row: DealContainerData) => {
    if (selectedDeals.length === 0) {
      return false;
    }
    return selectedDeals[0].parentGroupId != row.parentGroupId;
  };

  const handleMouseDown = useMemoizedFn((evt: MouseEvent<HTMLElement>, row: DealContainerData) => {
    if (!enabled) return;
    if (activeArea !== ArrowAreaEnum.BridgeRecord) {
      setActiveArea(ArrowAreaEnum.BridgeRecord);
    }
    evt.stopPropagation();
    const rowKey = row.id || '';
    if ((evt.ctrlKey || evt.metaKey) && !isCrossZoneSelect(row)) {
      evt.preventDefault();
      let newSelectedKeys: string[] = [];
      if (selectedIds.includes(rowKey)) {
        newSelectedKeys = selectedIds.filter(k => k !== rowKey);
      } else {
        newSelectedKeys = [...selectedIds, rowKey];
      }
      setSelectedIds(newSelectedKeys);
      normalCopy(selectableList.filter(item => newSelectedKeys.includes(item.id ?? '')));
    } else if (evt.shiftKey && !isCrossZoneSelect(row) && lastSelectedRowKey.current) {
      evt.preventDefault();
      const startIndex = selectableList.findIndex(item => item.id === lastSelectedRowKey.current);
      const endIndex = selectableList.findIndex(item => item.id === row.id);
      if (startIndex >= 0 && endIndex >= 0) {
        const minIndex = min([startIndex, endIndex]) || 0;
        const maxIndex = max([startIndex, endIndex]) || 0;
        const newSelectedKeys = slice(selectableList, minIndex, maxIndex + 1).map(item => item.id || '');
        setSelectedIds(newSelectedKeys);
        normalCopy(selectableList.filter(item => newSelectedKeys.includes(item.id ?? '')));
      }
    } else {
      lastSelectedRowKey.current = rowKey;
      normalCopy(selectableList.filter(item => [rowKey].includes(item.id ?? '')));
      if (selectedIds.length === 1 && selectedIds[0] === rowKey) return;
      setSelectedIds([rowKey]);
    }
  });

  /** 键盘的上下箭头按键触发函数 */
  const handleKeyArrow = useMemoizedFn((evt: KeyboardEvent) => {
    if (!enabled) return;
    if (activeArea !== ArrowAreaEnum.BridgeRecord) return;
    if (evt.code === 'ArrowUp') {
      // 别的地方注册过相关快捷键或者当前选中不止一条的时候不执行
      if (hasRegistered('up') || selectedIds.length !== 1) return;
      evt.preventDefault();
      const lastIndex = selectableList.findIndex(row => (row.id ?? row.parent_deal.parent_deal_id) === selectedIds[0]);
      if (lastIndex > 0) {
        const nextItem = selectableList[lastIndex - 1];
        const rowKey = nextItem.id ?? (nextItem.parent_deal.parent_deal_id || '');
        setSelectedIds([rowKey]);
        lastSelectedRowKey.current = rowKey;
        setActiveRowKey(rowKey);
        requestAnimationFrame(() => {
          itemRef.current?.focus();
        });
      }
    } else if (evt.code === 'ArrowDown') {
      if (hasRegistered('down') || selectedIds.length !== 1) return;
      evt.preventDefault();
      const lastIndex = selectableList.findIndex(row => (row.id ?? row.parent_deal.parent_deal_id) === selectedIds[0]);
      if (lastIndex < selectableList.length - 1) {
        const nextItem = selectableList[lastIndex + 1];
        const rowKey = nextItem.id ?? (nextItem.parent_deal.parent_deal_id || '');
        setSelectedIds([rowKey]);
        lastSelectedRowKey.current = rowKey;
        setActiveRowKey(rowKey);
        requestAnimationFrame(() => {
          itemRef.current?.focus();
        });
      }
    }
  });

  useEventListener('keydown', handleKeyArrow);

  return {
    selectedIds,
    selectedDealIds,
    setSelectedIds,
    selectedDeals,
    handleMouseDown,
    activeRowKey,
    setActiveRowKey,
    itemRef,
    containerRef,
    getShowConfigByDeals
  };
};
