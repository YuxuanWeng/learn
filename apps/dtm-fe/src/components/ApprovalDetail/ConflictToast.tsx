import { ReactNode, useEffect, useMemo } from 'react';
import { ModalUtils } from '@fepkg/components/Modal';
import { fetchUserInfo } from '@fepkg/services/api/user/get-info';
import { ReceiptDeal } from '@fepkg/services/types/common';
import { ReceiptDealConflictType, ReceiptDealStatus } from '@fepkg/services/types/enum';
import { useAuth } from '@/providers/AuthProvider';
import { useMemoizedFn, usePrevious } from 'ahooks';
import { useApprovalTable } from '@/pages/ApprovalList/providers/TableProvider';
import { ApprovalListType } from '@/pages/ApprovalList/types';

type ConflictToastProps = {
  /** 成交单数据 */
  receiptDeal?: ReceiptDeal;
  /** 冲突类型 */
  type?: ReceiptDealConflictType;
  /** 点击我知道时的回调 */
  onConfirm?: () => void;
};

export const ConflictToast = ({ receiptDeal, type, onConfirm }: ConflictToastProps) => {
  const { user } = useAuth();
  const { type: pageType } = useApprovalTable();

  // --- 操作冲突场景 --- start
  const conflictCache = useMemo(
    () => ({
      receiptDealId: receiptDeal?.receipt_deal_id,
      type,
      approvers: receiptDeal?.all_approver_id_list,
      status: receiptDeal?.receipt_deal_status
    }),
    [receiptDeal?.receipt_deal_id, receiptDeal?.all_approver_id_list, receiptDeal?.receipt_deal_status, type]
  );
  const prevConflictCache = usePrevious(conflictCache);

  const toastConflict = useMemoizedFn((title: string, content: ReactNode) => {
    ModalUtils.warning({
      title,
      content,
      className: 'rounded-xl',
      getContainer: () => document.querySelector('.approval-detail-drawer') ?? document.body,
      keyboard: false,
      showCancel: false,
      okText: '我知道了',
      onOk: () => onConfirm?.()
    });
  });

  useEffect(() => {
    if (conflictCache?.receiptDealId === prevConflictCache?.receiptDealId) {
      const approvers = conflictCache?.approvers;
      const prevApprovers = prevConflictCache?.approvers;

      const latestId = approvers?.at(-1);

      if (
        prevConflictCache?.type !== undefined &&
        (conflictCache?.type !== prevConflictCache?.type ||
          conflictCache?.status !== prevConflictCache?.status ||
          (approvers && prevApprovers && approvers.length !== prevApprovers.length))
      ) {
        if (pageType === ApprovalListType.Deal) {
          if (conflictCache.status === ReceiptDealStatus.ReceiptDealNoPass) {
            toastConflict(
              '成交单状态变更',
              <span>
                成交单<span className="text-primary-100">({receiptDeal?.order_no})</span>
                审核不通过，状态回退，请刷新界面。
              </span>
            );
          } else {
            toastConflict(
              '成交单状态变更',
              <span>
                成交单<span className="text-primary-100">({receiptDeal?.order_no})</span>被修改，状态回退，请刷新界面。
              </span>
            );
          }
          return;
        }
        switch (conflictCache.type) {
          case ReceiptDealConflictType.UnSubmit:
            toastConflict(
              '成交单状态变更',
              <span>
                成交单<span className="text-primary-100">({receiptDeal?.order_no})</span>已被OMS-成交单
                <span className="text-primary-100">{receiptDeal?.operator?.name_cn}</span>
                操作，请刷新状态。
              </span>
            );

            break;
          case ReceiptDealConflictType.AuthorityChange:
            toastConflict(
              '成交单状态变更',
              <span>
                当前成交单<span className="text-primary-100">({receiptDeal?.order_no})</span>
                审核流程配置权限变更，请刷新状态。
              </span>
            );
            break;
          default:
            if (!(approvers && prevApprovers)) return;

            if (approvers.length > prevApprovers.length && latestId && latestId !== user?.user_id) {
              fetchUserInfo({ user_ids: [latestId] }).then(res => {
                const [latest] = res?.user_list ?? [];

                toastConflict(
                  '成交单已被处理',
                  <span>
                    当前成交单<span className="text-primary-100">({receiptDeal?.order_no})</span>被
                    <span className="text-primary-100">{latest?.name_cn}</span>
                    处理，请刷新状态。
                  </span>
                );
              });
            } else if (approvers.length < prevApprovers.length) {
              toastConflict(
                '成交单状态变更',
                <span>
                  成交单<span className="text-primary-100">({receiptDeal?.order_no})</span>
                  审核流程配置权限变更，请刷新状态。
                </span>
              );
            }
            break;
        }
      }
    }
  }, [conflictCache, pageType, prevConflictCache, receiptDeal, toastConflict, user?.user_id]);
  // --- 操作冲突场景 --- end

  return null;
};
