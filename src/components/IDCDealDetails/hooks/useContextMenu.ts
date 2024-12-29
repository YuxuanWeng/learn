import { MouseEventHandler, useMemo, useState } from 'react';
import { getInstName } from '@fepkg/business/utils/get-name';
import { ModalUtils } from '@fepkg/components/Modal';
import { useMemoizedFn } from 'ahooks';
import { useDialogWindow } from '@/common/hooks/useDialog';
import { dealDiffMarkRead } from '@/common/services/api/deal/diff-mark-read';
import { ReceiverState, RecordContextMenuItem } from '@/components/IDCHistory/types';
import { useProductParams } from '@/layouts/Home/hooks';
import { miscStorage } from '@/localdb/miscStorage';
import { getDealDetailLogConfig } from '@/pages/Deal/DealDetailLog/utils';
import { useDealPanel } from '@/pages/Deal/Detail/provider';
import { checkDealsShowAddBridge } from '@/pages/Deal/Detail/utils';
import { useOpenReceiptDealPanel } from '@/pages/Deal/Receipt/ReceiptDealPanel/hooks/useOpenReceiptDealPanel';
import { dealDetailSendOrder } from '@/pages/Spot/Panel/DealRecord/utils/contextualOperation';
import { useOpenSpotPanel } from '@/pages/Spot/Panel/hooks/useOpenSpotPanel';
import { getBridgeNumber } from '@/pages/Spot/utils/bridge';
import { useFilter } from '../SearchFilter/providers/FilterStateProvider';
import { ContextMenuEnum } from '../type';
import { findDirectBridgeDeal, getDisplayItemData, getUrgeUsers, isDealNotHandOver } from '../utils';

const showWarnModal = (msg: string) => {
  ModalUtils.warning({ theme: 'light', title: msg, titleSize: 'sm', okText: '关闭', showCancel: false });
};

/**
 * 封装右键菜单的相关逻辑
 */
export const useContextMenu = (onItemClick?: (item: ContextMenuEnum) => void) => {
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const { accessCache } = useDealPanel();
  const { selectedDeals, getShowConfigByDeals, selectBridgeId, isNCD } = useFilter();
  const selectedLength = selectedDeals.length;
  const { openDialog } = useDialogWindow();
  const { productType } = useProductParams();

  const openReceiptDealPanel = useOpenReceiptDealPanel();
  const openSpotPanel = useOpenSpotPanel();

  const normalDisplayItemList = () => {
    return selectedDeals.map(item => getDisplayItemData(item, getShowConfigByDeals(selectedDeals), false, isNCD));
  };

  const withBrokerCopy = () => {
    let str = '';
    for (const item of normalDisplayItemList()) {
      str += `${item.internalCode || ''} ${item.ofrBrokerFull}${item.bidBrokerFull} `;
      str += `${item.index}) ${item.fieldList.join(' ')}`;
      str += '\n';
    }
    window.Main.copy(str);
  };

  const withInternalCodeCopy = () => {
    let str = '';
    for (const item of normalDisplayItemList()) {
      str += `${item.internalCode || ''} `;
      str += `${item.index}) ${item.fieldList.join(' ')}`;
      str += '\n';
    }
    window.Main.copy(str);
  };

  const withTraderCopy = () => {
    const displayItemList = selectedDeals.map(item =>
      getDisplayItemData(item, getShowConfigByDeals(selectedDeals), true, isNCD)
    );
    let str = '';
    for (const item of displayItemList) {
      str += `${item.index}) ${item.fieldList.join(' ')}`;
      str += '\n';
    }
    window.Main.copy(str);
  };

  /** 隐藏对手方复制 */
  const hideOtherCopy = async () => {
    const displayItemList = selectedDeals.map(item => {
      const targetDeal = findDirectBridgeDeal(item);
      if (targetDeal) {
        return getDisplayItemData(item, getShowConfigByDeals(selectedDeals), false, isNCD, targetDeal);
      }
      return getDisplayItemData(item, getShowConfigByDeals(selectedDeals), false, isNCD);
    });
    let str = '';
    for (const item of displayItemList) {
      str += `${item.index}) ${item.fieldList.join(' ')}`;
      str += '\n';
    }
    window.Main.copy(str);
  };

  /** 催单逻辑 */
  const sendOrder = async (defaultValue?: ReceiverState) => {
    if (!selectedDeals?.length) return;
    const dealItem = selectedDeals[0];
    const isAddBridgeUser = defaultValue?.isAddBridgeUser;
    dealDetailSendOrder(dealItem, getShowConfigByDeals(selectedDeals), isNCD, {
      receiverName: (defaultValue?.name ?? '') + (isAddBridgeUser ? '(加桥用户)' : '(对手方)'),
      receiverQQ: defaultValue?.qq
    });
  };

  const contextMenuOptions = useMemo(() => {
    let singleContextMenuOptions: RecordContextMenuItem<ReceiverState>[] = [];
    let mulContextMenuOptions: RecordContextMenuItem<ReceiverState>[] = [];

    const copyOptions = [
      { key: ContextMenuEnum.WithBrokerCopy, label: '带broker复制' },
      { key: ContextMenuEnum.WithInternalCodeCopy, label: '带内码复制' },
      { key: ContextMenuEnum.HideOtherCopy, label: '隐藏对手方复制' },
      { key: ContextMenuEnum.WithTraderCopy, label: '带交易员复制' }
    ];

    const addBridgeOption = { key: ContextMenuEnum.AddBridge, label: '加桥', disabled: !accessCache.bridgeEdit };

    singleContextMenuOptions = [...copyOptions];
    mulContextMenuOptions = [...copyOptions];

    // 过桥部分
    if (checkDealsShowAddBridge(selectedDeals)) {
      singleContextMenuOptions.push(addBridgeOption);
      mulContextMenuOptions.push(addBridgeOption);
    }
    if (selectedLength === 1) {
      // const hasNotSubmitted = isDealNotSubmitted(selectedDeals[0]);

      if (getBridgeNumber(selectedDeals[0].details) === 1) {
        // 2.12 未提交过的成交单，放开「换桥」、「删桥」的限制
        // https://shihetech.feishu.cn/wiki/F6emwg9iXiMhKHkFDrmcSVCpnCb#part-CdK8d0GOMouS0QxRpdiccEkYnIy
        singleContextMenuOptions.push(
          {
            key: ContextMenuEnum.ChangeBridge,
            selectId: selectedDeals[0].details?.[0].ofr_trade_info.inst?.inst_id || '',
            label: '换桥',
            disabled: !accessCache.bridgeEdit
          },
          {
            key: ContextMenuEnum.DeleteBridge,
            selectId: selectedDeals[0].details?.[0].ofr_trade_info.inst?.inst_id || '',
            label: '删桥',
            disabled: !accessCache.bridgeEdit
          }
        );
      } else if (getBridgeNumber(selectedDeals[0].details) >= 2) {
        const subContextMenuItem = selectedDeals[0].details?.slice(0, -1).map((item, index) => {
          const bridgeId = item.ofr_trade_info.inst?.inst_id || '';
          const bridgeName = getInstName({ inst: item.ofr_trade_info.inst, productType });
          const traderName = item.ofr_trade_info.trader?.name_zh || '';
          let prefix = '';
          if (index === 0) prefix = 'Bid桥-';
          if (index + 2 === selectedDeals[0].details?.length) prefix = 'Ofr桥-';
          return {
            key: bridgeId,
            selectId: bridgeId,
            label: `${prefix}${bridgeName}(${traderName})`,
            disabled: !accessCache.bridgeEdit
          };
        });

        // 2.12 未提交过的成交单，放开「换桥」、「删桥」的限制
        // https://shihetech.feishu.cn/wiki/F6emwg9iXiMhKHkFDrmcSVCpnCb#part-CdK8d0GOMouS0QxRpdiccEkYnIy
        singleContextMenuOptions.push(
          {
            key: ContextMenuEnum.ChangeBridge,
            label: '换桥',
            disabled: !accessCache.bridgeEdit,
            subContextMenuItem
          },
          {
            key: ContextMenuEnum.DeleteBridge,
            label: '删桥',
            disabled: !accessCache.bridgeEdit,
            subContextMenuItem
          }
        );
      }

      singleContextMenuOptions.push({
        key: ContextMenuEnum.DealEdit,
        label: '成交跳转'
      });

      const { sendInfo, isAddBridgeUser } = getUrgeUsers(selectedDeals[0]);
      for (const v of sendInfo) {
        singleContextMenuOptions.push({
          key: `${ContextMenuEnum.SendMsg}_${JSON.stringify(v.name)}`,
          label: `催单-${v.name}${isAddBridgeUser ? '(加桥用户)' : '(对手方)'}`,
          type: 'urge',
          value: { ...v, isAddBridgeUser },
          disabled: !accessCache.buzz
        });
      }

      if (accessCache.sendEdit && selectedLength === 1) {
        // 仅本人成交区有发单信息编辑
        const deal = selectedDeals[0];
        const myArea = deal.broker.user_id === miscStorage.userInfo?.user_id;
        if (myArea) {
          singleContextMenuOptions.push({
            key: ContextMenuEnum.ModifySendMessage,
            label: '发单信息编辑'
          });
        }
      }

      if (accessCache.log) {
        singleContextMenuOptions.push({
          key: ContextMenuEnum.OperateLog,
          label: '操作日志'
        });
      }
    }

    let arr: RecordContextMenuItem<ReceiverState>[] = [];
    if (selectedLength === 1) {
      arr = singleContextMenuOptions;
    } else if (selectedLength > 1) {
      arr = mulContextMenuOptions;
    }
    return arr;
  }, [
    accessCache.bridgeEdit,
    accessCache.buzz,
    accessCache.log,
    accessCache.sendEdit,
    productType,
    selectedDeals,
    selectedLength
  ]);

  const openOperateLog = () => {
    const dealId = selectedDeals[0].parent_deal.parent_deal_id ?? '';
    openDialog(getDealDetailLogConfig(productType, dealId));
  };

  const sendToOtherPage = async () => {
    const deal = selectedDeals[0];
    // 未移交情况下跳转到成交记录，否则跳转到成交单
    if (isDealNotHandOver(deal)) {
      openSpotPanel(deal.parent_deal.internal_code);
    } else {
      openReceiptDealPanel(deal.parent_deal.internal_code);
    }
  };

  // 选中右键菜单回调
  const handleCheckedContextOption = useMemoizedFn((val: RecordContextMenuItem<ReceiverState>) => {
    if (val.key.toString().startsWith(ContextMenuEnum.SendMsg)) {
      dealDiffMarkRead({ deal_id_list: selectedDeals.map(v => v.parent_deal.parent_deal_id ?? '').filter(Boolean) });
      sendOrder(val.value);
      return;
    }
    switch (val.key) {
      case ContextMenuEnum.WithBrokerCopy:
        withBrokerCopy();
        break;
      case ContextMenuEnum.WithInternalCodeCopy:
        withInternalCodeCopy();
        break;
      case ContextMenuEnum.HideOtherCopy:
        hideOtherCopy();
        break;
      case ContextMenuEnum.WithTraderCopy:
        withTraderCopy();
        break;
      case ContextMenuEnum.ChangeBridge:
        selectBridgeId.current = val.selectId;
        onItemClick?.(ContextMenuEnum.ChangeBridge);
        break;
      case ContextMenuEnum.AddBridge:
        onItemClick?.(ContextMenuEnum.AddBridge);
        break;
      case ContextMenuEnum.DeleteBridge:
        selectBridgeId.current = val.selectId;
        onItemClick?.(ContextMenuEnum.DeleteBridge);
        break;
      case ContextMenuEnum.ModifySendMessage:
        onItemClick?.(ContextMenuEnum.ModifySendMessage);
        break;
      case ContextMenuEnum.DealEdit:
        sendToOtherPage();
        break;
      case ContextMenuEnum.OperateLog:
        openOperateLog();
        break;
      default:
    }
  });

  const handleContextMenu: MouseEventHandler<HTMLElement> = evt => {
    evt.preventDefault();
    setContextMenuVisible(true);
  };

  return {
    contextMenuOptions,
    contextMenuVisible,

    showWarnModal,
    handleContextMenu,
    setContextMenuVisible,
    handleCheckedContextOption
  };
};
