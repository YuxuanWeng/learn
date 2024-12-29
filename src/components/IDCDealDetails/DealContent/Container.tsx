import { Placeholder } from '@fepkg/components/Placeholder';
import { useMemoizedFn } from 'ahooks';
import { BrokerHead } from '@/components/IDCDealDetails/DealContent/BrokerHead';
import { OtherTitle } from '@/components/IDCDealDetails/DealContent/OtherTitle';
import { ReceiptDealDetailForAdd } from '@/pages/Spot/utils/type';
import { useFilter } from '../SearchFilter/providers/FilterStateProvider';
import { ADD_BRIDGE_DRAG_KEY, DealContainerData } from '../type';
import { Deal } from './Deal';
import { GroupFooter } from './GroupFooter';
import { GroupHead } from './GroupHead';
import { useVirtualData } from './VirtualListProvider';

type Props = {
  /** 区域数据 */
  data: DealContainerData;
  onDragStart?: VoidFunction;
};

/**  成交明细展示区域组件  表示本人成交有机构区域 本人成交无机构等区域 */
const Inner = ({ data, onDragStart }: Props) => {
  if (data.isClosed) return null;
  // 目前单条高度是56px
  if (data.category === 'brokerHead') return <BrokerHead data={data} />;

  // 目前单条高度是48px
  if (data.category === 'groupHead') return <GroupHead data={data} />;

  // 目前单条高度是48px
  if (data.category === 'otherTitle') return <OtherTitle data={data} />;

  // 目前单条高度是32px
  if (data.category === 'deals')
    return (
      <Deal
        onDragStart={onDragStart}
        data={data}
      />
    );

  // 目前单条高度是28n+9px
  // 兜个底，如果当前数据组是机构待定，则强制不展示汇总，避免缓存导致机构待定中的汇总无法取消展示
  if (data.category === 'groupFooter' && !data.groupId.includes('无机构')) return <GroupFooter data={data} />;

  return null;
};

export const Container = () => {
  const { parentRef, selectedIds } = useFilter();
  const { virtualItems, virtualList, paddingTop, paddingBottom } = useVirtualData();

  const onDragStart = useMemoizedFn(() => {
    localStorage.setItem(
      ADD_BRIDGE_DRAG_KEY,
      JSON.stringify(
        (virtualList ?? [])
          .filter(i => selectedIds.includes(i.id ?? ''))
          .map(
            i =>
              ({
                parent_deal: {
                  parent_deal_id: i.parent_deal.parent_deal_id,
                  bridge_code: i.parent_deal.bridge_code,
                  internal_code: i.parent_deal.internal_code,
                  receipt_deal_status: i.parent_deal.receipt_deal_status,
                  bid_trade_info: {
                    flag_pay_for_inst: i.parent_deal.bid_trade_info?.flag_pay_for_inst
                  },
                  ofr_trade_info: {
                    flag_pay_for_inst: i.parent_deal.ofr_trade_info?.flag_pay_for_inst
                  },
                  order_no: i.parent_deal.order_no,
                  seq_number: i.parent_deal.seq_number
                },
                details: i.details?.map(d => ({
                  receipt_deal_id: d.receipt_deal_id,
                  receipt_deal_status: d.receipt_deal_status,
                  bid_trade_info: {
                    inst: {
                      inst_id: d.bid_trade_info.inst?.inst_id
                    }
                  },
                  ofr_trade_info: {
                    inst: {
                      inst_id: d.ofr_trade_info.inst?.inst_id
                    }
                  },
                  order_no: d.order_no
                }))
              }) as ReceiptDealDetailForAdd
          )
      )
    );
  });

  return (
    <div
      ref={parentRef}
      className="h-full overflow-y-overlay flex-1 gap-2 flex-col"
    >
      {virtualItems?.length ? (
        <>
          {paddingTop > 0 && <div style={{ height: paddingTop }} />}
          {virtualItems.map(item => {
            const currentItem = virtualList[item.index];
            return (
              <div
                key={item.index}
                style={{ height: item.size }}
              >
                <Inner
                  data={currentItem}
                  onDragStart={onDragStart}
                />
              </div>
            );
          })}
          {paddingBottom > 0 && <div style={{ height: paddingBottom }} />}
        </>
      ) : (
        <div className="w-full !h-full flex">
          <Placeholder
            type="no-data"
            size="md"
            label="暂无数据"
          />
        </div>
      )}
    </div>
  );
};
