import { ProductType } from '@fepkg/services/types/bdm-enum';
import type { DealOperationLogSearch } from '@fepkg/services/types/deal/operation-log-search';
import { DialogEvent } from 'app/types/IPCEvents';
import { CommonRoute, WindowName } from 'app/types/window-v2';
import { CreateDialogParams } from 'app/windows/models/base';
import { BrowserWindowConstructorOptions } from 'electron';
import { omit } from 'lodash-es';
import { SpotModalProps } from '@/components/IDCSpot/types';
import { ISpotAppointProps, calcSpotDialogHeight, getSpotAppointKey, getSpotId } from '@/components/IDCSpot/utils';
import { IQuoteDialogOption } from '@/components/Quote/types';
import { CustomOpenColumnSettingDef } from '../types';

export const IDCMainBrowserWindowParams = {
  resizable: true,
  minHeight: 432,
  minWidth: 620
  // modal: true
};

export const getIDCMainDialogConfig = (
  productType: ProductType,
  internalCode?: string
): Omit<CreateDialogParams, 'category'> => ({
  name: WindowName.BNCIdcHome,
  custom: {
    route: CommonRoute.SpotPanel,
    routePathParams: internalCode ? [productType.toString(), internalCode] : [productType.toString()],
    isFullScreen: true
  },
  options: { width: 1920, height: 1080, ...IDCMainBrowserWindowParams }
});

export const getIDCDealDetailConfig = (productType: ProductType): Omit<CreateDialogParams, 'category'> => ({
  name: WindowName.DealDetail,
  custom: { route: CommonRoute.DealDetail, routePathParams: [productType.toString()], isFullScreen: false },
  options: { width: 1400, height: 800, resizable: true, minWidth: 1400, minHeight: 800 }
});

export const getIDCBridgeConfig = (
  productType: ProductType,
  bridgeInstId?: string
): Omit<CreateDialogParams, 'category'> => ({
  name: WindowName.Bridge,
  custom: {
    route: CommonRoute.Bridge,
    routePathParams: [productType.toString()],
    isFullScreen: false,
    context: { bridgeInstId }
  },
  options: { width: 1400, height: 800, resizable: true, minWidth: 1400, minHeight: 800 }
});

export const closeIDCMain = async () => {
  await window.Main.invoke(DialogEvent.CloseByName, WindowName.BNCIdcHome);
};

export type IOperContext = Pick<DealOperationLogSearch.Request, 'deal_id'> & {
  pageSize?: number;
  customCols?: CustomOpenColumnSettingDef[];
  /** 窗口打开时间戳 */
  timestamp?: number;
};
export interface IOperRecord extends IQuoteDialogOption, IOperContext {}
export const getOperRecordDialogConfig = (productType: ProductType, option: IOperRecord) => {
  const context: IOperContext = {
    ...omit(option, 'onSuccess', 'onCancel')
  };
  const normalSize = {
    width: 1620,
    height: 806
  };
  const options: BrowserWindowConstructorOptions = {
    resizable: true,
    maxWidth: 2860,
    maxHeight: 806,
    minWidth: 1000,
    minHeight: 720
  };
  // if (option.bridge_id) {
  //   normalSize = {
  //     width: 538,
  //     height: 446
  //   };
  //   options = {
  //     resizable: false
  //   };
  //   context.pageSize = 10;
  //   context.customCols = [
  //     {
  //       key: 'create_time',
  //       width: 160,
  //       align: ColumnAlign.LEFT
  //     },
  //     {
  //       key: 'operator',
  //       width: 120,
  //       align: ColumnAlign.CENTER
  //     },
  //     {
  //       key: 'operation_type',
  //       align: ColumnAlign.CENTER,
  //       width: 200
  //     }
  //   ];
  // }
  return {
    name: 'idcOperRecordDialog',
    custom: { context, route: CommonRoute.SpotOperRecord, routePathParams: [productType.toString()] },
    options: { ...normalSize, ...options }
  };
};

export interface ISpotDialog extends IQuoteDialogOption, SpotModalProps {
  dialogId?: string;
  /** 窗口打开时间戳 */
  timestamp?: number;
}
export const getSpotDialogConfig = (productType: ProductType, option: ISpotDialog) => {
  const name = WindowName.IdcSpot;
  const listLng = Math.min(option.quoteList.length, 10);
  const context = {
    ...omit(option, 'onSuccess', 'onCancel'),
    dialogId: getSpotId(option)
  };
  const height = calcSpotDialogHeight(listLng);
  return {
    config: {
      name,
      custom: { route: CommonRoute.SpotModal, routePathParams: [productType.toString()], context, isTop: true },
      options: { width: 554, height, resizable: false },

      instantMessaging: true
    },
    callback: {
      onSuccess: () => option.onSuccess?.(),
      onCancel: () => option.onCancel?.(),
      onError: () => option.onCancel?.()
    }
  };
};

export const getSpotAppointDialogConfig = (option: ISpotAppointProps) => {
  const name = WindowName.IdcAppointSpot;
  const context = {
    ...omit(option, 'onSuccess', 'onCancel'),
    dialogId: getSpotAppointKey(option)
  };
  return {
    config: {
      name,
      custom: { route: CommonRoute.SpotAppointModal, context, isTop: true },
      options: { width: 552, height: 393, resizable: false },
      instantMessaging: true
    },
    callback: {
      onSuccess: () => option.onSuccess?.(),
      onCancel: () => option.onCancel?.(),
      onError: () => option.onCancel?.()
    }
  };
};
