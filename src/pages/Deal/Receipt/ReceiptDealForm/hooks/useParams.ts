import { useContext } from 'react';
import { DialogContext } from '@/layouts/Dialog/Layout';
import { ReceiptDealFormDialogContext } from '../types';

export const useReceiptDealFormParams = () => useContext<ReceiptDealFormDialogContext>(DialogContext);
