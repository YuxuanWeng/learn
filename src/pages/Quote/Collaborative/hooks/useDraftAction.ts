import { message as MessageUtils } from '@fepkg/components/Message';
import { QuoteDraftDetailConfirm, QuoteDraftDetailUpsert } from '@fepkg/services/types/common';
import {
  BondQuoteType,
  QuoteDraftDetailStatus,
  QuoteDraftIgnoreType,
  QuoteRelatedInfoFailedType,
  Side
} from '@fepkg/services/types/enum';
import { useSetAtom } from 'jotai';
import { mulUpdateBondQuoteDraftDetail } from '@/common/services/api/bond-quote-draft/detail-mul-update';
import { mulConfirmBondQuoteDraft } from '@/common/services/api/bond-quote-draft/mul-confirm';
import { mulIgnoreBondQuoteDraft } from '@/common/services/api/bond-quote-draft/mul-ignore';
import { LocalQuoteDraftDetail, LocalQuoteDraftMessage } from '@/common/services/hooks/local-server/quote-draft/types';
import { useProductParams } from '@/layouts/Home/hooks';
import { quoteBatchFormOpenAtom } from '@/pages/Quote/BatchForm/atoms';
import { QuoteOperImmerType, QuoteParamsType } from '@/pages/Quote/SingleQuote/QuoteOper/QuoteOperProvider';
import { QuoteFocusInputType } from '@/pages/Quote/SingleQuote/types';
import { QuoteReminder, checkQuoteReminder } from '../../SingleQuote/Reminder';
import { quoteMdlFocusInputAtom, quoteMdlOpenAtom, quoteMdlSelectedAtom } from '../atoms/modal';
import { useTableState } from '../providers/TableStateProvider';
import { DraftGroupTableColumnKey } from '../types/table';
import { isPendingStatus, transform2DetailConfirm, transform2MessageConfirm, updateMessageDetails } from '../utils';
import { checkUtils } from '../utils/check';

export type DraftDataUpsert = {
  type: 'details';
  messageId: string;
  details: LocalQuoteDraftDetail[];
};

export type DraftDataUpdater = (messages: LocalQuoteDraftMessage[]) => {
  messages: LocalQuoteDraftMessage[];
  upsert?: DraftDataUpsert;
};

/** 以下列双击默认不开打单条编辑面板 */
const excludeOpenQuoteKeys = new Set([
  DraftGroupTableColumnKey.Price,
  DraftGroupTableColumnKey.Volume,
  DraftGroupTableColumnKey.Side
]);

export const useDraftAction = () => {
  const { productType } = useProductParams();
  const {
    setSelectedDetailKeys,
    setSelectedMessageKey,
    updateKeepingTimestamp,
    optimisticUpdate,
    followingBrokerIds,
    selectedCache,
    selectedDetails,
    renderMessages,
    operable
  } = useTableState();
  const { message: selectedMessage } = selectedCache;

  const setQuoteMdlOpen = useSetAtom(quoteMdlOpenAtom);
  const setQuoteMdlSelected = useSetAtom(quoteMdlSelectedAtom);
  const setQuoteMdlFocusInput = useSetAtom(quoteMdlFocusInputAtom);

  const setBatchQuoteMdlOpen = useSetAtom(quoteBatchFormOpenAtom);

  const disabled = !selectedDetails.length;

  const getSelectedMessage = (detail?: LocalQuoteDraftDetail) => {
    const messageId = detail ? detail.message_id : selectedDetails[0]?.message_id;
    const message = renderMessages.find(m => m.message_id === messageId);
    return message;
  };

  const copy = () => {
    const content = selectedCache.details?.map(item => item.text).join('\n') ?? '';
    window.Main.copy(content);
  };

  /** 提交卡片 */
  const confirmMessage = async (target = selectedMessage) => {
    if (!operable) return;
    if (!target) return;

    updateKeepingTimestamp();

    if (!checkUtils.checkBasic(target)) return;
    if (!checkUtils.checkQuote(target)) return;

    // 去掉重复报价的判断
    // if (!checkUtils.checkRepeat(target)) return;

    let valid = await checkUtils.checkTradeDate(productType, target);
    if (!valid) return;
    let reminders: QuoteReminder[] = [];
    [valid, reminders] = await checkUtils.checkInvert(productType, target);
    if (!valid) return;

    const detailConfirms: QuoteDraftDetailConfirm[] = [];
    let detail_list: LocalQuoteDraftDetail[] = [];

    renderMessages.forEach(message => {
      if (message.message_id === target.original.message_id) {
        detail_list =
          message.detail_list?.map((detail, idx) => {
            if (isPendingStatus(detail?.status)) {
              const { side, flag_inverted } = detail;
              const reminder = reminders.find(r => r.bidIndex == idx || r.ofrIndex == idx);
              const changed = {
                ...detail,
                flag_inverted: side ? reminder?.[side]?.invertedInfo?.inverted : flag_inverted
              };
              const confirm = transform2DetailConfirm(changed);
              if (confirm) detailConfirms.push(confirm);
              return { ...changed, ...confirm };
            }
            return detail;
          }) ?? [];
      }
    });

    if (detailConfirms.length) {
      const { failed_list = [] } = await mulConfirmBondQuoteDraft({
        message: transform2MessageConfirm(target),
        detail_list: detailConfirms
      });

      for (const item of failed_list) {
        if (item.failed_type === QuoteRelatedInfoFailedType.FailedTypeTraderOrInst) {
          MessageUtils.error('机构或交易员失效！请核对后重新录入！');
          break;
        }

        if (item.failed_type === QuoteRelatedInfoFailedType.FailedTypeBroker) {
          MessageUtils.error('经纪人失效！请核对后重新录入！');
          break;
        }
      }
    } else {
      MessageUtils.error('未选中可编辑数据！');
    }

    setSelectedMessageKey(void 0);
    setSelectedDetailKeys(new Set());
  };

  const showEditModal = (detail?: LocalQuoteDraftDetail, key?: DraftGroupTableColumnKey) => {
    if (!operable) return;
    if (key && excludeOpenQuoteKeys.has(key)) return;

    /** 修改目标详情（多选时只能编辑待处理状态的详情，如果有 key，说明双击报价详情，此时不需要使用 selectedDetails 拿到修改目标） */
    const targetDetails = key ? [] : selectedDetails.filter(item => isPendingStatus(item?.status));

    const message = getSelectedMessage(detail);

    if (!(message && ((detail && isPendingStatus(detail?.status)) || targetDetails.length))) {
      MessageUtils.error('未选中可编辑数据！');
      return;
    }

    checkUtils.checkOtherProcessing({ message });

    updateKeepingTimestamp();

    if (detail || targetDetails.length === 1) {
      const target = detail ?? targetDetails[0];

      let focusInput: QuoteFocusInputType =
        target?.side === Side.SideOfr ? QuoteFocusInputType.OFR_PRICE : QuoteFocusInputType.BID_PRICE;

      if (key === DraftGroupTableColumnKey.Bond) focusInput = QuoteFocusInputType.BOND;
      else if (key === DraftGroupTableColumnKey.LiqSpeed) focusInput = QuoteFocusInputType.LIQ_SPEED;
      else if (key === DraftGroupTableColumnKey.Comment) focusInput = QuoteFocusInputType.COMMENT;

      setQuoteMdlOpen(true);
      setQuoteMdlSelected({ message, details: [target] });
      setQuoteMdlFocusInput(focusInput);
    } else if (targetDetails.length > 1) {
      setBatchQuoteMdlOpen(true);
      setQuoteMdlSelected({ message, details: targetDetails });
    }
  };

  const showEditInput = (detail?: LocalQuoteDraftDetail) => {
    const message = getSelectedMessage(detail);

    if (!(message && detail)) return false;
    const { status } = detail;

    const ignored = status === QuoteDraftDetailStatus.QuoteDraftDetailStatusIgnored;

    if (!operable || ignored) return false;

    checkUtils.checkOtherProcessing({ message });

    updateKeepingTimestamp();

    return true;
  };

  const edit = async (detail?: LocalQuoteDraftDetail, upsert?: QuoteDraftDetailUpsert) => {
    if (!operable) return;

    const message = getSelectedMessage(detail);

    if (!(message && detail && upsert)) {
      MessageUtils.error('未选中可编辑数据！');
      return;
    }

    if (!detail?.bond_info) {
      MessageUtils.error('未获取到产品数据！请核对后重新录入！');
      return;
    }

    const ignored = detail?.status === QuoteDraftDetailStatus.QuoteDraftDetailStatusIgnored;
    if (ignored) return;

    checkUtils.checkOtherProcessing({ message });

    updateKeepingTimestamp();

    // --- 倒挂检查 start ---
    const { bond_info, side = Side.SideNone } = detail;

    const updateInfo = { ...detail, ...upsert, key_market: bond_info.key_market };

    const quoteParams: QuoteOperImmerType<QuoteParamsType> = {
      [side]: {
        ...updateInfo,
        // 根据报价类型决定判断倒挂的价格类型
        [detail?.quote_type === BondQuoteType.Yield ? 'yield' : 'clean_price']: updateInfo?.price
      }
    };

    const bidIsValid = side === Side.SideBid;
    const ofrIsValid = side === Side.SideOfr;

    const calcPriceQueryVars = [{ bond: bond_info, quoteParams, bidIsValid, ofrIsValid }];
    const [, reminders] = await checkQuoteReminder({ productType, calcPriceQueryVars, remind: false });

    const [reminder] = reminders;
    const inverted = !!reminder[side]?.invertedInfo?.inverted;

    updateInfo.flag_inverted = inverted;
    // --- 倒挂检查 end ---

    // --- 乐观更新 start ---

    const updated = updateMessageDetails({
      message,
      changer: item => {
        if (item.detail_id === updateInfo.detail_id) return updateInfo;
        return item;
      }
    });

    // optimisticUpdate(updated);

    // --- 乐观更新 end ---

    await mulUpdateBondQuoteDraftDetail({
      detail_list: [{ ...upsert, detail_id: detail.detail_id, flag_inverted: inverted }]
    });
  };

  const ignore = async (
    message = selectedMessage?.original,
    targetIds = new Set(
      selectedDetails
        .filter(detail => isPendingStatus(detail?.status))
        .map(detail => detail?.detail_id)
        .filter(Boolean) ?? []
    )
  ) => {
    if (!operable) return;

    const { message_id } = message ?? {};

    if (!targetIds?.size || !message || !message_id) {
      MessageUtils.error('未选中可编辑数据！');
      return;
    }

    // 如果不是全选忽略全部详情，需要提示他人编辑中
    if (targetIds?.size !== message?.detail_list?.filter(detail => isPendingStatus(detail?.status))?.length) {
      checkUtils.checkOtherProcessing({ message });
    }

    updateKeepingTimestamp();

    await mulIgnoreBondQuoteDraft({
      ignore_type: QuoteDraftIgnoreType.QuoteDraftIgnoreTypeIDList,
      creator_id_list: followingBrokerIds,
      detail_id_list: [...targetIds],
      request_time: Date.now().toString()
    });
  };

  return {
    disabled,

    copy,
    confirmMessage,
    showEditModal,
    showEditInput,
    edit,
    ignore
  };
};
