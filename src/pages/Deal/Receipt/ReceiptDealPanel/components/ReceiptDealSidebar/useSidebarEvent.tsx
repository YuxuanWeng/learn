import { message } from '@fepkg/components/Message';
import { ReceiptDeal } from '@fepkg/services/types/bds-common';
import { DealOperationType, OperationSource, ReceiptDealStatus } from '@fepkg/services/types/enum';
import { deleteBridgeReceiptDeal } from '@/common/services/api/receipt-deal/bridge-delete';
import { mulConfirmReceiptDeal } from '@/common/services/api/receipt-deal/mul-confirm';
import { submitReceiptDeal } from '@/common/services/api/receipt-deal/submit';
import { urgentReceiptDeal } from '@/common/services/api/receipt-deal/urgent';
import { trackPoint } from '@/common/utils/logger/point';
import { miscStorage } from '@/localdb/miscStorage';
import { ReceiptDealFormMode } from '@/pages/Deal/Receipt/ReceiptDealForm/types';
import { toastRequestError } from '@/pages/Deal/Receipt/ReceiptDealForm/utils';
import { validationReceiptDeal } from '@/pages/Deal/Receipt/ReceiptDealForm/utils/validation/validationReceiptDeal';
import { ReceiptDealTrace } from '@/pages/Deal/Receipt/ReceiptDealPanel/components/ReceiptDealTable/types';
import { checkIllegalList } from '@/pages/Spot/utils/bridge';
import { useReceiptDealPanel } from '../../providers/ReceiptDealPanelProvider';
import { checkReceiptDealCanSubmit, validateDeleteTradingElements } from '../../utils';
import { ReceiptDealAction } from './constants';

export type IHandleOpenReceiptDealForm = (
  mode: ReceiptDealFormMode,
  defaultReceiptDeal?: Partial<ReceiptDeal>,
  editable?: boolean
) => void;

const operation_source = OperationSource.OperationSourceReceiptDeal;

export const useSidebarEvent = () => {
  const { selectedList, handleRefetch } = useReceiptDealPanel();
  const firstRaw = selectedList.at(0);
  const first = firstRaw?.original;

  const onEvent = async (type: ReceiptDealAction, handleOpenDialog?: IHandleOpenReceiptDealForm) => {
    switch (type) {
      case ReceiptDealAction.Submit: {
        try {
          const toBeConfirmedList = selectedList.filter(i => checkReceiptDealCanSubmit(i.original));

          await submitReceiptDeal({
            receipt_deal_ids: toBeConfirmedList?.map(i => i.original.receipt_deal_id) ?? [],
            operation_source
          }).then(handleRefetch);
        } catch {
          message.error('提交失败！');
        }
        break;
      }
      case ReceiptDealAction.Edit: {
        trackPoint(ReceiptDealTrace.SidebarEdit);

        handleOpenDialog?.(ReceiptDealFormMode.Edit, first, firstRaw?.editable);
        break;
      }
      case ReceiptDealAction.Join: {
        trackPoint(ReceiptDealTrace.SidebarJoin);
        handleOpenDialog?.(ReceiptDealFormMode.Join, first);
        break;
      }
      case ReceiptDealAction.Urgent: {
        // 存在unUrgent的则把这些加急，否则全部取消加急
        const unUrgentList = selectedList.filter(
          i =>
            i.original.receipt_deal_status !== ReceiptDealStatus.ReceiptDealDestroyed &&
            i.original.receipt_deal_status !== ReceiptDealStatus.ReceiptDealDeleted &&
            !i.original.flag_urgent
        );
        const flagUrgent = unUrgentList.length > 0;

        await urgentReceiptDeal({
          receipt_deal_ids: (flagUrgent ? unUrgentList : selectedList).map(i => i.original.receipt_deal_id),
          flag_urgent: flagUrgent,
          operation_source
        }).then(handleRefetch);
        break;
      }
      case ReceiptDealAction.DeleteBridge: {
        if (selectedList.length < 2) {
          message.error('成交单数量小于2！删桥失败');
          break;
        }
        const areTradingElementsSame = validateDeleteTradingElements(selectedList, first);
        if (!areTradingElementsSame) {
          message.error('结算方式不一致，删桥失败！');
          break;
        }
        const sortSelectedList = [...selectedList].sort((a, b) => {
          return (a?.original?.bridge_index ?? 0) - (b?.original?.bridge_index ?? 0);
        });

        await deleteBridgeReceiptDeal(
          {
            receipt_deal_ids: sortSelectedList.map(i => i.original.receipt_deal_id),
            operation_source
          },
          { hideErrorMessage: true }
        )
          .then(result => {
            handleRefetch();
            return checkIllegalList(result?.receipt_deal_operate_illegal_list ?? []);
          })
          .catch(toastRequestError);

        break;
      }
      case ReceiptDealAction.Confirm: {
        const confirmReceiptDealIdList = selectedList
          .filter(
            row =>
              !row.original.flag_need_bridge &&
              validationReceiptDeal(row.original) &&
              row.original.receipt_deal_status === ReceiptDealStatus.ReceiptDealToBeConfirmed &&
              ((row.isBidMine && !row.original.flag_bid_broker_confirmed) ||
                (row.isOfrMine && !row.original.flag_ofr_broker_confirmed))
          )
          .map(row => row.original.receipt_deal_id);
        await mulConfirmReceiptDeal({
          receipt_deal_ids: confirmReceiptDealIdList,
          operation_info: {
            operator: miscStorage.userInfo?.user_id ?? '',
            operation_type: DealOperationType.DOTReceiptDealMulConfirm,
            operation_source: OperationSource.OperationSourceReceiptDeal
          }
        });
        break;
      }
      // 放ReceiptDealSidebar里了
      // case ReceiptDealAction.Delete:
      // case ReceiptDealAction.Destroy:
      default:
        message.error('未知行为！');
        break;
    }
  };
  return {
    onEvent
  };
};
