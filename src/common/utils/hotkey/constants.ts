import { UserHotkeyFunction } from '@fepkg/services/types/bds-enum';

export const NCDP_HOTKEY_KEY_LIST = [
  UserHotkeyFunction.UserHotkeyOpenQuoteWindow,
  UserHotkeyFunction.UserHotkeyInternalConversion,
  UserHotkeyFunction.UserHotkeyShowAll
].map(String);
