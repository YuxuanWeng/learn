import { FCWithChildren } from '@fepkg/common/types';
import { Aside } from './Aside';
import { Header } from './Header';
import { SettingLayout as BasicSettingLayout } from './SettingLayout';
import { SettingLayoutProps } from './types';

const SettingLayout = BasicSettingLayout as FCWithChildren<SettingLayoutProps.Layout> & {
  Aside: typeof Aside;
  Header: typeof Header;
};

SettingLayout.Aside = Aside;
SettingLayout.Header = Header;

export { SettingLayout };
export { type SettingLayoutProps } from './types';
