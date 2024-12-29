import { RequestConfig, ResponseError, StatusCode } from '@fepkg/request/types';
import type { BondDealUpdate, DealRecordUpdate } from '@fepkg/services/types/deal/record-update';
import { BondDealStatus, DealOperationType, OperationSource } from '@fepkg/services/types/enum';
import { useMutation } from '@tanstack/react-query';
import { updateDealRecord } from '@/common/services/api/deal/update-spot-price';
import { queryClient } from '@/common/utils/query-client';
import { miscStorage } from '@/localdb/miscStorage';
import { toastRequestError } from '@/pages/Deal/Receipt/ReceiptDealForm/utils';
import { checkIllegalList } from '@/pages/Spot/utils/bridge';
import { showConcurrentCheckModal } from '@/pages/Spot/utils/editBridgeCheckModal';
import { useDealRecord } from '../providers/DealRecordProvider';
import { DealRecordQueryResult } from '../types';
import { getDealRecordList } from '../utils';

/** 成交记录数据查询/修改 */
export const useDealRecordModify = () => {
  const { refetch, queryKey } = useDealRecord();

  /** 操作react-query中的缓存 */
  const mutateQueryData = async (data?: DealRecordQueryResult) => {
    const cache = queryClient.getQueryData<DealRecordQueryResult>(queryKey, { exact: true });

    await queryClient.cancelQueries(queryKey, { exact: true });

    try {
      // 乐观更新
      queryClient.setQueryData(queryKey, data);
    } catch {
      // 更新失败后回滚缓存前的内容
      queryClient.setQueryData(queryKey, cache);
      queryClient.invalidateQueries(queryKey);
    }
  };

  const { mutate } = useMutation<DealRecordUpdate.Response, ResponseError, DealRecordUpdate.Request, () => void>({
    mutationFn: (params: DealRecordUpdate.Request, config?: RequestConfig) =>
      updateDealRecord(params, {
        hideErrorMessage: true,
        ...config
      }),
    onMutate(variables) {
      const cache = queryClient.getQueryData<DealRecordQueryResult>(queryKey, { exact: true });

      // 删除时触发乐观更新
      if (variables.bond_deal.deal_status === BondDealStatus.DealDelete) {
        const list = cache?.deal_info_list?.filter(i => i.deal_id !== variables.bond_deal.deal_id);
        const deal_info_list = getDealRecordList(list, undefined);
        mutateQueryData({ ...cache, deal_info_list });
      } else {
        // 修改时乐观更新
        const deal_info_list = cache?.deal_info_list?.map(deal => {
          // 如果不是当前正在修改的成交
          if (deal.deal_id !== variables.bond_deal.deal_id) return deal;
          // 如果修改的是过桥标志
          if (Object.hasOwn(variables.bond_deal, 'flag_bridge')) {
            return {
              ...deal,
              flag_bridge: variables.bond_deal.flag_bridge as boolean,
              // 点亮过桥可以更新bid/ofr发单消息，熄灭过桥清空bid/ofr发单消息
              bid_send_order_msg: variables.bond_deal.flag_bridge ? deal.bid_send_order_msg : '',
              ofr_send_order_msg: variables.bond_deal.flag_bridge ? deal.ofr_send_order_msg : ''
            };
          }

          // 如果修改的是交割
          if (Object.hasOwn(variables.bond_deal, 'bid_delivery_date')) {
            return {
              ...deal,
              bid_settlement_type: variables.bond_deal.bid_settlement_type ?? deal.bid_settlement_type,
              bid_delivery_date: variables.bond_deal.bid_delivery_date ?? deal.bid_delivery_date,
              bid_traded_date: variables.bond_deal.bid_traded_date ?? deal.bid_traded_date,
              ofr_settlement_type: variables.bond_deal.ofr_settlement_type ?? deal.ofr_settlement_type,
              ofr_delivery_date: variables.bond_deal.ofr_delivery_date ?? deal.ofr_delivery_date,
              ofr_traded_date: variables.bond_deal.ofr_traded_date ?? deal.ofr_traded_date,
              flag_exchange: variables.bond_deal.flag_stock_exchange ?? deal.flag_exchange,
              exercise_manual: variables.bond_deal.exercise_manual ?? deal.exercise_manual,
              exercise_type: variables.bond_deal.exercise_type ?? deal.exercise_type
            };
          }
          return deal;
        });
        mutateQueryData({ ...cache, deal_info_list });
      }
      return () => {
        mutateQueryData(cache);
      };
    }
  });

  /** 修改要素 */
  const onDealRecordModify = ({
    payload: val,
    operationType,
    onError,
    showIllegal
  }: {
    payload: BondDealUpdate;
    operationType: DealOperationType;
    onError?: VoidFunction;
    showIllegal?: boolean;
  }) => {
    // 获取修改成交记录请求参数
    const getParams = (): DealRecordUpdate.Request => {
      return {
        bond_deal: val,

        operation_info: {
          operator: miscStorage.userInfo?.user_id ?? '',
          operation_type: operationType,
          operation_source: OperationSource.OperationSourceSpotPricing
        }
      };
    };
    mutate(getParams(), {
      onError(error, __, restoreCache) {
        // 修改失败，回滚到上一次的缓存
        restoreCache?.();
        if (error?.data?.base_response?.code === StatusCode.ConcurrentCheckError) {
          showConcurrentCheckModal();
        } else toastRequestError(error);
        onError?.();
        refetch();
      },
      onSuccess(data) {
        if (showIllegal) {
          checkIllegalList(data.receipt_deal_operate_illegal_list ?? []);
        }
      }
    });
  };

  return { onDealRecordModify };
};
