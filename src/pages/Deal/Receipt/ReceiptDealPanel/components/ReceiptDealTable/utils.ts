import moment, { Moment } from 'moment';
import { ReceiptDealChildRowData, ReceiptDealParentRowData } from './types';

export const isBridgeParentData = (
  rowData: ReceiptDealParentRowData | ReceiptDealChildRowData
): rowData is ReceiptDealParentRowData => {
  return rowData.type === 'parent';
};

export const checkOnOrBeforeFirstWeekdayOfMonth = (firstWorkdayOfMonth: Moment) => {
  const today = moment().startOf('day');
  return today.isSameOrBefore(firstWorkdayOfMonth);
};
