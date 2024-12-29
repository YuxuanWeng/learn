import { useMemo } from 'react';
import cx from 'classnames';
import { Button } from '@fepkg/components/Button';
import { IconView } from '@fepkg/icon-park-react';
import { DealOperationType, OperationSource } from '@fepkg/services/types/bds-enum';
import moment from 'moment';
import { mulUpdateNeedBridge } from '@/common/services/api/bridge/mul-update-need-bridge';
import { BridgeIconButton } from '@/components/DealDetailList/bridge-button';
import { DealDetailItem, IDCDealDetailItemType as DealDetailItemType } from '@/components/DealDetailList/item';
import { useDealContainer } from '@/components/IDCDealDetails/DealContent/DealContainerProvider';
import { findDirectDealDetail, getDisplayItemData } from '@/components/IDCDealDetails/utils';
import { FindBridge } from '@/components/business/FindBridge';
import { miscStorage } from '@/localdb/miscStorage';
import { useDealPanel } from '@/pages/Deal/Detail/provider';
import { useFilter } from '../SearchFilter/providers/FilterStateProvider';
import { ADD_BRIDGE_DRAG_KEY, DealContainerData } from '../type';

type DealProps = { data: DealContainerData; onDragStart?: VoidFunction };

export const Deal = ({ data, onDragStart }: DealProps) => {
  const { selectedIds, getPreferenceValue, handleMouseDown, isNCD, queryResult } = useFilter();
  const { onItemContextMenu, onDoubleClick } = useDealContainer();
  const { setDiff } = useDealPanel();
  const { parent_deal: deal } = data;

  /** 分组中是否显示方向和汇总信息 */
  const showConfig = useMemo(() => getPreferenceValue(data.groupId), [data.groupId, getPreferenceValue]);

  const isSelected = selectedIds.includes(data.id ?? (deal.parent_deal_id || ''));

  const displayItem = useMemo(
    () => getDisplayItemData(data, showConfig, false, isNCD, undefined),
    [data, isNCD, showConfig]
  );

  const getItemShowType = () => {
    const tradeDayLate = moment(Number(findDirectDealDetail(data)?.traded_date)).isAfter(moment().startOf('days'));
    const needBridge = data.parent_deal.flag_need_bridge || data.details?.some(item => item.flag_need_bridge);
    if (tradeDayLate && needBridge) return DealDetailItemType.WarningBold;
    if (tradeDayLate && !needBridge) return DealDetailItemType.Bold;
    if (!tradeDayLate && needBridge) return DealDetailItemType.Warning;
    return DealDetailItemType.Normal;
  };

  const renderSuffix = () => {
    return (
      <>
        {data.details?.length === 1 &&
          data.details.every(
            i => !i.order_no && !i.bid_trade_info.flag_pay_for_inst && !i.ofr_trade_info.flag_pay_for_inst
          ) && (
            <FindBridge
              findBridgeConfig={data.default_bridge_config}
              parentDealId={data.parent_deal.parent_deal_id}
              needFindBridge={data.flag_bridge}
              bidInst={data.parent_deal.bid_trade_info.inst}
              bidTrader={data.parent_deal.bid_trade_info.trader}
              ofrInst={data.parent_deal.ofr_trade_info.inst}
              ofrTrader={data.parent_deal.ofr_trade_info.trader}
              onPopupClick={async () => {
                await mulUpdateNeedBridge({
                  receipt_deal_id_list: [data.details![0].receipt_deal_id],
                  need_bridge: true,
                  operation_info: {
                    operator: miscStorage.userInfo?.user_id ?? '',
                    operation_type: DealOperationType.DOTReceiptDealNeedBridge,
                    operation_source: OperationSource.OperationSourceReceiptDealDetail
                  }
                });
                queryResult.refetch();
              }}
              renderChild={visible => (
                <BridgeIconButton
                  className={cx(!visible && 'opacity-0 -mr-[100%]', 'group-hover:opacity-100 group-hover:-mr-0')}
                  active={data.details?.[0]?.flag_need_bridge}
                />
              )}
            />
          )}
        {data.hasChanged && (
          <Button.Icon
            plain
            className="hidden h-6 w-6 group-hover:inline-flex"
            icon={<IconView />}
            onClick={() => {
              setDiff({
                dealId: data.parent_deal.parent_deal_id ?? '',
                hasChanged: data.hasChanged,
                prev: data.prev,
                next: data.next
              });
            }}
          />
        )}
      </>
    );
  };

  return (
    <>
      <div
        // className={cx('px-2 bg-gray-600 border border-solid border-y-0 border-gray-500', data.isLast ? 'h-8' : 'h-10')}
        className="px-2 bg-gray-600 border border-solid border-y-0 border-gray-500"
      >
        <DealDetailItem
          draggable={isSelected}
          key={data.id}
          isLast={data.isLast === true}
          className="h-8 px-2 pb-2 bg-gray-800"
          fieldText={<div className="flex gap-[3px]">{displayItem.nodeList}</div>}
          bidName={displayItem.bidBroker || ''}
          ofrName={displayItem.ofrBroker || ''}
          internalCode={displayItem.internalCode || '-'}
          createTime={displayItem.dealTime}
          type={getItemShowType()}
          index={(displayItem.index || 0).toString()}
          selected={isSelected}
          onDragStart={() => {
            if (isSelected) onDragStart?.();
          }}
          onDragEnd={() => {
            localStorage.removeItem(ADD_BRIDGE_DRAG_KEY);
          }}
          onClick={evt => {
            handleMouseDown(evt, data);
          }}
          onContextMenu={evt => {
            // 非多选模式下右键视为选中
            if (selectedIds.length < 2) handleMouseDown(evt, data);
            onItemContextMenu?.(evt);
          }}
          onDoubleClick={() => {
            onDoubleClick?.();
          }}
          renderSuffix={renderSuffix}
        />
      </div>

      {/* {data.isLast && <div className="h-2 -mx-2 rounded-lg rounded-t-none bg-gray-600" />} */}
      {/* 作用是填补分组间空隙，这里小组不需要圆角，否则会将大组分开，最后一个小组才需要圆角用于区分大组 */}
      {data.isLast && (
        <div
          className={cx(
            'h-2 bg-gray-600 border border-solid border-y-0 border-gray-500',
            data.isLastGroup && 'rounded-lg rounded-t-none border-b'
          )}
        />
      )}
    </>
  );
};
