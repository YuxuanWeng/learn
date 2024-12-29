import { HTMLAttributes, ReactNode, useRef } from 'react';
import cx from 'classnames';
import { Tooltip } from '@fepkg/components/Tooltip';
import { getSubInternalCode } from '@/common/utils/internal-code';

export enum IDCDealDetailItemType {
  Normal,
  Bold,
  Warning,
  WarningBold
}

export type IDCDealDetailItemProps = {
  fieldText: ReactNode;
  index: string;
  bidName: string;
  ofrName: string;
  internalCode: string;
  showFullInternalCode?: boolean;
  createTime: string;
  hightlightEdit?: boolean;
  type: IDCDealDetailItemType;
  selected?: boolean;
  highlighted?: boolean;
  renderSuffix?: () => ReactNode;
  isLast?: boolean;
  onViewClick?: () => void;
} & HTMLAttributes<HTMLDivElement>;

const classMap = {
  [IDCDealDetailItemType.Normal]: 'font-normal text-gray-000',
  [IDCDealDetailItemType.Bold]: 'font-bold text-gray-000',
  [IDCDealDetailItemType.Warning]: 'font-normal text-danger-100',
  [IDCDealDetailItemType.WarningBold]: 'font-bold text-danger-100'
};

const getBrokerName = (str: string) => {
  if (str) {
    const startIndex = str.length - 2;
    return str.slice(startIndex);
  }
  return str;
};

const textCls = 'text-sm whitespace-pre';

export const BrokerName = ({ ofrName, bidName }: { ofrName: string; bidName: string }) => {
  return (
    <div className="rounded-lg overflow-hidden flex w-20 h-full flex-shrink-0">
      <Tooltip
        content={ofrName}
        open={ofrName.length <= 2 ? false : undefined}
      >
        <div className="flex-1 flex items-center justify-center text-secondary-100 bg-secondary-700 text-sm">
          {getBrokerName(ofrName)}
        </div>
      </Tooltip>
      <Tooltip
        content={bidName}
        open={bidName.length <= 2 ? false : undefined}
      >
        <div className="flex-1 flex items-center justify-center text-orange-100 bg-orange-700 text-sm">
          {getBrokerName(bidName)}
        </div>
      </Tooltip>
    </div>
  );
};

export function DealDetailItem({
  fieldText,
  index,
  bidName,
  ofrName,
  internalCode,
  showFullInternalCode,
  createTime,
  hightlightEdit,
  type,
  selected,
  highlighted,
  onViewClick,
  renderSuffix,
  isLast,
  ...rest
}: IDCDealDetailItemProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className={cx('bg-gray-800', isLast && 'rounded-b-lg')}>
      <div
        ref={containerRef}
        {...rest}
        className={cx(rest.className, 'flex items-center gap-2 rounded-lg cursor-pointer select-none border group')}
      >
        <div
          className={cx(
            'h-6 w-full flex items-center gap-2 rounded-lg cursor-pointer select-none border group',
            selected && 'bg-primary-700 border-primary-600 border-solid ![h-22px]',
            highlighted && !selected && 'bg-gray-600 border-gray-500 border-solid ![h-22px]',
            !selected && !highlighted && 'hover:bg-gray-700'
          )}
        >
          <div
            className={cx(
              'w-18 h-6 rounded-lg flex justify-center items-center text-primary-100 font-bold border border-solid text-sm flex-shrink-0',
              highlighted && !selected ? 'border-transparent' : 'border-white/[.10]',
              (selected || highlighted) && '-ml-px'
            )}
          >
            {getSubInternalCode(internalCode, showFullInternalCode ? undefined : createTime)}
          </div>
          <BrokerName
            bidName={bidName}
            ofrName={ofrName}
          />
          <div className={cx(textCls, classMap[type])}>{index}</div>
          <Tooltip
            content={<div className="max-w-[calc(100vw_-_100px)] whitespace-pre-wrap">{fieldText}</div>}
            truncate
          >
            <div className={cx(textCls, classMap[type], 'truncate items-center')}>
              <span className="whitespace-nowrap">{fieldText}</span>
            </div>
          </Tooltip>

          {renderSuffix?.()}
        </div>
      </div>
    </div>
  );
}
