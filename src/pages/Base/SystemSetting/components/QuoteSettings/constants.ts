import { UserSettingFunction } from '@fepkg/services/types/enum';

export const DefaultOptimalQuoteDisplayAmount = { internal: false, external: true } as const; // 暗盘默认不开启, 明盘默认开启

// 报价修改设置
export const changeQuoteSettingsTypes = [
  UserSettingFunction.UserSettingQuoteShortcutWaitTime,
  UserSettingFunction.UserSettingAmountShortcutWaitTime
] as const;

// 报价面板设置
export const quotePanelSettingsTypes = [
  UserSettingFunction.UserSettingCreditGroup,
  UserSettingFunction.UserSettingQuoteAmount,
  UserSettingFunction.UserSettingQuoteAutoAddStar,
  UserSettingFunction.UserSettingQuoteImportQMGroup,
  UserSettingFunction.UserSettingRateGroup,
  UserSettingFunction.UserSettingValuationDecimalDigit,
  UserSettingFunction.UserSettingQuoteParsingDefaultFlagStar,
  UserSettingFunction.UserSettingBatchParsingDefaultFlagStar
] as const;

// 协同报价设置
export const collaborativeSettingsTypes = [UserSettingFunction.UserSettingCoQuoteVolume] as const;

// 复制设置
export const copySettingsTypes = [
  UserSettingFunction.UserSettingIncludeDuration,
  UserSettingFunction.UserSettingIncludeIssueAmount,
  UserSettingFunction.UserSettingIncludeMaturityDate,
  UserSettingFunction.UserSettingIncludeValuation,
  UserSettingFunction.UserSettingOptimalQuoteCopyMethod,
  UserSettingFunction.UserSettingSortByTerm
] as const;

// 报价显示设置
export const quoteDisplaySettingsTypes = [
  UserSettingFunction.UserSettingDisplaySetting,
  UserSettingFunction.UserSettingInitSearchBond,
  UserSettingFunction.UserSettingLocationDisplay,
  UserSettingFunction.UserSettingTeamCollaboration,
  UserSettingFunction.UserSettingOptimalQuoteDisplayAmount
] as const;

// 报价审核经纪人分组设置
export const quoteDraftGroupSettingsTypes = [
  UserSettingFunction.UserSettingQuoteDraftBrokerGroups,
  UserSettingFunction.UserSettingQuoteDraftCurrentBrokerGroup
] as const;
