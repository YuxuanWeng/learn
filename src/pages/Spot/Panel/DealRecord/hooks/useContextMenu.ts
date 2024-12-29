import { useRef, useState } from 'react';
import { APIs } from '@fepkg/services/apis';
import { DealGroupCombinationList } from '@fepkg/services/types/deal/group-combination-list';
import { BondDealStatus, DealOperationType, DealType, Side } from '@fepkg/services/types/enum';
import { useQuery } from '@tanstack/react-query';
import { useAtomValue, useSetAtom } from 'jotai';
import { dealDiffMarkRead } from '@/common/services/api/deal/diff-mark-read';
import { fetchGroupCombinationList } from '@/common/services/api/deal/group-combination-list';
import { defaultDetailShowConfig, useIDCDetailPreference } from '@/components/IDCDealDetails/hooks/usePreference';
import { DealRecordContextEnum, RecordContextMenuItem } from '@/components/IDCHistory/types';
import { miscStorage } from '@/localdb/miscStorage';
import { cloneMdlVisibleAtom, dealRecordOperatingAtom } from '../atoms';
import { useDealRecord } from '../providers/DealRecordProvider';
import { onBeSpotCopy, onDelete, onReminder, onSend, onSpotCopy } from '../utils/contextualOperation';
import { useDealRecordModify } from './useDealRecordModify';

/** 右键菜单状态及操作自定义hook */
export const useContextMenu = (contextVisible: boolean) => {
  const curDealRecord = useAtomValue(dealRecordOperatingAtom);
  const setCloneVisible = useSetAtom(cloneMdlVisibleAtom);
  const [cloneGranterId, setCloneGranterId] = useState<string>();
  const { onDealRecordModify } = useDealRecordModify();
  const { ourSideIds } = useDealRecord();

  const { getPreferenceValue } = useIDCDetailPreference();
  const groups = useRef<DealGroupCombinationList.GroupCombination[]>();

  /** 获取用户分组，复制时用于获取成交明细相关配置 */
  useQuery({
    queryKey: [APIs.deal.groupCombinationList] as const,
    queryFn: async ({ signal }) => {
      const result = await fetchGroupCombinationList({ signal });
      return result;
    },
    // 不打开右键菜单不轮训，但是至少初始化一次
    enabled: contextVisible || groups.current == null,
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchInterval: 5000,
    onSuccess: data => {
      groups.current = data.group_combination_list ?? [];
    }
  });

  // 按明细的groupID以及六种分组模式来获取相应配置
  // 复制只能复制自己一侧的内容，因此一定是本人成交
  const getCopyConfig = (isSpotter: boolean) => {
    const cp = isSpotter ? curDealRecord?.spot_pricinger : curDealRecord?.spot_pricingee;

    const trader = cp?.trader;

    // 只有本人成交/本人历史成交+有机构会有配置
    if (trader == null) {
      return defaultDetailShowConfig;
    }

    // 查询trader是否属于某个group
    const group = groups.current?.find(g => g.trader_info_list?.some(t => t.trader_id === trader.trader_id));

    // getPreferenceValue接受的groupId，有group取group，不然直接取traderID
    const groupID = group?.group_combination_id ?? trader.trader_id;

    return getPreferenceValue(groupID);
  };

  function handleContextMenuClick(val: RecordContextMenuItem) {
    switch (val.key) {
      // 发送
      case DealRecordContextEnum.SpotSend:
        if (curDealRecord) {
          onSend(curDealRecord, curDealRecord.deal_type === DealType.TKN ? Side.SideBid : Side.SideOfr);
          if (curDealRecord.deal_id) dealDiffMarkRead({ deal_id_list: [curDealRecord.deal_id] });
        }

        break;
      case DealRecordContextEnum.BeSpotSend:
        if (curDealRecord) {
          onSend(curDealRecord, curDealRecord.deal_type === DealType.TKN ? Side.SideOfr : Side.SideBid);
          if (curDealRecord.deal_id) dealDiffMarkRead({ deal_id_list: [curDealRecord.deal_id] });
        }
        break;
      // 点价方复制
      case DealRecordContextEnum.SpotCopy:
        if (curDealRecord) onSpotCopy(curDealRecord, getCopyConfig(true));
        break;
      // 被点价方复制
      case DealRecordContextEnum.BeSpotCopy:
        if (curDealRecord) onBeSpotCopy(curDealRecord, getCopyConfig(false));
        break;
      // 克隆
      case DealRecordContextEnum.Clone: {
        const spotter = curDealRecord?.spot_pricinger?.broker?.user_id;
        const quoter = curDealRecord?.spot_pricingee?.broker?.user_id;
        const selfId = miscStorage.userInfo?.user_id;
        let granterId: string | undefined;
        if (selfId !== spotter && selfId !== quoter) {
          if ((ourSideIds ?? []).includes(spotter ?? '')) {
            granterId = spotter;
          }
          if ((ourSideIds ?? []).includes(quoter ?? '')) {
            granterId = quoter;
          }
        }

        setCloneGranterId(granterId);
        setCloneVisible(true);
        break;
      }
      case DealRecordContextEnum.SpotClone:
        setCloneVisible(true);
        setCloneGranterId(curDealRecord?.spot_pricinger?.broker?.user_id);
        break;
      case DealRecordContextEnum.BeSpotClone:
        setCloneVisible(true);
        setCloneGranterId(curDealRecord?.spot_pricingee?.broker?.user_id);
        break;
      // 催单
      case DealRecordContextEnum.SpotReminder:
        if (curDealRecord) {
          onReminder(curDealRecord, curDealRecord.deal_type === DealType.TKN ? Side.SideBid : Side.SideOfr);
          if (curDealRecord.deal_id) dealDiffMarkRead({ deal_id_list: [curDealRecord.deal_id] });
        }
        break;
      case DealRecordContextEnum.BeSpotReminder:
        if (curDealRecord) {
          onReminder(curDealRecord, curDealRecord.deal_type === DealType.TKN ? Side.SideOfr : Side.SideBid);
          if (curDealRecord.deal_id) dealDiffMarkRead({ deal_id_list: [curDealRecord.deal_id] });
        }

        break;
      case DealRecordContextEnum.BothReminder:
        if (curDealRecord) {
          onReminder(curDealRecord);
          if (curDealRecord.deal_id) dealDiffMarkRead({ deal_id_list: [curDealRecord.deal_id] });
        }
        break;
      // 删除
      case DealRecordContextEnum.Delete:
        if (curDealRecord)
          onDelete(curDealRecord, () => {
            onDealRecordModify({
              payload: {
                deal_id: curDealRecord.deal_id ?? '',
                deal_status: BondDealStatus.DealDelete
              },
              operationType: DealOperationType.DOTReceiptDealDelete,
              showIllegal: true
            });
          });
        break;
      default:
        break;
    }
  }

  return { handleContextMenuClick, cloneGranterId };
};
