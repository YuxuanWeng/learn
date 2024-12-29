import { Side } from '@fepkg/services/types/enum';
import { LSKeys, getLSKey } from '@/common/constants/ls-keys';
import { useLocalforage } from '@/common/hooks/useLocalforage';
import { VolumeUnit } from '@/components/business/Quote';
import { useProductParams } from '@/layouts/Home/hooks';

export const defaultUnit = {
  [Side.SideBid]: VolumeUnit.TenMillion,
  [Side.SideOfr]: VolumeUnit.TenMillion,
  [Side.SideNone]: VolumeUnit.TenMillion
};

const useUnit = () => {
  const { productType } = useProductParams();
  const key = getLSKey(LSKeys.SingleQuoteUnit, productType);
  const [unit, , set] = useLocalforage<{ [key in Side]?: VolumeUnit }>(key, defaultUnit);

  const updateUnit = (side: Side, val?: VolumeUnit) => {
    set({ ...unit, [side]: val });
  };

  const exchange = async () => {
    if (!unit) return;
    await set({
      [Side.SideBid]: unit[Side.SideOfr] || VolumeUnit.TenThousand,
      [Side.SideOfr]: unit[Side.SideBid] || VolumeUnit.TenThousand,
      [Side.SideNone]: unit[Side.SideNone] || VolumeUnit.TenThousand
    });
  };

  return { unit, updateUnit, exchange };
};

export default useUnit;
