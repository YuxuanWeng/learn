import { ReactNode } from 'react';
import { checkNCDJustNCDP } from '@fepkg/business/utils/product';
import { registeredHotkeys } from '@fepkg/common/utils/hotkey/register';
import { Caption } from '@fepkg/components/Caption';
import { Tooltip } from '@fepkg/components/Tooltip';
import { IconInfo } from '@fepkg/icon-park-react';
import { AccessCode } from '@fepkg/services/access-code';
import { ProductType } from '@fepkg/services/types/enum';
import { OmsAccessCodeSuffix } from '@/common/types/access';
import { getOmsAccessCodeEnum } from '@/common/utils/access';
import {
  calculatorShortcuts,
  dealShortcuts,
  funcSettingsShortcuts,
  quoteSettingsShortcuts,
  remarkSettingsShortcuts
} from '@/common/utils/hotkey';
import { checkHotkeyByProductType } from '@/common/utils/hotkey/utils';
import { EShortCutType, ShortCutAction, ShortCutState } from './type';

export const titleMap: {
  [k in EShortCutType]?: ReactNode;
} = {
  [EShortCutType.ProductPanel]: (
    <div className="flex items-center gap-x-2">
      <Caption>
        <span className="select-none text-sm font-bold">行情面板快捷键</span>
      </Caption>
      <Tooltip
        placement="right"
        content="仅支持F1-F12单独设置为快捷键，其他按键请组合设置（最多3键）"
      >
        <IconInfo className="text-gray-100 hover:text-primary-100" />
      </Tooltip>
    </div>
  ),
  [EShortCutType.Func]: (
    <div className="flex items-center gap-x-2">
      <Caption type="orange">
        <span className="select-none text-sm font-bold">功能快捷键</span>
      </Caption>
    </div>
  ),
  [EShortCutType.SettlementType]: (
    <div className="flex items-center gap-x-2">
      <Caption type="secondary">
        <span className="select-none text-sm font-bold">结算方式快捷键</span>
      </Caption>
    </div>
  ),
  [EShortCutType.DealPanel]: (
    <div className="flex items-center gap-x-2">
      <Caption>
        <span className="select-none text-sm font-bold">成交面板快捷键</span>
      </Caption>
    </div>
  )
};

export const initState = {
  [EShortCutType.ProductPanel]: [...quoteSettingsShortcuts, ...remarkSettingsShortcuts].map(h => ({
    function: h,
    value: registeredHotkeys[h],
    desc: ''
  })),
  [EShortCutType.Func]: funcSettingsShortcuts.map(h => ({ function: h, value: registeredHotkeys[h], desc: '' })),
  [EShortCutType.SettlementType]: calculatorShortcuts.map(h => ({
    function: h,
    value: registeredHotkeys[h],
    desc: ''
  })),
  [EShortCutType.DealPanel]: dealShortcuts.map(h => ({
    function: h,
    value: registeredHotkeys[h],
    desc: ''
  }))
};

const DealPanelProductSet = new Set([ProductType.BNC]); // 只有利率台子上成交快捷键

export const initShortcuts = (initShortcutsState: ShortCutState, access: Set<AccessCode>, productType: ProductType) => {
  const { ProductPanel, SettlementType, Func, DealPanel } = initShortcutsState;
  // 存单台子但没有二级权限
  const isNCDAndJustNCDP = checkNCDJustNCDP(productType);

  // 根据权限与业务台子需求过滤所需的快捷键
  const accessProductPanel = (ProductPanel ?? []).filter(i =>
    checkHotkeyByProductType(i.function, access, productType)
  );
  const accessFunc = (Func ?? []).filter(i => checkHotkeyByProductType(i.function, access, productType));

  // 根据权限与业务台子需求判断是否展示该功能
  const hasProductPanel = access.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.MktQuote)); // 有权限时展示
  const hasSettlementType =
    access.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.MktQuote)) && !isNCDAndJustNCDP; // 有权限时且不是存单台子但没有二级权限时展示
  const hasDealPanel =
    access.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.SpotPricingMenu)) &&
    DealPanelProductSet.has(productType);

  const result: ShortCutState = {
    ProductPanel: hasProductPanel ? accessProductPanel : undefined,
    SettlementType: hasSettlementType ? SettlementType : undefined,
    Func: accessFunc,
    DealPanel: hasDealPanel ? DealPanel : undefined
  };

  return result;
};

export const reducer = (state: ShortCutState, action: ShortCutAction) => {
  return {
    ...state,
    [action.type]: action.payload
  };
};
