import { OmsAccessCodeSuffix } from '@/common/types/access';
import AccountSafe from '@/components/AccountSafe';
import { ScrollMenuIDType } from '@/components/ScrollMenu/types';
import Shortcut from '@/components/ShortCut';
import QuoteSettings, { quoteSettingsList, showSettingsList } from './components/QuoteSettings';
import Setting from './components/Setting';
import { TradeSettings } from './components/TradeSettings';

export const defaultOptions = [
  {
    id: ScrollMenuIDType.AccountSafe,
    label: '账户与安全',
    item: <AccountSafe />,
    accessCodes: [OmsAccessCodeSuffix.System]
  },
  {
    id: ScrollMenuIDType.QuoteSettings,
    label: '报价操作',
    item: (
      <QuoteSettings
        title="报价操作"
        list={quoteSettingsList}
      />
    ),
    accessCodes: [OmsAccessCodeSuffix.MktQuote]
  },
  {
    id: ScrollMenuIDType.ShowSettings,
    label: '行情展示',
    item: (
      <QuoteSettings
        title="行情展示"
        list={showSettingsList}
      />
    ),
    accessCodes: [OmsAccessCodeSuffix.MktPage]
  },
  {
    id: ScrollMenuIDType.TradeSettings,
    label: '成交设置',
    item: <TradeSettings />,
    accessCodes: [OmsAccessCodeSuffix.SpotPricingMenu, OmsAccessCodeSuffix.SettingAssign]
  },
  {
    id: ScrollMenuIDType.ShortCut,
    label: '快捷键',
    item: <Shortcut />,
    accessCodes: [
      OmsAccessCodeSuffix.MktPage,
      OmsAccessCodeSuffix.MktQuote,
      OmsAccessCodeSuffix.CalMenu,
      OmsAccessCodeSuffix.SpotPricingMenu
    ]
  },
  {
    id: ScrollMenuIDType.SystemManage,
    label: '系统管理',
    item: <Setting />,
    accessCodes: [OmsAccessCodeSuffix.System]
  }
];
