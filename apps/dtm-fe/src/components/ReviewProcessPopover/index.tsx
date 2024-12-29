import { ReactNode, useMemo } from 'react';
import cx from 'classnames';
import { formatDate } from '@fepkg/common/utils/index';
import { Popover } from '@fepkg/components/Popover';
import { IconCheckCircleFilled, IconCloseCircleFilled, IconTimeFilled } from '@fepkg/icon-park-react';
import { ReceiptDeal, ReceiptDealRoleMember } from '@fepkg/services/types/common';
import { ReceiptDealStatus } from '@fepkg/services/types/enum';
import { ReceiptDealApprovalGetProcess } from '@fepkg/services/types/receipt-deal/approval-get-process';
import { useReceiptDealProcess } from '@/common/services/hooks/useReceiptDealProcess';
import { AvatarList } from '@/pages/BackendSetting/RoleSetting/RoleTable/AvatarList';

type PopoverProps = {
  receiptDeal?: ReceiptDeal;
  children?: ReactNode;
};

type ContentProps = {
  receiptDeal: ReceiptDeal;
};

enum IconStatus {
  Checked,
  Unchecked,
  Error
}

type ItemProps = {
  status?: IconStatus;
  title?: string;
  titleSuffix?: string;
  timeStamp?: string;
  userList?: ReceiptDealRoleMember[];
  hasMore?: boolean;
  skeleton?: boolean;
};

const getStateIcon = (status?: IconStatus) => {
  switch (status) {
    case IconStatus.Checked:
      return <IconCheckCircleFilled className="text-primary-100" />;
    case IconStatus.Unchecked:
      return <IconTimeFilled className="text-orange-100" />;
    case IconStatus.Error:
      return <IconCloseCircleFilled className="text-danger-100" />;
    default:
      return null;
  }
};

const ReviewProcessItem = ({ status, title, titleSuffix, timeStamp, userList, hasMore, skeleton }: ItemProps) => {
  return (
    <div className={cx(skeleton && 'animate-pulse')}>
      <div
        className={cx('h-6 pl-2 w-fit flex items-center bg-gray-600 overflow-hidden rounded-lg', skeleton && '!w-16')}
      >
        {!skeleton && getStateIcon(status)}
        <span className="mx-2 text-sm">{!skeleton && title}</span>
        {!skeleton && titleSuffix && (
          <span className="w-6 text-center leading-6 text-gray-100 bg-gray-500 font-normal text-xs">{titleSuffix}</span>
        )}
      </div>
      <div className={cx('flex flex-1 mt-2', hasMore && 'h-[62px]')}>
        <span className="flex gap-4">
          <div className={cx('component-dashed-y h-full ml-4', !hasMore && 'opacity-0')} />
          <div className="h-8 flex gap-4 items-center">
            <AvatarList
              list={!skeleton ? userList : [{ member_id: '', member_name: '' }]}
              showTitle={false}
            />
            {!skeleton && timeStamp && (
              <span className="text-xs text-gray-300 font-normal">{formatDate(timeStamp, 'MM-DD HH:mm:ss')}</span>
            )}
          </div>
        </span>
      </div>
    </div>
  );
};

/** 中断后续流程展示的审批类型 */
const BreakPointStatusSet = new Set([ReceiptDealStatus.ReceiptDealNoPass, ReceiptDealStatus.ReceiptDealDeleted]);

const ReviewProcessContent = ({ receiptDeal }: ContentProps) => {
  const { data } = useReceiptDealProcess(receiptDeal?.receipt_deal_id);

  const approvalList = useMemo(() => {
    let list: Partial<ReceiptDealApprovalGetProcess.ApprovalProcess>[];
    if (data) {
      list = [...(data?.advanced_approval_list ?? []), ...(data?.normal_approval_list ?? [])];
    } else {
      const idListLength = receiptDeal.all_approver_id_list?.length ?? 0;
      const roleListLength = receiptDeal.all_approval_role_list?.length ?? 0;
      // 已通过后成交单审核不通过时，idListLength会大于roleListLength
      list = BreakPointStatusSet.has(receiptDeal?.receipt_deal_status)
        ? Array.from(
            {
              length: idListLength > roleListLength ? roleListLength : idListLength
            },
            () => ({})
          )
        : Array.from({ length: roleListLength }, () => ({}));
    }

    if (BreakPointStatusSet.has(receiptDeal?.receipt_deal_status)) {
      list = list.slice(0, receiptDeal.all_approver_id_list?.length ?? 0);
    }

    return list.reverse();
  }, [data, receiptDeal.all_approval_role_list, receiptDeal.all_approver_id_list, receiptDeal?.receipt_deal_status]);

  return (
    <div className="py-4 pl-4 pr-3 mr-px flex flex-col gap-y-2 overflow-y-scroll">
      {data?.associated_approval && (
        <ReviewProcessItem
          title={receiptDeal.receipt_deal_status === ReceiptDealStatus.ReceiptDealNoPass ? '关联退回' : '关联毁单'}
          status={
            receiptDeal.receipt_deal_status === ReceiptDealStatus.ReceiptDealNoPass
              ? IconStatus.Error
              : IconStatus.Checked
          }
          hasMore
          userList={[
            {
              member_id: data.associated_approval.approver ?? '',
              member_name: data.associated_approval.approver_name ?? ''
            }
          ]}
          timeStamp={data.associated_approval.approval_time}
        />
      )}
      {approvalList.map((item, index) => {
        let status = IconStatus.Checked;
        if (BreakPointStatusSet.has(receiptDeal?.receipt_deal_status) && !item.flag_approval_pass) {
          status = IconStatus.Error;
        } else if (!item.flag_approval_pass) {
          status = IconStatus.Unchecked;
        }

        return (
          <ReviewProcessItem
            key={`${receiptDeal?.receipt_deal_id}-${index}`}
            title={item?.approval_role?.approval_role_name}
            titleSuffix={index < (data?.normal_approval_list?.length ?? 0) ? '普' : '高'}
            status={status}
            skeleton={!data}
            hasMore
            // 已通过环节只展示操作人
            userList={
              status === IconStatus.Unchecked
                ? item.approval_role?.role_member_list ?? []
                : [{ member_id: item.approver ?? '', member_name: item.approver_name ?? '' }]
            }
            timeStamp={item.approval_time}
          />
        );
      })}
      <ReviewProcessItem
        title="提交"
        status={IconStatus.Checked}
        skeleton={!data}
        userList={[{ member_id: data?.submitter ?? '', member_name: data?.submitter_name ?? '' }]}
        timeStamp={data?.submit_time}
      />
    </div>
  );
};

export const ReviewProcessPopover = ({ receiptDeal, children }: PopoverProps) => {
  return (
    <Popover
      trigger="click"
      floatingProps={{
        className: 'w-[255px] !p-0 max-h-[440px] !bg-gray-700 !border-gray-600 !drop-shadow-modal'
      }}
      content={receiptDeal && <ReviewProcessContent receiptDeal={receiptDeal} />}
      placement="left-start"
      arrowStyle={{ left: 'calc(100% - 2px)', fill: 'var(--color-gray-700)', stroke: 'var(--color-gray-600)' }}
    >
      {children}
    </Popover>
  );
};
