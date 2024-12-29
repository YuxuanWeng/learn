import { CascaderOption } from '@fepkg/components/Cascader';
import { SelectOption } from '@fepkg/components/Select';
import { BaseDataIssuerInstGetAll } from '@fepkg/services/types/base-data/issuer-inst-get-all';
import { GroupQuickFilterValue } from '../QuickFilter/types';
import { BondIssueInfoFilterValue, GeneralFilterValue } from '../types';

export type DetailProps = {
  quickFilter?: GroupQuickFilterValue;
  generalFilter?: GeneralFilterValue;
  bondIssueInfoFilter?: BondIssueInfoFilterValue;
  issuerOptions?: {
    origin: BaseDataIssuerInstGetAll.Response;
    nodes: CascaderOption[];
  };
  provinceOptions?: SelectOption<string>[];
};
