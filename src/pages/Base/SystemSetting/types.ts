import { OmsAccessCodeSuffix } from '@/common/types/access';
import { ScrollMenuItem } from '@/components/ScrollMenu/types';

export type SettingMenuItem = ScrollMenuItem & {
  accessCodes: OmsAccessCodeSuffix[];
};
