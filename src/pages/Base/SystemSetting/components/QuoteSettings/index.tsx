import { isNCD } from '@fepkg/business/utils/product';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { useProductParams } from '@/layouts/Home/hooks';
import ChangeQuoteSettings from './components/ChangeQuoteSettings';
import CollaborativeQuoteSettings from './components/CollaborativeQuoteSettings';
import CopySettings from './components/CopySettings';
import QuoteDisplaySettings from './components/QuoteDisplaySettings';
import QuotePanelSettings from './components/QuotePanelSettings';
import {
  changeQuoteSettingsTypes,
  collaborativeSettingsTypes,
  copySettingsTypes,
  quoteDisplaySettingsTypes,
  quotePanelSettingsTypes
} from './constants';
import { useUserSettingInitData } from './hooks/useUserSettingInitData';
import { IUserSettingValue } from './types';
import { generateSettingsData, saveUserSettingsByProductType } from './utils';

export const quoteSettingsList = [
  {
    name: 'changeQuoteSettings', // 报价操作->报价修改设置的数据
    types: changeQuoteSettingsTypes,
    Component: ChangeQuoteSettings
  },
  {
    name: 'quotePanelSettings', // 报价操作->报价面板设置的数据
    types: quotePanelSettingsTypes,
    Component: QuotePanelSettings
  },
  {
    name: 'collaborativeQuoteSettings', // 报价操作->协同报价设置的数据
    types: collaborativeSettingsTypes,
    Component: CollaborativeQuoteSettings
  }
] as const;

export const showSettingsList = [
  {
    name: 'copySettings', // 行情展示->行情复制
    types: copySettingsTypes,
    Component: CopySettings
  },
  {
    name: 'quoteDisplaySettings', // 行情展示->报价展示
    types: quoteDisplaySettingsTypes,
    Component: QuoteDisplaySettings
  }
] as const;

const QuoteSettings: React.FC<{
  title: string;
  list: typeof quoteSettingsList | typeof showSettingsList;
}> = ({ title, list }) => {
  const { productType } = useProductParams();
  const { data, onChange } = useUserSettingInitData();

  const handleConfirm = async (val: IUserSettingValue) => {
    onChange(val);
    // NCD一二级共用一套用户配置
    if (isNCD(productType)) {
      await saveUserSettingsByProductType(val, [ProductType.NCD, ProductType.NCDP]);
    } else {
      await saveUserSettingsByProductType(val, [productType]);
    }
  };

  return (
    <>
      <header className="flex flex-col pt-6 mt-6 border-0 border-t border-gray-600 border-solid">
        <span className="flex-shrink-0 select-none text-md font-bold">{title}</span>
      </header>

      <div className="relative p-0">
        {list.map(({ Component, name, types }) => {
          const settingsData = generateSettingsData(types, data);
          return (
            <Component
              key={name}
              data={settingsData}
              onChange={handleConfirm}
            />
          );
        })}
      </div>
    </>
  );
};

export default QuoteSettings;
