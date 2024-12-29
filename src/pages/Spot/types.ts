import { ReactNode } from 'react';
import { message } from '@fepkg/components/Message';
import { ColumnSettingDef } from '@fepkg/components/Table';
import { handleRequestError } from '@fepkg/request/utils';
import { CellContext } from '@tanstack/react-table';

export type ColumnSettingsKeysType<T> = keyof T;

export enum ColumnAlign {
  LEFT,
  RIGHT,
  CENTER
}

export type CellRender<T> = (info: CellContext<T, unknown>) => ReactNode;

export type ColSettingDef<T> = ColumnSettingDef<ColumnSettingsKeysType<T>> & {
  align?: ColumnAlign;
  cellRender?: CellRender<T>;
};

export type CustomOpenColumnSettingDef = {
  key: string;
  width?: number;
  align?: ColumnAlign;
};

export enum BondTabs {
  BondTab1 = 'bond_tab_1',
  BondTab2 = 'bond_tab_2',
  BondTab3 = 'bond_tab_3'
}

export enum IDCSpotStatusCode {
  DealUnreferQuoteError = 24060
}

const errorMsgMap = {
  [IDCSpotStatusCode.DealUnreferQuoteError]: '报价被修改，不支持反挂！'
};

export const idcSpotToastRequestError = error => {
  handleRequestError({
    error,
    onMessage: (msg, code) => {
      message.error(errorMsgMap[code ?? ''] ?? msg);
    },
    defaultHandler: () => {
      message.error('请求错误');
    }
  });
};
