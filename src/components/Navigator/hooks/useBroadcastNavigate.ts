import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProductType } from '@fepkg/services/types/enum';
import { BroadcastChannelEnum } from 'app/types/broad-cast';
import { CommonRoute } from 'app/types/window-v2';
import { useSetAtom } from 'jotai';
import { useNavigatorCheckedId } from '@/layouts/Home/atoms';
import { pageInitialedAtom } from '@/layouts/Home/atoms/page-initialed';
import { NavigatorItemId } from '../types';

export const useBroadcastNavigate = (targetProductType: ProductType) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [checkedId, setCheckedId] = useNavigatorCheckedId();
  const setPageInitialed = useSetAtom(pageInitialedAtom);

  // 接收到跳转成交单广播（明细跳转成交单）
  useEffect(() => {
    const off = window.Broadcast.on(BroadcastChannelEnum.BROADCAST_SWITCH_RECEIPT_DEAL, code => {
      // 如果当前不在成交单页面，需要把 page initialed 重置
      if (!location.pathname.includes(CommonRoute.HomeReceiptDealPanel)) {
        setPageInitialed(false);
      }

      let path = `${CommonRoute.HomeReceiptDealPanel}/${targetProductType}`;
      if (code) path += `/${code}/${Date.now()}`;

      navigate(path);
      setCheckedId(NavigatorItemId.ReceiptDeal);
    });

    return () => {
      off();
    };
  }, [location, checkedId, navigate, setCheckedId, setPageInitialed, targetProductType]);
};
