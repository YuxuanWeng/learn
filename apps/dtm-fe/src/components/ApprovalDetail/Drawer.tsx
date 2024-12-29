import { useMemo, useRef } from 'react';
import cx from 'classnames';
import { Button } from '@fepkg/components/Button';
import { Drawer } from '@fepkg/components/Drawer';
import { TextArea } from '@fepkg/components/Input';
import { Modal } from '@fepkg/components/Modal';
import { Radio, RadioGroup } from '@fepkg/components/Radio';
import { IconCheckCircleFilled, IconCloseCircleFilled, IconInfoFilled, IconLeft } from '@fepkg/icon-park-react';
import { ReceiptDeal } from '@fepkg/services/types/common';
import { DealOperationType, OperationSource, ReceiptDealStatus } from '@fepkg/services/types/enum';
import { DTMTrackEventDashBoardEnum } from '@/hooks/useLog';
import { useAuth } from '@/providers/AuthProvider';
import { useMemoizedFn } from 'ahooks';
import { useImmer } from 'use-immer';
import { trackPoint } from '@/common/logger';
import { updateApproval } from '@/common/services/api/approval/update';
import { useReceiptDealByParentQuery } from '@/common/services/hooks/useReceiptDealByParentQuery';
import { useReceiptDealQuery } from '@/common/services/hooks/useReceiptDealQuery';
import { transform2ReceiptDealCache } from '@/pages/ApprovalList/components/ApprovalTable/utils';
import { DisapprovalReceiptDealStatusSet } from '@/pages/ApprovalList/constants/filter';
import { useApprovalTable } from '@/pages/ApprovalList/providers/TableProvider';
import { ApprovalListType } from '@/pages/ApprovalList/types';
import { ConflictToast } from './ConflictToast';
import { ApprovalDetailRender } from './Render';
import { ApprovalDetailDrawerProps } from './types';
import { getActionControllers, isApproval, isDestroyApproval } from './utils';
import './index.less';

const toggleBtnCls = 'absolute top-[276px] w-8 h-30';
const footerBtnCls = 'w-30';

const DEFAULT_APPROVAL_STATE = {
  modalOpen: false,
  reason: '',
  loading: false,
  flagAssociateDisapproval: false
};

const hideDestroyApprovalStatus = new Set([
  ReceiptDealStatus.ReceiptDealStatusNone,
  ReceiptDealStatus.ReceiptDealToBeHandOver,
  ReceiptDealStatus.ReceiptDealToBeConfirmed,
  ReceiptDealStatus.ReceiptDealToBeSubmitted,
  ReceiptDealStatus.ReceiptDealDeleted
]);

export const ApprovalDetailDrawer = ({ ...drawerProps }: ApprovalDetailDrawerProps) => {
  const { user } = useAuth();
  const {
    type: pageType,
    data: tableData,
    relatedFilterValue,
    receiptDealCache,
    drawerState,
    updateDrawerState,
    handleRefetch: refetchTableData
  } = useApprovalTable();

  const [approvalState, updateApprovalState] = useImmer(DEFAULT_APPROVAL_STATE);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const selectedIdx = useMemo(
    () => receiptDealCache.ids.indexOf(drawerState.selectedId),
    [receiptDealCache.ids, drawerState.selectedId]
  );

  const { data, refetch } = useReceiptDealQuery(drawerState.selectedId ? [drawerState.selectedId] : [], {
    initialData: { receipt_deal_info_list: drawerState.initialData }
  });
  const [receiptDeal] = data?.receipt_deal_info_list ?? [];
  const [conflictType] = data?.conflict_type_list ?? [];
  const { receipt_deal_status, cur_approval_role } = receiptDeal ?? {};

  const hasBridge = Boolean(receiptDeal.bridge_index);

  const { data: bridgeList, refetch: refetchBridgeList } = useReceiptDealByParentQuery(
    drawerState.initialData.at(0)?.parent_deal_id,
    hasBridge && !isDestroyApproval(receiptDeal?.advanced_approval_type)
  );

  const bridgeOrderNoList = useMemo(
    () =>
      // 待审核、送审中、已通过的非当前关联单可以关联退回
      bridgeList
        ?.filter(
          r =>
            DisapprovalReceiptDealStatusSet.has(r.receipt_deal_status) &&
            r.order_no &&
            r.order_no !== receiptDeal.order_no
        )
        ?.map(d => d.order_no),
    [bridgeList, receiptDeal.order_no]
  );

  const showAssociateRadio =
    hasBridge && !isDestroyApproval(receiptDeal?.advanced_approval_type) && Boolean(bridgeOrderNoList?.length);

  const disabledState = {
    prev: selectedIdx === 0 || selectedIdx === -1,
    next: selectedIdx === receiptDealCache.ids.length - 1 || selectedIdx === -1
  };

  // 部分状态不展示毁单申请
  const showDestroyApproval =
    !hideDestroyApprovalStatus.has(receiptDeal?.receipt_deal_status) &&
    isDestroyApproval(receiptDeal?.advanced_approval_type);

  const { controllers } = getActionControllers({
    receipt_deal_status,
    cur_approval_role,
    cur_role_list: tableData?.cur_role_list
  });

  const handleOpenChange = useMemoizedFn((open: boolean) => {
    updateDrawerState(draft => {
      draft.open = open;
      draft.selectedId = '';
      draft.initialData = [];
    });

    if (!open) updateApprovalState(DEFAULT_APPROVAL_STATE);
  });

  const handleDataChange = (type: 'prev' | 'next') => {
    let newSelectedId = '';
    const newInitialData: ReceiptDeal[] = [];

    if (type === 'prev') {
      if (disabledState.prev) return;

      const prevItem = receiptDealCache.items[selectedIdx - 1];
      if (!prevItem) return;

      newSelectedId = prevItem.receipt_deal_id;
      newInitialData.push(prevItem);
    } else {
      if (disabledState.next) return;

      const nextItem = receiptDealCache.items[selectedIdx + 1];
      if (!nextItem) return;

      newSelectedId = nextItem.receipt_deal_id;
      newInitialData.push(nextItem);
    }

    updateDrawerState(draft => {
      draft.selectedId = newSelectedId;
      draft.initialData = newInitialData;
    });
  };

  // 跳转到可审批的成交单
  const handleApprovalChange = (type: 'prev' | 'next', cache = receiptDealCache, state = disabledState) => {
    let newSelectedId = '';
    const newInitialData: ReceiptDeal[] = [];

    if (type === 'prev') {
      if (state.prev) return;

      for (let i = selectedIdx; i >= 0; i--) {
        const prevItem = cache.items[i];
        if (isApproval(prevItem, tableData?.cur_role_list)) {
          newSelectedId = prevItem.receipt_deal_id;
          newInitialData.push(prevItem);
          break;
        }
      }
      if (!newSelectedId) {
        handleOpenChange(false);
        return;
      }
    } else {
      if (state.next) return;

      for (let i = selectedIdx; i < cache.items.length; i++) {
        const nextItem = cache.items[i];
        if (isApproval(nextItem, tableData?.cur_role_list)) {
          newSelectedId = nextItem.receipt_deal_id;
          newInitialData.push(nextItem);
          break;
        }
      }
      if (!newSelectedId) {
        handleOpenChange(false);
        return;
      }
    }

    updateDrawerState(draft => {
      draft.selectedId = newSelectedId;
      draft.initialData = newInitialData;
    });
  };

  const handleDrawerMaskClick = () => {
    if (approvalState.modalOpen) updateApprovalState(DEFAULT_APPROVAL_STATE);
  };

  const handleReasonMdlShow = () => {
    refetchBridgeList();
    updateApprovalState(draft => {
      draft.modalOpen = true;
    });

    trackPoint(DTMTrackEventDashBoardEnum.ClickApprovalButton, { keyword: 'NoPass' });
    requestIdleCallback(() => inputRef.current?.focus());
  };

  const handleReasonMdlCancel = () => {
    updateApprovalState(DEFAULT_APPROVAL_STATE);
  };

  const approve = (approved: boolean) => {
    updateApprovalState(draft => {
      draft.loading = true;
    });

    updateApproval({
      receipt_deal_id: drawerState.selectedId,
      is_approved: approved,
      disapproval_reason: approved ? undefined : approvalState.reason,
      flag_associate_disapproval:
        // 含桥毁单申请必须关联回退
        hasBridge && isDestroyApproval(receiptDeal?.advanced_approval_type)
          ? true
          : showAssociateRadio && approvalState.flagAssociateDisapproval,
      operation_info: {
        operator: user?.user_id ?? '',
        operation_type: approved ? DealOperationType.DOTReceiptDealApprove : DealOperationType.DOTReceiptDealReturn,
        operation_source: OperationSource.OperationSourceApproveReceiptDeal
      }
    })
      .then(async () => {
        const [, newTableData] = await Promise.all([refetch(), refetchTableData()]);

        const newReceiptDealCache = transform2ReceiptDealCache(newTableData?.data?.list);

        const newDisabledState = {
          prev: selectedIdx === 0 || selectedIdx === -1,
          next: selectedIdx === newReceiptDealCache.ids.length - 1 || selectedIdx === -1
        };

        // 如果不能翻页，则关闭 drawer
        if (!newReceiptDealCache.ids.length) handleOpenChange(false);
        // 能够往后翻页，则展示下一页的数据
        // 此处relatedFilterValue.handled===false与undefined是两种不同状态
        else if (!newDisabledState.next) handleApprovalChange('next', newReceiptDealCache, newDisabledState);
        // 能够往前翻页，则展示上一页的数据
        else if (!newDisabledState.prev) handleApprovalChange('prev', newReceiptDealCache, newDisabledState);
      })
      .finally(() => {
        updateApprovalState(draft => {
          draft.loading = false;
        });
      });
  };

  const handleNoPass = () => {
    if (!approvalState.reason) return;

    handleReasonMdlCancel();

    approve(false);
  };

  const handlePass = () => {
    approve(true);
    trackPoint(DTMTrackEventDashBoardEnum.ClickApprovalButton, { keyword: 'Pass' });
  };

  if (!drawerState.open) return null;

  return (
    <>
      <Drawer
        {...drawerProps}
        maskCloseable={!approvalState.modalOpen}
        open={drawerState.open}
        onOpenChange={handleOpenChange}
        onMaskClick={handleDrawerMaskClick}
      >
        <div className="approval-detail-drawer">
          <header className="p-4 text-md text-gray-000 bg-gray-800 border-0 border-b border-solid border-gray-600 rounded-tl-[15px]">
            成交表单
          </header>

          <main className="container">
            <div className="px-18">
              {receiptDeal && (
                <ApprovalDetailRender
                  target={receiptDeal}
                  snapshot={pageType === ApprovalListType.Approval ? receiptDeal?.disapproval_snapshot : void 0}
                />
              )}
            </div>

            <Button
              type="gray"
              plain
              className={cx(toggleBtnCls, 'left-3')}
              disabled={disabledState.prev}
              icon={<IconLeft size={20} />}
              onClick={() => handleDataChange('prev')}
            />
            <Button
              type="gray"
              plain
              className={cx(toggleBtnCls, 'right-3')}
              disabled={disabledState.next}
              icon={
                <IconLeft
                  size={20}
                  className="rotate-180"
                />
              }
              onClick={() => handleDataChange('next')}
            />
          </main>

          {showDestroyApproval && (
            <div className="flex-center px-3 pb-2">
              <div className="flex-center gap-1 h-8 px-3 text-gray-200 bg-gray-600 rounded-lg">
                <IconInfoFilled />
                <span>毁单原因：{receiptDeal?.destroy_reason}</span>
              </div>
            </div>
          )}

          {drawerState.action && controllers.size > 0 && (
            <>
              <div className="component-dashed-x h-px" />

              <footer className="flex-center gap-6 py-3 rounded-bl-[15px]">
                {controllers.has('no-pass') && (
                  <Button
                    type="danger"
                    className={footerBtnCls}
                    icon={<IconCloseCircleFilled />}
                    onClick={handleReasonMdlShow}
                  >
                    不通过
                  </Button>
                )}

                {controllers.has('pass') && (
                  <Button
                    className={footerBtnCls}
                    icon={<IconCheckCircleFilled />}
                    onClick={handlePass}
                  >
                    通过
                  </Button>
                )}
              </footer>
            </>
          )}
        </div>
      </Drawer>

      <Modal
        visible={approvalState.modalOpen}
        title="退回成交单"
        width={440}
        keyboard
        draggable={false}
        className="[&_.ant-modal-body]:py-3 [&_.ant-modal-body]:px-4"
        getContainer={() => document.querySelector('.approval-detail-drawer') ?? document.body}
        footerProps={{
          centered: true,
          confirmBtnProps: {
            disabled: !approvalState.reason,
            loading: approvalState.loading
          }
        }}
        onConfirm={handleNoPass}
        onCancel={handleReasonMdlCancel}
      >
        <TextArea
          ref={inputRef}
          placeholder="请输入不通过原因"
          className="bg-gray-800 h-16"
          autoFocus
          maxLength={30}
          composition
          autoSize={{ minRows: 3, maxRows: 3 }}
          value={approvalState.reason}
          onChange={val => {
            updateApprovalState(draft => {
              draft.reason = val;
            });
          }}
          onEnterPress={async (_, evt, composing) => {
            // 如果按下 shift 键，仅换行，不进行其他操作
            if (evt.shiftKey) return;

            // 如果不是同时按下 shift 键，阻止默认事件
            evt.preventDefault();
            // 如果不是正在输入中文，提交
            if (!composing) handleNoPass();
          }}
        />
        {showAssociateRadio && (
          <div className="mt-2 px-3 py-2 bg-gray-800 rounded-lg flex flex-col gap-y-2">
            <RadioGroup
              value={[approvalState.flagAssociateDisapproval]}
              className="gap-8"
              onChange={val => {
                updateApprovalState(draft => {
                  draft.flagAssociateDisapproval = Boolean(val.at(0));
                });
              }}
            >
              <Radio
                type="radio"
                value={false}
              >
                仅退回本单
              </Radio>
              <Radio
                type="radio"
                value
              >
                退回同桥码成交单
              </Radio>
            </RadioGroup>
            {approvalState.flagAssociateDisapproval && (
              <>
                <div className="component-dashed-x-600" />
                <div className="text-primary-100 flex">
                  <div className="flex-shrink-0">订单号：</div>
                  <div>{bridgeOrderNoList?.join('、')}</div>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>

      {pageType !== ApprovalListType.History && drawerState.open && (
        <ConflictToast
          key={drawerState.selectedId}
          receiptDeal={receiptDeal}
          type={conflictType}
          onConfirm={() => handleOpenChange(false)}
        />
      )}
    </>
  );
};
