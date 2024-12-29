import { forwardRef, useState } from 'react';
import cx from 'classnames';
import { CP_NONE, getCP } from '@fepkg/business/utils/get-name';
import { Button } from '@fepkg/components/Button';
import { NumberBadge } from '@fepkg/components/Tags';
import { Tooltip } from '@fepkg/components/Tooltip';
import { IconAttentionFilled, IconTopping } from '@fepkg/icon-park-react';
import { BridgeInstInfo } from '@fepkg/services/types/common';
import { useProductParams } from '@/layouts/Home/hooks';

type BridgeInstItemProps = {
  /** 桥机构信息 */
  bridge: BridgeInstInfo;
  /** 是否置顶 */
  isSticky?: boolean;
  /** 是否被选中 */
  isSelected?: boolean;
  /** 该桥机构的过桥记录总数 */
  total: number;
  /** 选中 */
  onSelected: (val: BridgeInstInfo) => void;
  /** 双击 */
  onDoubleClick: (val: BridgeInstInfo) => void;
  /** 被拖拽到自己之时触发 */
  onDrop?: (val: BridgeInstInfo) => void;
  /** 置顶 */
  toSticky: (id: string) => void;
  /** 取消置顶 */
  cancelSticky: (id: string) => void;
  /** 是否被搜索匹配 */
  isSearched: boolean;
};

export const BridgeInstItem = forwardRef<HTMLDivElement, BridgeInstItemProps>(
  (
    { bridge, onSelected, onDoubleClick, onDrop, toSticky, isSticky, isSelected, total, cancelSticky, isSearched },
    ref
  ) => {
    const { productType } = useProductParams();
    const { contact_inst, contact_trader } = bridge;
    const cp = getCP({ productType, inst: contact_inst, trader: contact_trader, placeholder: CP_NONE });
    const [isDragOver, setIsDragOver] = useState(false);

    return (
      <div
        className={cx(
          'h-9 px-3 cursor-default box-border select-none',
          'flex items-center gap-2 justify-between',
          'cursor-pointer',
          { 'bg-primary-700': isSelected || isDragOver },
          { 'text-primary-200': isSearched },
          { 'hover:bg-gray-600': !isSelected }
        )}
        onClick={() => onSelected(bridge)}
        onDoubleClick={() => onDoubleClick(bridge)}
        onDragOver={e => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={e => {
          e.preventDefault();
          setIsDragOver(false);
        }}
        onDrop={() => {
          onDrop?.(bridge);
          setIsDragOver(false);
        }}
        ref={ref}
      >
        <div className="flex flex-1 items-center gap-2 w-0">
          <Button.Icon
            type={isSticky ? 'orange' : 'gray'}
            className="!w-4 !min-w-[16px] !h-4 !min-h-[16px] !rounded border-0"
            icon={<IconTopping size={12} />}
            throttleWait={500}
            onClick={() => {
              const id = bridge?.bridge_inst_id || '';
              if (isSticky) cancelSticky(id);
              else toSticky(id);
            }}
          />

          <Tooltip
            truncate
            content={cp}
          >
            <span
              className={cx('inline-block truncate text-sm items-center', {
                'text-primary-100': isSelected
              })}
            >
              {cp}
            </span>
          </Tooltip>

          {!bridge.is_valid && (
            <Tooltip content="当前桥机构交易员信息发生变更！">
              <IconAttentionFilled
                className="text-orange-100"
                theme="filled"
              />
            </Tooltip>
          )}
        </div>

        <NumberBadge
          className="!bg-white/[.06] !text-primary-100"
          num={total}
        />
      </div>
    );
  }
);
