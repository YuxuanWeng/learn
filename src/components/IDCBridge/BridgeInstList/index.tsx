import { FC, useCallback, useEffect, useMemo, useRef } from 'react';
import { useVirtual } from 'react-virtual';
import cx from 'classnames';
import { Button } from '@fepkg/components/Button';
import { Caption } from '@fepkg/components/Caption';
import { Placeholder } from '@fepkg/components/Placeholder';
import { IconAdd, IconMenuUnfold } from '@fepkg/icon-park-react';
import { BridgeInstInfo } from '@fepkg/services/types/bds-common';
import { useMemoizedFn } from 'ahooks';
import { useAtom, useSetAtom } from 'jotai';
import { isEqual, uniqWith } from 'lodash-es';
import { useDialogWindow } from '@/common/hooks/useDialog';
import BridgeSearch from '@/components/IDCBridge/SearchFilter/BridgeSearch';
import { useProductParams } from '@/layouts/Home/hooks';
import { searchBridgeIdListAtom, selectedRecordIdsAtom } from '@/pages/Deal/Bridge/atoms';
import useBridge from '@/pages/Deal/Bridge/hooks/useBridge';
import { useBridgeArrowSelect } from '@/pages/Deal/Bridge/hooks/useBridgeArrowSelect';
import { useBridgeInstList } from '@/pages/Deal/Bridge/hooks/useBridgeInstList';
import { useBridgeContext } from '@/pages/Deal/Bridge/providers/BridgeProvider';
import { ArrowAreaEnum, TypeBridge, TypeBridgeId } from '@/pages/Deal/Bridge/types';
import { getIDCBridgeConfig } from '@/pages/Spot/utils/openDialog';
import { BridgeInstItem } from './BridgeInstItem';

const toIdArr = (list: TypeBridge[]) =>
  list.map(item => ({
    isSticky: item.isSticky,
    bridge_inst_id: item.bridge.bridge_inst_id
  }));

type Props = {
  /** 额外的样式 */
  className?: string;
  /** 是否允许上下健切换桥 */
  allowArrowSelect?: boolean;
  /** 是否支持双击打开桥界面 */
  enableOpenBridge?: boolean;
  /** 是否展示收起桥列表icon */
  showMenuUnFoldIcon?: boolean;
  /** 搜索框样式 */
  inputClassName?: string;
  /** 被拖拽到自己之时触发 */
  onDrop?: (val: BridgeInstInfo) => void;
  /** 点击收起桥列表按钮的响应时间 */
  onUnFoldIconClick?: () => void;
};

/**
 * 桥机构列表
 */
export const BridgeInstList: FC<Props> = ({
  allowArrowSelect = true,
  className,
  inputClassName,
  enableOpenBridge,
  showMenuUnFoldIcon,
  onUnFoldIconClick,
  onDrop
}) => {
  const { productType } = useProductParams();

  const [searchBridgeIdList] = useAtom(searchBridgeIdListAtom);
  const setSelectedBridgeRecordIds = useSetAtom(selectedRecordIdsAtom);
  const { stickyList, setStickyList, addBridge } = useBridge();

  const { accessCache, activeKeyBridgeInst, bridgeInstItemRef, activeArea, setActiveArea } = useBridgeContext();

  const { bridgeList: rawList } = useBridgeInstList();
  const findIdIdx = useCallback(
    (bridge: BridgeInstInfo) => stickyList.findIndex(item => item.bridge_inst_id === bridge.bridge_inst_id),
    [stickyList]
  );

  // 带有置顶数据的bridgeList
  const bridgeList: TypeBridge[] = useMemo(
    () =>
      rawList
        .sort((a, b) => {
          const ia = findIdIdx(a);
          const ib = findIdIdx(b);
          if (ia < 0) return 1;
          if (ib < 0) return -1;
          return ia - ib;
        })
        .map(bridge => ({
          bridge,
          isSticky: stickyList.find(item => item.bridge_inst_id === bridge.bridge_inst_id)?.isSticky
        })),
    [rawList, findIdIdx, stickyList]
  );

  useBridgeArrowSelect({ bridgeList, disabled: !allowArrowSelect });

  const containerRef = useRef<HTMLDivElement>(null);
  const { virtualItems, totalSize, scrollToIndex } = useVirtual({
    size: bridgeList?.length ?? 0,
    parentRef: containerRef,
    estimateSize: useCallback(() => 36, []),
    overscan: 30
  });

  const paddingTop = virtualItems.length > 0 ? virtualItems[0]?.start ?? 0 : 0;
  const paddingBottom = virtualItems.length > 0 ? totalSize - (virtualItems.at(-1)?.end ?? 0) : 0;

  /** 置顶逻辑 */
  const toSticky = (id: string) => {
    const arr: TypeBridgeId[] = uniqWith(
      [
        {
          bridge_inst_id: id,
          isSticky: true
        },
        ...stickyList
      ],
      isEqual
    );
    setStickyList(arr);
  };

  /** 取消置顶逻辑 */
  const cancelSticky = (id: string) => {
    const idArr = toIdArr(bridgeList);
    const idx = idArr.findIndex(item => item.bridge_inst_id === id);
    if (idx === -1) return;
    const arr: TypeBridgeId[] = [...idArr];
    const deleted: TypeBridgeId[] = arr.splice(idx, 1);
    let lastStickyIdx = -1;
    for (let i = arr.length - 1; i > -1; i--) {
      if (arr[i].isSticky) {
        lastStickyIdx = i;
        break;
      }
    }
    const insertItem = deleted.shift();
    if (!insertItem) return;
    insertItem.isSticky = false;
    if (lastStickyIdx > -1) arr.splice(lastStickyIdx + 1, 0, insertItem);
    else arr.unshift(insertItem);
    setStickyList(arr);
  };

  const { bridge, setBridge: contextSetBridge } = useBridgeContext();

  // 是否有本地操作
  // 若没有本地操作且bridge改变则需要滚动到目标位置
  const localOperationRef = useRef(false);

  const setBridge = (val: BridgeInstInfo | undefined) => {
    contextSetBridge(val == null ? val : { ...val });
    localOperationRef.current = true;
  };

  const { openDialog } = useDialogWindow();

  useEffect(() => {
    if (bridge) {
      const newBridge = bridgeList.find(item => item.bridge.bridge_inst_id === bridge.bridge_inst_id)?.bridge;
      if (!isEqual(newBridge, bridge)) {
        setBridge(newBridge);
      }
      return;
    }
    setBridge(bridgeList[0]?.bridge);
  }, [bridge, bridgeList]);

  useEffect(() => {
    if (localOperationRef.current) {
      localOperationRef.current = false;
      return;
    }

    const targetIndex = bridgeList.findIndex(i => bridge?.bridge_inst_id === i.bridge.bridge_inst_id);

    if (targetIndex !== -1) {
      scrollToIndex(targetIndex, { align: 'start' });
    }
  }, [bridge]);

  const onSelectedBridgeInst = (item: TypeBridge) => () => {
    setBridge(item.bridge);
  };

  const bridgeInstListOnClick = useMemoizedFn(() => {
    if (activeArea !== ArrowAreaEnum.Bridge) {
      setActiveArea(ArrowAreaEnum.Bridge);
    }
    setSelectedBridgeRecordIds([]);
  });

  const onBridgeSelect = (selectedBridge?: BridgeInstInfo) => {
    setBridge(selectedBridge);

    const targetIndex = bridgeList.findIndex(i => selectedBridge?.bridge_inst_id === i.bridge.bridge_inst_id);

    if (targetIndex !== -1) {
      scrollToIndex(targetIndex, { align: 'start' });
    }
  };

  const bridgeAddDisabled = !accessCache.bridgeInstEdit;

  return (
    <div
      className={cx(className, 'flex-col shrink-0 bg-gray-750 w-50 h-full transition-margin duration-200 ease-linear')}
    >
      {/* 第一行 标题与功能键 */}
      <div className="flex h-12 items-center justify-between border-0 px-3">
        <Caption>桥列表</Caption>
        <div className="flex items-center gap-2">
          <Button.Icon
            type="primary"
            className="w-6 h-6"
            icon={<IconAdd size={16} />}
            disabled={bridgeAddDisabled}
            tooltip={{ content: '添加桥机构', placement: 'bottom' }}
            throttleWait={500}
            onClick={addBridge}
            plain
          />
          {showMenuUnFoldIcon && (
            <Button.Icon
              icon={<IconMenuUnfold />}
              tooltip={{ content: '收起桥列表', delay: { open: 600 } }}
              onClick={onUnFoldIconClick}
            />
          )}
        </div>
      </div>
      <div className="component-dashed-x-600 h-px" />
      {/* 第二行 定位搜索框 */}
      <div className="flex py-3 px-3">
        <BridgeSearch
          className={cx(inputClassName, '!h-8 bg-gray-700 rounded-lg w-full')}
          onSelect={onBridgeSelect}
        />
      </div>
      <div
        className={cx(
          bridgeList.length === 0 && 'flex flex-col justify-center items-center',
          'h-[calc(100%_-_115px)] overflow-y-overlay overflow-x-hidden'
        )}
        ref={containerRef}
        onClick={bridgeInstListOnClick}
      >
        {bridgeList.length ? (
          virtualItems?.map((v, i) => {
            const item = bridgeList[v.index];
            return (
              <div
                key={item.bridge.bridge_inst_id}
                style={{ height: v.size }}
                className={i === 0 ? '' : 'mt-1'}
              >
                {paddingTop > 0 && <div style={{ height: paddingTop }} />}
                <BridgeInstItem
                  bridge={item.bridge}
                  toSticky={toSticky}
                  cancelSticky={cancelSticky}
                  isSticky={item.isSticky}
                  isSelected={bridge?.bridge_inst_id === item.bridge.bridge_inst_id}
                  total={item.bridge.receipt_deal_count ?? 0}
                  isSearched={searchBridgeIdList.includes(item.bridge.bridge_inst_id)}
                  ref={item.bridge.bridge_inst_id === activeKeyBridgeInst ? bridgeInstItemRef : undefined}
                  onSelected={onSelectedBridgeInst(item)}
                  onDoubleClick={data => {
                    if (!accessCache.bridge) return;
                    if (enableOpenBridge) {
                      openDialog(getIDCBridgeConfig(productType, data?.bridge_inst_id));
                    }
                  }}
                  onDrop={onDrop}
                />
                {paddingBottom > 0 && <div style={{ height: paddingBottom }} />}
              </div>
            );
          })
        ) : (
          <Placeholder
            size="xs"
            type="no-setting"
            label="暂未添加桥"
          />
        )}
      </div>
    </div>
  );
};
