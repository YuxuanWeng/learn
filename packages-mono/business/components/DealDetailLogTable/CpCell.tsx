import cx from 'classnames';
import { getCP } from '@fepkg/business/utils/get-name';
import { Tooltip } from '@fepkg/components/Tooltip';
import { IconRightArrow } from '@fepkg/icon-park-react';
import { InstitutionTiny, Trader } from '@fepkg/services/types/bdm-common';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { DealDetailLogChild, DealDetailOperationLog } from '@fepkg/services/types/bds-common';
import { DealOperationType } from '@fepkg/services/types/bds-enum';
import { UpdatesBadge, UpdatesNone } from '../DiffTable';
import { ReceiptDealUpdatedBadgeType } from '../ReceiptDealLogTable/types';

type CpCellProps = {
  data: DealDetailOperationLog;
  className?: string;
  productType?: ProductType;
};

type Item = {
  // 是否点亮
  value: string;
  isBridge?: boolean;
  // 桥机构是否属于过桥机构
  isInstBridgeInst?: boolean;
  // bid/ofr方代付机构flag
  flagBidPayForInst?: boolean;
  flagOfrPayForInst?: boolean;
  // hover显示代付机构方向
  showPayForHover?: boolean;
};

const getInstStr = (inst?: InstitutionTiny, productType = ProductType.ProductTypeNone, trader?: Trader) => {
  if (inst && trader) {
    return getCP({ inst, productType, trader });
  }
  return '机构待定';
};

const getType: (item: Item) => ReceiptDealUpdatedBadgeType = (item: Item) => {
  if (item.flagBidPayForInst || item.flagOfrPayForInst) {
    return 'danger-payfor';
  }

  if (item.isInstBridgeInst) {
    return 'purple-bridge';
  }

  return 'orange-bridge';
};

const getTooltipContent = (item: Item) => {
  if (!item.showPayForHover) return undefined;
  if (item.flagBidPayForInst && item.flagOfrPayForInst) {
    return 'Ofr方代付、Bid方代付';
  }

  if (item.flagBidPayForInst) {
    return 'Bid代付机构';
  }

  if (item.flagOfrPayForInst) {
    return 'Ofr代付机构';
  }

  return undefined;
};

export const CompItem = ({ list }: { list: Item[] }) => {
  const { length } = list;

  const renderBridgeBlock = (item: Item, index: number) => {
    return (
      <span
        className={cx(index > 0 && 'ml-2')}
        key={`bridge-item-${index}`}
      >
        <Tooltip content={getTooltipContent(item)}>
          <span>
            <UpdatesBadge
              type={getType(item)}
              className="align-text-bottom"
            />
          </span>
        </Tooltip>
        <span className="text-orange-050 ml-2">{item.value}</span>
        {index < length - 1 && <IconRightArrow className="text-orange-050 ml-2 inline-block align-text-bottom" />}
      </span>
    );
  };

  const renderTooltipBridgeBlock = (item: Item, index: number) => {
    return (
      <div
        className="flex items-center gap-x-2 h-4"
        key={`bridge-item-${index}`}
      >
        <UpdatesBadge type={getType(item)} />
        <div className="text-gray-100 text-sm">{item.value}</div>
        {index < length - 1 && <IconRightArrow className="text-gray-100" />}
      </div>
    );
  };

  const renderNormalBlock = (item: Item, index: number) => {
    return (
      <span
        className={cx(index > 0 && 'ml-2')}
        key={`normal-item-${index}`}
      >
        <span className="text-orange-050">{item.value}</span>
        {index < length - 1 && <IconRightArrow className="text-orange-050 ml-2 inline-block align-text-bottom" />}
      </span>
    );
  };

  const renderTooltipNormalBlock = (item: Item, index: number) => {
    return (
      <div
        className="flex items-center gap-x-2 h-4"
        key={`normal-item-${index}`}
      >
        <div className="text-gray-100 text-sm">{item.value}</div>
        {index < length - 1 && <IconRightArrow className="text-gray-100" />}
      </div>
    );
  };

  const content = (
    <>
      {list.map((item, index) => {
        if (item.value.length === 0) {
          return <UpdatesNone key={`bridge-${index}`} />;
        }
        if (item.isBridge || item.flagBidPayForInst || item.flagOfrPayForInst) {
          return renderBridgeBlock(item, index);
        }
        return renderNormalBlock(item, index);
      })}
    </>
  );

  const tooltipContent = (
    <>
      {list.map((item, index) => {
        if (item.value.length === 0) {
          return <UpdatesNone key={`bridge-${index}`} />;
        }
        if (item.isBridge) {
          return renderTooltipBridgeBlock(item, index);
        }
        return renderTooltipNormalBlock(item, index);
      })}
    </>
  );

  return (
    <Tooltip
      content={tooltipContent}
      truncate
      floatingProps={{
        className:
          'flex flex-center justify-start flex-wrap !text-gray-100 !px-4 gap-x-2 gap-y-2 min-h-[32px] max-w-[800px] text-sm'
      }}
    >
      <span className="truncate bg-gray-600 rounded-lg w-fit text-sm">
        <span className="mx-2 h-[17px] my-[2.5px]">{content}</span>
      </span>
    </Tooltip>
  );
};

/**
 *
 * @param details
 * [bid桥，各种桥,ofr桥]
 * 各种桥不止一个
 * 数组长度至少有一个，表示没有桥。最多有超过10个
 * flag_bid_pay_for_inst
 * flag_ofr_pay_for_inst
 * bid/ofr方代付机构标识，只会出现在bid/ofr方的第一个桥上
 * 可以出现在同一个桥上
 */
export const getCpData = (
  details: DealDetailLogChild[],
  flag_bid_pay_for_inst?: boolean,
  flag_ofr_pay_for_inst?: boolean,
  productType?: ProductType
) => {
  const arr: Item[] = [];

  for (const [index, detail] of details.entries()) {
    const { ofr_inst_snapshot, bid_inst_snapshot, ofr_trader_snapshot, bid_trader_snapshot, ofr_flag_bridge } = detail;
    const isStart = index === 0;
    const isEnd = index === details.length - 1;

    if (isStart) {
      arr.push({
        value: getInstStr(bid_inst_snapshot, productType, bid_trader_snapshot),
        isBridge: false,
        // 无桥情况下才赋值
        flagBidPayForInst: flag_bid_pay_for_inst && isEnd
      });
    }

    if (isEnd) {
      arr.push({
        value: getInstStr(ofr_inst_snapshot, productType, ofr_trader_snapshot),
        isBridge: false,
        // 无桥情况下才赋值
        flagOfrPayForInst: flag_ofr_pay_for_inst && isStart
      });
    } else {
      const isFirstBridge = index === 0;
      const islastBridge = index === details.length - 2;
      const showPayForHover = details.length === 2;

      arr.push({
        value: getInstStr(ofr_inst_snapshot, productType, ofr_trader_snapshot),
        isInstBridgeInst: ofr_flag_bridge,
        flagBidPayForInst: isFirstBridge && flag_bid_pay_for_inst,
        flagOfrPayForInst: islastBridge && flag_ofr_pay_for_inst,
        isBridge: true,
        showPayForHover
      });
    }
  }
  if (arr.length === 0) {
    return [{ value: '' }];
  }
  return arr.reverse();
};

export const CpCell = ({ data, productType, className }: CpCellProps) => {
  const { before_deal_snapshot, after_deal_snapshot, operation_type } = data;

  // 换桥显示空，其他的显示正常
  const beforeArr: Item[] =
    operation_type === DealOperationType.DOTAssociateBridge
      ? [{ value: '' }]
      : getCpData(
          before_deal_snapshot?.details ?? [],
          before_deal_snapshot?.flag_bid_pay_for_inst,
          before_deal_snapshot?.flag_ofr_pay_for_inst,
          productType
        );
  const afterArr: Item[] = getCpData(
    after_deal_snapshot?.details ?? [],
    after_deal_snapshot?.flag_bid_pay_for_inst,
    after_deal_snapshot?.flag_ofr_pay_for_inst,
    productType
  );

  return (
    <div className={cx('flex items-start w-full gap-x-2', className)}>
      <span className="flex-center self-start shrink-0 w-[92px] h-[22px] text-gray-200 font-medium border border-solid border-gray-600 rounded-lg">
        CP信息
      </span>
      <div className="flex gap-y-1 flex-wrap items-center w-[calc(100%_-_120px)]">
        <div className="flex items-center overflow-hidden">
          <CompItem list={beforeArr} />
          <IconRightArrow className="px-2 text-gray-300" />
        </div>
        <CompItem list={afterArr} />
      </div>
    </div>
  );
};
