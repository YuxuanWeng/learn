import { ElementRef, MouseEvent, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProductType } from '@fepkg/services/types/enum';
import useResizeObserver from '@react-hook/resize-observer';
import { DialogEvent } from 'app/types/IPCEvents';
import { CommonRoute } from 'app/types/window-v2';
import { useSetAtom } from 'jotai';
import { createContainer } from 'unstated-next';
import { useImmer } from 'use-immer';
import { useLocalStorage } from 'usehooks-ts';
import { LSKeys, getLSKey } from '@/common/constants/ls-keys';
import { useDialogWindow } from '@/common/hooks/useDialog';
import { useAccess } from '@/common/providers/AccessProvider';
import { useNavigatorCheckedId } from '@/layouts/Home/atoms';
import { pageInitialedAtom } from '@/layouts/Home/atoms/page-initialed';
import { useProductParams } from '@/layouts/Home/hooks';
import { useActiveProductType } from '@/layouts/Home/hooks/useActiveProductType';
import { getIQuoteDialogConfig } from '@/pages/Algo/IQuote/utils';
import { getCalculatorWindowConfig } from '@/pages/Base/Calculator/utils';
import { useOpenReceiptDealPanel } from '@/pages/Deal/Receipt/ReceiptDealPanel/hooks/useOpenReceiptDealPanel';
import { getReceiptDealPanelConfig } from '@/pages/Deal/Receipt/ReceiptDealPanel/utils';
import { getCollaborativeQuoteDialogConfig } from '@/pages/Quote/Collaborative/utils';
import { getIDCBridgeConfig, getIDCDealDetailConfig, getIDCMainDialogConfig } from '@/pages/Spot/utils/openDialog';
import { DEFAULT_NAVIGATOR_MENU, getNavigatorInfoMap } from '../constants';
import { useAccessChange } from '../hooks/useBroadcastAccess';
import { useBroadcastNavigate } from '../hooks/useBroadcastNavigate';
import { useNavigatorBadge } from '../hooks/useNavigatorBadge';
import {
  NavigatorContextMenuItemId,
  NavigatorContextMenuState,
  NavigatorItemId,
  NavigatorItemProps,
  NavigatorMenuItem
} from '../types';
import { getNavigatorMenu, openCRM, openReceiptDealApproval } from '../utils';

const NAVIGATOR_ITEM_HEIGHT = 64;
const NAVIGATOR_ITEM_GAP = 12;

const BOTTOM_CONTENT_HEIGHT = 60;

const getMaxVisibleItemsLen = (navHeight: number) => {
  return Math.floor((navHeight - BOTTOM_CONTENT_HEIGHT) / (NAVIGATOR_ITEM_HEIGHT + NAVIGATOR_ITEM_GAP)) - 1;
};

const NavigatorContainer = createContainer(() => {
  const { access } = useAccess();
  const location = useLocation();
  const navigate = useNavigate();
  const { openDialog } = useDialogWindow();
  const { productType, panelId } = useProductParams();
  const { activeProductType } = useActiveProductType() ?? {};
  const openReceiptDealPanel = useOpenReceiptDealPanel();

  // 如果当前的 productType 是 NCDP，需要转换为 NCD，因为 NCDP 没有能使用导航栏打开的功能
  let targetProductType = productType;
  if (productType === ProductType.NCDP) targetProductType = ProductType.NCD;

  const { openQuoteRemindDialog, getBadgeStatus } = useNavigatorBadge();

  const navRef = useRef<ElementRef<'nav'>>(null);
  const [remoteMenu, setRemoteMenu] = useLocalStorage<NavigatorMenuItem[]>(
    getLSKey(LSKeys.NavigationMenu, targetProductType),
    DEFAULT_NAVIGATOR_MENU
  );
  const [menu, setMenu] = useState(() => getNavigatorMenu(productType, remoteMenu, access));

  const [checkedId, setCheckedId] = useNavigatorCheckedId();
  const setPageInitialed = useSetAtom(pageInitialedAtom);

  const [visibleIdx, setVisibleIdx] = useState(menu.length);
  const [activeId, setActiveId] = useState<NavigatorItemId | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const [ctxMenuState, updateCtxMenuState] = useImmer<NavigatorContextMenuState>({
    targetId: undefined,
    open: false,
    position: { x: 0, y: 0 }
  });

  const navigatorInfoMap = useMemo(() => getNavigatorInfoMap(productType), [productType]);

  const navigators = useMemo(() => {
    const visible: NavigatorMenuItem[] = [];
    const invisible: NavigatorMenuItem[] = [];
    const fixed: NavigatorMenuItem[] = [];
    const all: NavigatorMenuItem[] = [];
    const keys: string[] = [];

    for (let i = 0, len = menu.length; i < len; i++) {
      const item = menu[i];
      item.label = navigatorInfoMap[item.id].label;
      item.checked = checkedId === item.id;
      item.badge = getBadgeStatus(item);

      if (item?.fixed) fixed.push(item);
      else if (i < visibleIdx) visible.push(item);
      else invisible.push(item);

      all.push(item);
      keys.push(item.id);
    }

    return { visible, invisible, fixed, all, keys };
  }, [menu, navigatorInfoMap, checkedId, getBadgeStatus, visibleIdx]);

  const activeInfo: { index: number; item?: NavigatorItemProps } = useMemo(() => {
    for (let i = 0, len = navigators.all.length; i < len; i++) {
      const item = navigators.all[i];
      if (activeId === item.id) {
        const horizontal = item?.fixed || navigators.invisible.some(n => n.id === item.id);
        return { index: i, item: { ...item, horizontal } };
      }
    }

    return { index: 0 };
  }, [navigators, activeId]);

  const handleItemClick = async (id: NavigatorItemId) => {
    setMoreOpen(false);

    switch (id) {
      case NavigatorItemId.Market:
        if (checkedId !== id) {
          setCheckedId(id);

          // 如果不是设置页，并且当前需要用 navigate 刷新行情看板页
          if (location.pathname.includes(CommonRoute.HomeReceiptDealPanel)) {
            navigate(`${CommonRoute.Home}/${activeProductType}`);
            setPageInitialed(false);
          }
        }
        break;
      case NavigatorItemId.Setting:
        if (checkedId !== id) setCheckedId(id);
        break;
      case NavigatorItemId.Calculator:
        openDialog(getCalculatorWindowConfig(targetProductType));
        break;
      case NavigatorItemId.QuoteReminder:
        openQuoteRemindDialog();
        break;
      case NavigatorItemId.CoordinatedQuotation:
        openDialog(getCollaborativeQuoteDialogConfig(targetProductType, panelId));
        break;
      case NavigatorItemId.IQuote:
        openDialog(getIQuoteDialogConfig(targetProductType)).finally(() => {
          // iquote关闭时关闭隶属于iquote的盘口悬浮窗
          window.Main.sendMessage(DialogEvent.IQuoteCardCloaseAll);
        });
        break;
      case NavigatorItemId.BNCTrade:
        openDialog(getIDCMainDialogConfig(targetProductType));
        break;
      case NavigatorItemId.CRM:
        openCRM();
        break;
      case NavigatorItemId.ReceiptDeal: {
        // 如果当前打开了设置，并且路由在成交单页面，只需切换 checked id
        if (checkedId === NavigatorItemId.Setting && location.pathname.includes(CommonRoute.HomeReceiptDealPanel)) {
          setCheckedId(id);
        } else if (checkedId !== id) {
          openReceiptDealPanel();
        }
        break;
      }
      case NavigatorItemId.TransactionDetails:
        openDialog(getIDCDealDetailConfig(targetProductType));
        break;
      case NavigatorItemId.Bridge:
        openDialog(getIDCBridgeConfig(targetProductType));
        break;
      case NavigatorItemId.ReceiptDealApproval:
        openReceiptDealApproval();
        break;
      default:
        break;
    }
  };

  const handleItemCtxMenu = (evt: MouseEvent<HTMLDivElement>, id: NavigatorItemId) => {
    updateCtxMenuState(draft => {
      draft.open = true;
      draft.position = { x: evt.clientX, y: evt.clientY };
      draft.targetId = id;
    });
  };

  const handleCtxMenuItemClick = (id: NavigatorContextMenuItemId) => {
    switch (id) {
      case NavigatorContextMenuItemId.ReceiptDealDialog:
        openDialog(getReceiptDealPanelConfig(targetProductType));

        // 若当前正在成交单，需要切换到行情
        if (checkedId === NavigatorItemId.ReceiptDeal) handleItemClick(NavigatorItemId.Market);
        break;
      default:
        break;
    }
  };

  const updateMenuItems = (items: NavigatorMenuItem[]) => {
    setMenu(items);
    setRemoteMenu(items);
  };

  // 权限变更
  useAccessChange(newAccess => {
    updateMenuItems(getNavigatorMenu(productType, menu, newAccess));
  });
  // 接收跳转广播
  useBroadcastNavigate(targetProductType);

  useResizeObserver(navRef, evt => {
    /** 导航菜单可容纳 NavigatorItem 的最大数量 */
    const maxVisibleItemsLen = getMaxVisibleItemsLen(evt.contentRect.height);

    setVisibleIdx(prev => {
      if (prev === maxVisibleItemsLen) return prev;

      const allItemsLen = navigators.all.length;
      if (maxVisibleItemsLen > allItemsLen) return allItemsLen;

      return maxVisibleItemsLen;
    });
    setMoreOpen(false);
  });

  return {
    navRef,
    navigators,
    navigatorInfoMap,
    checkedId,
    activeId,
    moreOpen,
    ctxMenuState,
    activeInfo,

    setActiveId,
    setMoreOpen,
    updateCtxMenuState,

    handleItemClick,
    handleItemCtxMenu,
    handleCtxMenuItemClick,

    updateMenuItems
  };
});

export const NavigatorProvider = NavigatorContainer.Provider;
export const useNavigator = NavigatorContainer.useContainer;
