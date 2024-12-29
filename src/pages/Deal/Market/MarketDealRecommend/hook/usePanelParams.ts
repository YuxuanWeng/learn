import { useContext } from 'react';
import { DialogContext } from '@/layouts/Dialog/Layout';
import { MarketRecommendDialogContext, MarketRecommendSettingDialogContext } from '../types';

/** 获取外部传入市场成交悬浮窗的上下文入参 */
export const usePanelParams = () => useContext<MarketRecommendDialogContext>(DialogContext);

export const useSettingPanelParams = () => useContext<MarketRecommendSettingDialogContext>(DialogContext);
