import { Acceptor } from '@fepkg/services/types/enum';
import logoShan from '@/assets/images/logo-shanzheng.png';
import logoWind from '@/assets/images/logo-wind.png';
import { MarketNotifyFields, MarketNotifySorTags } from '@/common/constants/out-bound-fields';
import { OutBoundInst } from './type';

export const ASIDE_BAR_WIDTH = 208;
export const outBoundList = [Acceptor.AcceptorWind, Acceptor.AcceptorSor];

/** 外发机构信息 */
export const OutBoundMap: Record<Acceptor, OutBoundInst> = {
  [Acceptor.AcceptorNone]: {
    imgAlt: '',
    imgSrc: '',
    name: '',
    fields: []
  },
  [Acceptor.AcceptorWind]: {
    imgSrc: logoWind,
    imgAlt: 'img-wind',
    name: 'Wind',
    fields: MarketNotifyFields
  },
  [Acceptor.AcceptorSor]: {
    imgSrc: logoShan,
    imgAlt: 'img-shan',
    name: '山西证券',
    fields: MarketNotifySorTags
  }
};
