import { useContext } from 'react';
import { DialogContext } from '@/layouts/Dialog/Layout';
import { MarketDealDialogContext } from '../types';

/** 获取外部传入市场成交对话框的上下文入参 */
export const useMarketDealFormParams = () => useContext<MarketDealDialogContext>(DialogContext);
