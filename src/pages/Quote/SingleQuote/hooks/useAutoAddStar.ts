import { useLayoutEffect } from 'react';
import { Side, UserSettingFunction } from '@fepkg/services/types/enum';
import { Updater } from 'use-immer';
import { QuoteSettingsType } from '@/components/Quote/types';
import { QuoteFlags } from '../QuoteOper/types';
import { QuoteActionMode } from '../types';

const useAutoAddStar = (
  setting: QuoteSettingsType,
  mode = QuoteActionMode.ADD,
  setFlags?: Updater<{ [Side.SideBid]?: QuoteFlags; [Side.SideOfr]?: QuoteFlags }>,
  defaultStar?: number,
  disabled?: { [Side.SideBid]?: boolean; [Side.SideOfr]?: boolean }
) => {
  const auto = setting.get(UserSettingFunction.UserSettingQuoteAutoAddStar) ? 1 : 0;
  const autoAddStar = [QuoteActionMode.ADD, QuoteActionMode.JOIN, QuoteActionMode.CTX_MENU_JOIN].includes(mode)
    ? auto
    : defaultStar;

  useLayoutEffect(() => {
    setFlags?.(draft => {
      if (!disabled?.[Side.SideBid]) draft[Side.SideBid] = { ...draft[Side.SideBid], flag_star: autoAddStar };
      if (!disabled?.[Side.SideOfr]) draft[Side.SideOfr] = { ...draft[Side.SideOfr], flag_star: autoAddStar };
    });
  }, [autoAddStar, setFlags]);
};

export default useAutoAddStar;
