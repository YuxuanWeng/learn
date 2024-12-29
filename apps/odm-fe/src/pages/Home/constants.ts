import { ProductType } from '@fepkg/services/types/enum';

export const ProductOption = [
  { label: '利率', value: ProductType.BNC },
  { label: '信用', value: ProductType.BCO },
  { label: '存单一级', value: ProductType.NCDP },
  { label: '存单二级', value: ProductType.NCD }
];
export const SorProductOption = [
  { label: '利率', value: ProductType.BNC },
  { label: '存单二级', value: ProductType.NCD }
];

export const secondaryMarket = new Set([ProductType.BNC, ProductType.BCO, ProductType.NCD]);

export const primaryMarket = new Set([ProductType.NCDP]);
