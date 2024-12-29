import { useEffect, useState } from 'react';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { NavigatorItemId } from '@/components/Navigator/types';
import { useNavigatorCheckedIdValue } from '.';

export const pageInitialedAtom = atom(false);

// 页面是否初始化完成
export const usePageInitialed = () => {
  const setPageInitialed = useSetAtom(pageInitialedAtom);

  useEffect(() => {
    setPageInitialed(true);
  }, [setPageInitialed]);
};

// 用户设置的展示样式，需要等页面初始化完成后再关闭设置页
// 如果不这样设置，用户在导航栏点击「行情」->「设置」->「成交单」
// 页面就会闪烁「行情」的页面再跳转到「成交单」的页面（初步判定是 jotai 的设置状态比 router 的跳转要快，导致「设置」先隐藏了，但是路由还未跳转」
export const useSystemSettingDisplay = () => {
  const [displayCls, setDisplayCls] = useState('hidden');

  const pageInitialed = useAtomValue(pageInitialedAtom);
  const checkedId = useNavigatorCheckedIdValue();
  const isChecked = checkedId === NavigatorItemId.Setting;

  useEffect(() => {
    if (!isChecked) {
      if (pageInitialed) setDisplayCls('hidden');
    } else {
      setDisplayCls('flex');
    }
  }, [isChecked, pageInitialed]);

  return { isChecked, displayCls };
};
