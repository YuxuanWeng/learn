import { OutBoundConfValue } from '@/common/types';
import { ProductOption } from '../constants';
import { ScrollMenuItem } from './components/ConfigAside/types';
import { AnchorType } from './components/FieldsGroup/types';

export const ANCHOR_ID = 'out-bound-conf-wrap';

const getDefConf = () => {
  const re = {} as OutBoundConfValue;
  // 可配置外发字段的只有通用机构，类似山证这样的外发机构是不需要考虑外发字段配置的，所以直接map通用的option即可
  for (const i of ProductOption) {
    re[i.value] = { msgTypeList: [], fieldList: [] };
  }
  return re;
};

export const DEFAULT_CONF = getDefConf();

export const secondaryOptions: ScrollMenuItem[] = [
  { id: AnchorType.Base, label: '默认字段' },
  { id: AnchorType.Bond, label: '债券基础信息' },
  { id: AnchorType.BestQuote, label: '最优报价信息' },
  { id: AnchorType.Deal, label: '成交信息' }
];

export const primaryOptions: ScrollMenuItem[] = [
  { id: AnchorType.Base, label: '默认字段' },
  { id: AnchorType.Quote, label: '报价信息' }
];
