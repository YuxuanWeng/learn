import { ReactNode, useRef, useState } from 'react';
import cx from 'classnames';
import { UpdatesBadge } from '@fepkg/business/components/DiffTable';
import { CP_NONE, getCP } from '@fepkg/business/utils/get-name';
import { PopoverPosition } from '@fepkg/common/types';
import { Button } from '@fepkg/components/Button';
import { ContextMenu, MenuItem } from '@fepkg/components/ContextMenu';
import { Popconfirm } from '@fepkg/components/Popconfirm';
import { Tooltip } from '@fepkg/components/Tooltip';
import { IconBridgeText, IconDelete, IconEdit, IconRightArrow, IconTime, IconView } from '@fepkg/icon-park-react';
import { BridgeInstInfo, ReceiptDeal, ReceiptDealDetail } from '@fepkg/services/types/bds-common';
import { useOnClickOutside } from 'usehooks-ts';
import { dealDiffMarkRead } from '@/common/services/api/deal/diff-mark-read';
import { useProductParams } from '@/layouts/Home/hooks';
import { useBridgeContext } from '@/pages/Deal/Bridge/providers/BridgeProvider';
import { ContextMenuEnum } from '@/pages/Deal/Bridge/types';
import { DiffModal } from '@/pages/Deal/Detail/components/DiffModal.tsx';
import { transformReceiptDeal2DiffType } from '@/pages/Deal/Detail/utils';
import { BridgeModal } from '../IDCBridge/BridgeModal';
import { DiffDealType } from '../IDCDealDetails/type';
import { BridgeIconButton } from './bridge-button';
import { DealDetailItem, IDCDealDetailItemType } from './item';

export type DealDetailListProps = {
  data: ReceiptDealDetail[];
  getKey: (item: ReceiptDealDetail) => string;
  getFieldRender: (item: ReceiptDealDetail) => ReactNode;
  getBidName: (item: ReceiptDealDetail) => string;
  getOfrName: (item: ReceiptDealDetail) => string;
  getInternalCode: (item: ReceiptDealDetail) => string;
  getCreateTime: (item: ReceiptDealDetail) => string;
  getItemType: (item: ReceiptDealDetail) => IDCDealDetailItemType;
  menuItems: DealDetailListMenuItem[];
  bridgeListVisible?: boolean;
  className?: string;
  selectedKeys: string[];
  highlightKeys: string[];
  onSelectBridgeInst: (inst?: BridgeInstInfo) => void;
  showDelete?: boolean;
  onChangeShowDelete?: (show: boolean) => void;
  onDeleteBridge?: VoidFunction;
  onClickEdit?: (item: ReceiptDealDetail) => void;
  onClickDelete?: (item: ReceiptDealDetail) => void;
  onClickLog?: (item: ReceiptDealDetail) => void;
  getHighlightEdit?: (item: ReceiptDealDetail) => boolean;
  onSelect?: (items: ReceiptDealDetail[]) => void;
  onOpenSelectDealContext?: (item: ReceiptDealDetail, target: ReceiptDeal) => void;
  getDisableDelete?: (item: ReceiptDealDetail) => boolean;
  currentBridgeInst?: BridgeInstInfo;
  onDoubleClick?: () => void;
  hiddenInstIds?: string[];
};

export type DealDetailListMenuItem = {
  key: ContextMenuEnum;
  label: string;
  disabled?: boolean;
  onClick: VoidFunction;
};

const btnCls = 'w-6 h-6 p-0';

type CPItem = {
  text: string;
  isSelf: boolean;
  key: string;
};

export const CPItemRender = ({ list }: { list: CPItem[] }) => {
  return (
    <div className="flex items-center gap-x-2 flex-wrap max-w-[800px]">
      {list.map((i, index) => (
        <div
          className="flex items-center gap-x-2"
          key={i.key}
        >
          {index !== 0 && index !== list.length - 1 && <UpdatesBadge type="purple-bridge" />}
          <div className={cx('text-sm', i.isSelf ? 'text-primary-100' : 'text-gray-100')}>{i.text}</div>
          {index < list.length - 1 && <IconRightArrow className="text-gray-100" />}
        </div>
      ))}
    </div>
  );
};

export function DealDetailList({
  data,
  getKey,
  getFieldRender: getFieldText,
  getBidName,
  getOfrName,
  getInternalCode,
  getCreateTime,
  getItemType,
  getHighlightEdit,
  menuItems,
  bridgeListVisible = false,
  onSelectBridgeInst,
  showDelete = false,
  onChangeShowDelete,
  onDeleteBridge,
  onClickEdit,
  onClickDelete,
  onClickLog,
  onSelect,
  onDoubleClick,
  hiddenInstIds = [],
  selectedKeys,
  highlightKeys,
  currentBridgeInst,
  onOpenSelectDealContext,
  getDisableDelete,
  className
}: DealDetailListProps) {
  const [shiftSelectStartIndex, setShiftSelectStartIndex] = useState<number>();
  const [contextVisible, setContextVisible] = useState(false);
  // 加多桥选择弹窗
  const [dealSelectVisible, setDealSelectVisible] = useState(false);
  // 加多桥时当前选中的单
  const [dealSelectItem, setEditingItem] = useState<ReceiptDealDetail>();
  const [anchorPosition, setAnchorPosition] = useState<PopoverPosition>({ x: 0, y: 0 });

  const { productType } = useProductParams();

  const [curDiff, setCurDiff] = useState<DiffDealType & { parentDealId: string }>();

  const selectKey = (keys: string[]) => {
    onSelect?.(data.filter(i => keys.includes(getKey(i))));
  };

  const deleteRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(deleteRef, () => {
    onChangeShowDelete?.(false);
  });

  const { accessCache } = useBridgeContext();

  const getCpList = (record: ReceiptDealDetail) => {
    const arr: CPItem[] = [];

    const details = record.details ?? [];

    for (const [index, detail] of details.entries()) {
      const { bid_trade_info, ofr_trade_info } = detail;
      const isStart = index === 0;
      const isEnd = index === details.length - 1;

      if (isStart) {
        arr.push({
          text: getCP({ productType, inst: bid_trade_info.inst, trader: bid_trade_info.trader, placeholder: CP_NONE }),
          isSelf: false,
          key: bid_trade_info.inst?.inst_id ?? index.toString()
        });
      }

      if (isEnd) {
        arr.push({
          text: getCP({ productType, inst: ofr_trade_info.inst, trader: ofr_trade_info.trader, placeholder: CP_NONE }),
          isSelf: false,
          key: ofr_trade_info.inst?.inst_id ?? index.toString()
        });
      } else {
        arr.push({
          text: getCP({ productType, inst: ofr_trade_info.inst, trader: ofr_trade_info.trader, placeholder: CP_NONE }),
          isSelf:
            ofr_trade_info.inst?.inst_id != null &&
            ofr_trade_info.inst?.inst_id === currentBridgeInst?.contact_inst.inst_id,
          key: ofr_trade_info.inst?.inst_id ?? index.toString()
        });
      }
    }
    return [...arr].reverse();
  };

  const renderList = () => {
    return data.map((i, index) => {
      const curKey = getKey(i);
      const selected = selectedKeys.includes(curKey);
      const highlighted = highlightKeys.includes(curKey);

      const diff = transformReceiptDeal2DiffType(productType, i);

      return (
        <DealDetailItem
          className={cx('mb-2', index === 0 && 'mt-2')}
          onContextMenu={evt => {
            setContextVisible(true);
            setAnchorPosition({ x: evt.pageX, y: evt.pageY });
            if (!selected) {
              selectKey([curKey]);
            }
          }}
          draggable={selected}
          key={curKey}
          fieldText={getFieldText(i)}
          bidName={getBidName(i)}
          ofrName={getOfrName(i)}
          internalCode={getInternalCode(i)}
          createTime={getCreateTime(i)}
          showFullInternalCode
          type={getItemType(i)}
          index={(index + 1).toString()}
          selected={selected}
          highlighted={highlighted}
          hightlightEdit={getHighlightEdit?.(i)}
          onDoubleClick={onDoubleClick}
          onMouseDown={evt => {
            if ((evt.ctrlKey && !window.System.isMac) || (evt.metaKey && window.System.isMac)) {
              if (selected) {
                selectKey(selectedKeys.filter(item => item !== curKey));
              } else {
                selectKey([...selectedKeys, curKey]);
              }
              return;
            }

            if (!evt.shiftKey) {
              setShiftSelectStartIndex(index);
            }

            if (evt.shiftKey) {
              if (shiftSelectStartIndex != null) {
                const [start, end] = [Math.min(shiftSelectStartIndex, index), Math.max(shiftSelectStartIndex, index)];
                selectKey(data.slice(start, end + 1).map(getKey));
              }
            }
          }}
          onClick={evt => {
            if (evt.ctrlKey || evt.metaKey || evt.shiftKey) return;
            selectKey([curKey]);
          }}
          renderSuffix={() => {
            return (
              <div className={cx('flex gap-1 items-center ml-auto', (selected || highlighted) && '-mr-px')}>
                {diff?.hasChanged && (
                  <Button.Icon
                    plain
                    className="hidden h-6 w-6 group-hover:inline-flex"
                    icon={<IconView />}
                    onClick={() => {
                      if (diff) {
                        setCurDiff({
                          parentDealId: i.parent_deal.parent_deal_id ?? '',
                          hasChanged: diff.hasChanged,
                          prev: diff.prev,
                          next: diff.next
                        });
                      }
                    }}
                  />
                )}
                <BridgeIconButton
                  className={btnCls}
                  active={(i.details?.length ?? 0) > 2}
                  tooltip={{
                    content: <CPItemRender list={getCpList(i)} />,
                    floatingProps: { className: '!py-1' }
                  }}
                  disabled={!accessCache.bridgeRecordEdit}
                  onClick={evt => {
                    setEditingItem(i);
                    setAnchorPosition({ x: evt.pageX, y: evt.pageY });
                    setDealSelectVisible(true);
                  }}
                />

                {/* 打开的弹窗标题为编辑，该按钮icon为编辑，此处不用额外添加tooltip */}
                <Button
                  className={cx(btnCls, 'border-none')}
                  disabled={!accessCache.bridgeEdit}
                  onClick={evt => {
                    onClickEdit?.(i);
                    setAnchorPosition({ x: evt.pageX, y: evt.pageY });
                  }}
                  icon={<IconEdit />}
                  type={getHighlightEdit?.(i) ? 'orange' : 'gray'}
                  text
                />

                <Button.Icon
                  className={btnCls}
                  disabled={!accessCache.log}
                  tooltip={{ content: '操作日志' }}
                  onClick={evt => {
                    onClickLog?.(i);
                    setAnchorPosition({ x: evt.pageX, y: evt.pageY });
                  }}
                  icon={<IconTime />}
                  text
                />

                <Button.Icon
                  className={btnCls}
                  disabled={!accessCache.bridgeRecordEdit || getDisableDelete?.(i)}
                  tooltip={{ content: '删桥' }}
                  onClick={evt => {
                    onClickDelete?.(i);
                    setAnchorPosition({ x: evt.pageX, y: evt.pageY });
                  }}
                  icon={<IconDelete />}
                  text
                />
              </div>
            );
          }}
        />
      );
    });
  };

  return (
    <div className={cx(className, 'flex flex-col relative')}>
      {renderList()}
      <ContextMenu
        open={contextVisible}
        position={anchorPosition}
        onOpenChange={setContextVisible}
      >
        {menuItems.map(i => (
          <MenuItem
            key={i.key}
            disabled={i?.disabled}
            onClick={() => i.onClick()}
          >
            {i.label}
          </MenuItem>
        ))}
      </ContextMenu>
      <ContextMenu
        open={dealSelectVisible}
        position={anchorPosition}
        onOpenChange={setDealSelectVisible}
      >
        {[...(dealSelectItem?.details ?? [])].reverse().map((i, index) => (
          <MenuItem
            key={i.receipt_deal_id}
            onClick={() => {
              if (dealSelectItem == null) return;
              onOpenSelectDealContext?.(dealSelectItem, i);
            }}
            className="h-8"
          >
            <div className="flex items-center gap-x-2">
              <Tooltip
                truncate
                floatingProps={{ className: '!z-hightest' }}
                content={getCP({
                  productType,
                  inst: i.ofr_trade_info.inst,
                  trader: i.ofr_trade_info.trader,
                  placeholder: CP_NONE
                })}
              >
                <div className={cx('text-sm max-w-[160px] truncate', index === 0 && 'text-secondary-100')}>
                  {getCP({
                    productType,
                    inst: i.ofr_trade_info.inst,
                    trader: i.ofr_trade_info.trader,
                    placeholder: CP_NONE
                  })}
                </div>
              </Tooltip>
              <IconRightArrow className="text-gray-100  max-w-[160px] truncate" />
              <Tooltip
                truncate
                floatingProps={{ className: '!z-hightest' }}
                content={getCP({
                  productType,
                  inst: i.bid_trade_info.inst,
                  trader: i.bid_trade_info.trader,
                  placeholder: CP_NONE
                })}
              >
                <div
                  className={cx(
                    'text-sm max-w-[160px] truncate',
                    index === (dealSelectItem?.details ?? []).length - 1 && 'text-orange-100'
                  )}
                >
                  {getCP({
                    productType,
                    inst: i.bid_trade_info.inst,
                    trader: i.bid_trade_info.trader,
                    placeholder: CP_NONE
                  })}
                </div>
              </Tooltip>
            </div>
          </MenuItem>
        ))}
      </ContextMenu>
      <BridgeModal
        visible={bridgeListVisible}
        invalidBridgeIdList={hiddenInstIds}
        onChange={val => onSelectBridgeInst(val)}
        onCancel={() => {
          // 传undefined表示占位桥
          onSelectBridgeInst(undefined);
          setContextVisible(false);
        }}
        position={[anchorPosition.x, anchorPosition.y]}
      />
      <DiffModal
        onCancel={() => {
          setCurDiff(undefined);
        }}
        visible={curDiff != null}
        data={curDiff}
        onConfirm={async () => {
          if (!curDiff) return;
          await dealDiffMarkRead({ deal_id_list: [curDiff.parentDealId] });
          setCurDiff(undefined);
        }}
      />
      <Popconfirm
        trigger="manual"
        contentRef={deleteRef}
        open={showDelete}
        placement="top"
        floatingProps={{
          className: '!w-[240px]'
        }}
        type="danger"
        content="是否删除桥？"
        confirmBtnProps={{ label: '删除', onFocus: evt => evt.target.blur() }}
        onConfirm={onDeleteBridge}
        onCancel={() => onChangeShowDelete?.(false)}
      >
        <div
          className="fixed"
          style={{
            top: anchorPosition.y,
            left: anchorPosition.x
          }}
        />
      </Popconfirm>
    </div>
  );
}
