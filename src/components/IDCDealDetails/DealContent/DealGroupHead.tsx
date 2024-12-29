import { useRef, useState } from 'react';
import cx from 'classnames';
import { Button } from '@fepkg/components/Button';
import { Checkbox } from '@fepkg/components/Checkbox';
import { IconBePending, IconGrouping, IconTraderDetail } from '@fepkg/icon-park-react';
import { DealOperationType, OperationSource, Side } from '@fepkg/services/types/enum';
import { dealDiffMarkRead } from '@/common/services/api/deal/diff-mark-read';
import { recordSendMsgCallback } from '@/common/services/api/deal/record-send-msg-callback';
import { useFilter } from '@/components/IDCDealDetails/SearchFilter/providers/FilterStateProvider';
import { DetailShowConfig } from '@/components/IDCDealDetails/hooks/usePreference';
import { SendMsgDetail } from '@/components/IMHelper/type';
import { miscStorage } from '@/localdb/miscStorage';
import { useDealPanel } from '@/pages/Deal/Detail/provider';
import { dealDetailSend } from '@/pages/Spot/Panel/DealRecord/utils/contextualOperation';
import { DealContainerData, TypeDealItem } from '../type';
import { getNoInternalCodeAndBrokerDisplayData } from '../utils';

type Props = {
  data: DealContainerData;
  showConfig: DetailShowConfig;
  onChangePreference: (groupId: string, btnPreference: DetailShowConfig) => void;
};

export const DealGroupHead = ({ data, showConfig, onChangePreference }: Props) => {
  const { groupId, groupName, trader, deals, historyDeals } = data;

  const { accessCache } = useDealPanel();
  const { isNCD, queryResult } = useFilter();

  const { refetch } = queryResult;

  const sumRef = useRef<HTMLInputElement>(null);
  const sideRef = useRef<HTMLInputElement>(null);

  const allDeals = [...(deals || []), ...(historyDeals || [])];
  const viewDealIds = allDeals.map(v => v.parent_deal.parent_deal_id ?? '').filter(Boolean);

  /** 发送 */
  const onSendMsg = async () => {
    dealDiffMarkRead({ deal_id_list: viewDealIds });

    // k:分组的traderId    v:单个成交明细的数据
    const map = new Map<string, TypeDealItem[]>();

    for (const item of allDeals) {
      const { parent_deal: deal } = item;
      const { bid_trade_info, ofr_trade_info } = deal;
      if (item.dealSide === Side.SideBid) {
        const key = bid_trade_info?.trader?.trader_id || '';
        const v = map.get(key) ?? [];
        v.push(item);
        map.set(key, v);
      } else {
        const key = ofr_trade_info?.trader?.trader_id || '';
        const v = map.get(key) ?? [];
        v.push(item);
        map.set(key, v);
      }
    }

    const messages: SendMsgDetail[] = [];
    for (const [receiverId, v] of map) {
      const firstRecord = v?.at(0);
      if (!firstRecord || !receiverId) return;
      const { parent_deal: firstContent } = firstRecord;
      const messageText = getNoInternalCodeAndBrokerDisplayData(v, showConfig, isNCD);
      const receiver =
        firstRecord.dealSide === Side.SideBid ? firstContent.bid_trade_info.trader : firstContent.ofr_trade_info.trader;
      const inst =
        firstRecord.dealSide === Side.SideBid ? firstContent.bid_trade_info.inst : firstContent.ofr_trade_info.inst;
      const singleMessage: SendMsgDetail = {
        receiver_name: receiver?.name_zh,
        msg: messageText,
        recv_qq: receiver?.qq?.[0],
        inst_name: inst?.short_name_zh,
        receiver_id: receiverId,
        side: firstRecord.dealSide
      };
      messages.push(singleMessage);
    }

    const sendSuccessCallBackFn = (errorTraderIds: string[]) => {
      // 存放父成交单的id
      const dealIdSet = new Set<string>();

      for (const [receiverId, items] of map) {
        if (!errorTraderIds.includes(receiverId) && items != null) {
          for (const item of items) {
            if (item.parent_deal.parent_deal_id) {
              dealIdSet.add(item.parent_deal.parent_deal_id);
            }
          }
        }
      }

      for (const dealId of dealIdSet) {
        recordSendMsgCallback({
          deal_id: dealId,
          operation_info: {
            operator: miscStorage.userInfo?.user_id ?? '',
            operation_type: DealOperationType.DOTSend,
            operation_source: OperationSource.OperationSourceReceiptDealDetail
          }
        });
      }
    };

    dealDetailSend(messages, sendSuccessCallBackFn);
  };

  const [confirmViewLoading, setConfirmViewLoading] = useState(false);

  const handleView = async () => {
    setConfirmViewLoading(true);
    try {
      await dealDiffMarkRead({ deal_id_list: viewDealIds });
    } finally {
      setConfirmViewLoading(false);
    }
    refetch();
  };

  const noInst = groupId.includes('无机构');

  return (
    // 容器边框
    <div className="h-12 px-2 bg-gray-600 border border-solid border-y-0 border-gray-500">
      <div
        className={cx(
          'relative h-full bg-gray-800 px-2 flex items-center justify-between',
          // 小组标题一定要有圆角，用于区分上一个小组
          'rounded-lg rounded-b-none'
        )}
      >
        <div className="h-full flex items-center">
          {trader ? (
            <>
              <IconTraderDetail
                size={14}
                className="text-orange-100"
              />
              <div className="text-gray-000 float-left ml-2 text-sm">
                <span className="font-medium inline-block">{groupName}</span>
                <span className="mx-1">-</span>
                <span className="font-normal inline-block">{trader}</span>
              </div>
            </>
          ) : (
            <>
              {noInst ? (
                <IconBePending
                  size={14}
                  className="text-danger-100"
                />
              ) : (
                <IconGrouping
                  size={14}
                  className="text-secondary-100"
                />
              )}
              <div className="font-medium text-gray-000 ml-2 text-sm">
                <span className="inline-block">{groupName}</span>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center select-none">
          {/* 无机构组 不需要这些操作项 */}
          {noInst ? null : (
            <div className="flex items-center bg-gray-700 h-7 mr-3 px-3 rounded-lg gap-2">
              <Checkbox
                checked={showConfig.showSide}
                className="w-13"
                onClick={() => {
                  onChangePreference(groupId, { ...showConfig, showSide: !showConfig.showSide });
                }}
                ref={sideRef}
              >
                方向
              </Checkbox>
              <Checkbox
                checked={showConfig.showTimeRange}
                className="w-13"
                onClick={() => {
                  onChangePreference(groupId, { ...showConfig, showTimeRange: !showConfig.showTimeRange });
                }}
                ref={sumRef}
              >
                期限
              </Checkbox>
              <Checkbox
                checked={showConfig.showShortName}
                className="w-20"
                onClick={() => {
                  onChangePreference(groupId, { ...showConfig, showShortName: !showConfig.showShortName });
                }}
                ref={sumRef}
              >
                债券简称
              </Checkbox>
              <Checkbox
                checked={showConfig.showSum}
                className="w-13"
                onClick={() => {
                  onChangePreference(groupId, { ...showConfig, showSum: !showConfig.showSum });
                }}
                ref={sumRef}
              >
                汇总
              </Checkbox>
            </div>
          )}

          <Button
            type="gray"
            ghost
            className="w-[92px] h-7 p-0"
            disabled={confirmViewLoading}
            loading={confirmViewLoading}
            onClick={handleView}
            throttleWait={3000}
          >
            一键查看
          </Button>
          <Button
            type="primary"
            className={cx('w-12 h-7 p-0 ml-2', noInst && 'hidden')}
            disabled={!accessCache.send}
            onClick={onSendMsg}
            throttleWait={3000}
          >
            发送
          </Button>
        </div>
      </div>
    </div>
  );
};
