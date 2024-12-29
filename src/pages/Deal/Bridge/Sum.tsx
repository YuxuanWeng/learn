import { useRef, useState } from 'react';
import cx from 'classnames';
import { getInstName } from '@fepkg/business/utils/get-name';
import { getSettlement } from '@fepkg/business/utils/liq-speed';
import { Caption } from '@fepkg/components/Caption';
import { Tooltip } from '@fepkg/components/Tooltip';
import { BridgeInstInfo, ReceiptDeal } from '@fepkg/services/types/bds-common';
import { BondQuoteType } from '@fepkg/services/types/bds-enum';
import { first, last } from 'lodash-es';
import { useOnClickOutside } from 'usehooks-ts';
import { formatPrice } from '@/common/utils/copy';
import { formatVolume, getRelatedDetails } from '@/components/IDCBridge/OrderDetails/util';
import { useProductParams } from '@/layouts/Home/hooks';
import { BridgeReceiptDealSum, getRebateText, getSettlementStrWithFlagExchange } from './utils';

const getCurrent = (i: BridgeReceiptDealSum, bridgeInst: BridgeInstInfo): ReceiptDeal | undefined => {
  const details = getRelatedDetails(i.latestItem.details, bridgeInst.contact_inst.inst_id);

  return i.isOfr ? details?.[details.length - 1] : details[0];
};

const getSendOrderInfo = (i: BridgeReceiptDealSum, currentBridgeInst: BridgeInstInfo) => {
  const isBidTrueOpponent =
    first(i.latestItem.details)?.ofr_trade_info.inst?.inst_id === currentBridgeInst.contact_inst.inst_id;
  const isOfrTrueOpponent =
    last(i.latestItem.details)?.bid_trade_info.inst?.inst_id === currentBridgeInst.contact_inst.inst_id;

  if ((!isBidTrueOpponent && !i.isOfr) || (!isOfrTrueOpponent && i.isOfr)) return '';

  const sendOrderInfo = i.isOfr
    ? i.latestItem.parent_deal?.ofr_send_order_info
    : i.latestItem.parent_deal?.bid_send_order_info;

  return sendOrderInfo;
};

export const BridgeDialogSum = (props: {
  data: BridgeReceiptDealSum[];
  currentBridgeInst?: BridgeInstInfo;
  height?: number;
}) => {
  const { data, currentBridgeInst, height } = props;

  const containerRef = useRef(null);
  const [shiftSelectStartIndex, setShiftSelectStartIndex] = useState<number>();
  const [dragSelectStartIndex, setDragSelectStartIndex] = useState<number>();
  const isDragging = useRef(false);

  const [selectedItems, setSelectedItems] = useState<BridgeReceiptDealSum[]>([]);
  const { productType } = useProductParams();

  useOnClickOutside(containerRef, () => {
    setSelectedItems([]);
  });

  const getKey = (item: BridgeReceiptDealSum) => `${item.latestItem.parent_deal.parent_deal_id}_${item.isOfr}`;

  const selectItem = (items: BridgeReceiptDealSum[]) => {
    setSelectedItems(items);

    const getText = (i: BridgeReceiptDealSum) => {
      if (currentBridgeInst == null) return '';
      const item = i.latestItem.parent_deal;

      const current = getCurrent(i, currentBridgeInst);
      if (current == null) return '';

      const liqRaw = getSettlementStrWithFlagExchange(
        current?.liquidation_speed_list?.at(0) ?? getSettlement(current.traded_date, current.delivery_date),
        current.traded_date,
        i.latestItem.parent_deal.flag_stock_exchange
      );
      const liq = `${liqRaw}${i.latestItem.parent_deal.flag_stock_exchange ? '交易所' : ''}`;

      const instText =
        getInstName({ inst: i.isOfr ? item.ofr_trade_info.inst : item.bid_trade_info.inst, productType }) || '机构待定';

      const priceText = `${formatPrice(item.price ?? 0, 4)}${
        item.price_type === BondQuoteType.CleanPrice ? '净价' : ''
      }${getRebateText(item)}`;

      return [
        item.bond_basic_info.display_code,
        item.bond_basic_info.short_name,
        instText,
        i.isOfr ? '卖出' : '买入',
        priceText,
        liq,
        'Total',
        formatVolume(item.volume ?? 0),
        getSendOrderInfo(i, currentBridgeInst)
      ].join(' ');
    };

    window.Main.copy(items.map(getText).join('\n'));
  };

  return (
    <div
      className="border-0 border-t border-solid border-gray-600 flex-shrink-0"
      ref={containerRef}
    >
      <div className="h-10 flex items-center px-4">
        <Caption type="orange">汇总信息</Caption>
      </div>
      <div className="component-dashed-x" />

      <div
        className="px-2 my-3 overflow-y-overlay"
        style={{ height }}
        onMouseUp={() => {
          isDragging.current = false;
        }}
        onMouseLeave={() => {
          isDragging.current = false;
        }}
      >
        {data.map((i, index) => {
          if (currentBridgeInst == null) return '';

          const item = i.latestItem.parent_deal;

          const current = getCurrent(i, currentBridgeInst);

          if (current == null) return '';

          const liqRaw = getSettlementStrWithFlagExchange(
            current?.liquidation_speed_list?.at(0) ?? getSettlement(current.traded_date, current.delivery_date),
            current.traded_date,
            i.latestItem.parent_deal.flag_stock_exchange
          );
          const liq = `${liqRaw}${i.latestItem.parent_deal.flag_stock_exchange ? '交易所' : ''}`;

          const instText =
            getInstName({ inst: i.isOfr ? item.ofr_trade_info.inst : item.bid_trade_info.inst, productType }) ||
            '机构待定';

          const priceText = `${formatPrice(item.price ?? 0, 4)}${
            item.price_type === BondQuoteType.CleanPrice ? '净价' : ''
          }${getRebateText(item)}`;

          const key = getKey(i);
          const selected = selectedItems.some(s => getKey(s) === key);

          return (
            <div
              onClick={evt => {
                if (evt.ctrlKey || evt.metaKey || evt.shiftKey) return;
                selectItem([i]);
              }}
              onMouseDown={evt => {
                if ((evt.ctrlKey && !window.System.isMac) || (evt.metaKey && window.System.isMac)) {
                  if (selected) {
                    selectItem(selectedItems.filter(s => getKey(s) !== getKey(i)));
                  } else {
                    selectItem([...selectedItems, i]);
                  }
                  return;
                }

                setDragSelectStartIndex(index);
                isDragging.current = true;

                if (!evt.shiftKey) {
                  setShiftSelectStartIndex(index);
                }

                if (evt.shiftKey) {
                  if (shiftSelectStartIndex != null) {
                    const [start, end] = [
                      Math.min(shiftSelectStartIndex, index),
                      Math.max(shiftSelectStartIndex, index)
                    ];
                    selectItem(data.slice(start, end + 1));
                  }
                }
              }}
              onMouseEnter={() => {
                if (dragSelectStartIndex != null && isDragging.current) {
                  const [start, end] = [Math.min(dragSelectStartIndex, index), Math.max(dragSelectStartIndex, index)];
                  selectItem(data.slice(start, end + 1));
                }
              }}
              key={key}
              className={cx(
                selected && 'bg-primary-700',
                'overflow-hidden px-2 flex items-center gap-2 font-bold h-8 select-none cursor-pointer rounded-lg hover:bg-gray-600 active:bg-primary-700 text-sm'
              )}
            >
              <div className="flex-shrink-0 w-[120px]">{item.bond_basic_info.display_code}</div>
              <div className="flex-shrink-0 w-[160px]">{item.bond_basic_info.short_name}</div>
              <Tooltip
                truncate
                content={instText}
              >
                <div className="flex-shrink-0 w-[160px] truncate">{instText}</div>
              </Tooltip>
              <div className="flex-shrink-0 w-12">{i.isOfr ? '卖出' : '买入'}</div>
              <div className={cx('flex-shrink-0 w-[120px]', i.isOfr ? 'text-secondary-100' : 'text-orange-100')}>
                {priceText}
              </div>
              <Tooltip
                truncate
                content={liq}
              >
                <div className="flex-shrink-0 w-[80px] truncate">{liq}</div>
              </Tooltip>
              <div className="flex-shrink-0 w-[72px]">Total</div>
              <div className={cx('flex-shrink-0 w-[80px]', i.isOfr ? 'text-secondary-100' : 'text-orange-100')}>
                {formatVolume(i.volume ?? 0)}
              </div>
              <Tooltip
                truncate
                content={getSendOrderInfo(i, currentBridgeInst)}
              >
                <div className="truncate flex-1">{getSendOrderInfo(i, currentBridgeInst)}</div>
              </Tooltip>
              <div className="flex flex-1 truncate items-center gap-2">
                <div className="w-4 h-4 bg-primary-100 rounded-sm text-gray-700 text-xs flex-center font-medium flex-shrink-0">
                  序
                </div>
                <Tooltip
                  truncate
                  content={i.index.join(',')}
                >
                  <div className="text-sm font-bold text-gray-000 truncate">{i.index.join(',')}</div>
                </Tooltip>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
