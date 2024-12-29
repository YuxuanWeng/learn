import { Combination } from '@fepkg/components/Combination';
import { Side } from '@fepkg/services/types/enum';
import { QuoteComponent, VolumeUnit } from '@/components/business/Quote';
import { useBatchQuoteOper } from '../../providers/BatchQuoteOperProvider';
import { OperItem } from './OperItem';

export const Volume = () => {
  const { volume, setVolume, unit, updateUnit } = useBatchQuoteOper();

  const unitValue = unit?.[Side.SideNone] ?? VolumeUnit.TenMillion;

  return (
    <OperItem label="量">
      <Combination
        size="sm"
        prefixNode={
          <QuoteComponent.Volume
            className="w-[150px]"
            placeholder="请输入"
            label={null}
            side={Side.SideNone}
            padding={[1, 11]}
            defaultUnit={unitValue ?? VolumeUnit.TenMillion}
            value={volume}
            onChange={(_, val) => setVolume(val ?? '')}
          />
        }
        suffixNode={
          <QuoteComponent.Unit
            className="w-[98px]"
            label=""
            value={unitValue ?? VolumeUnit.TenMillion}
            onChange={val => updateUnit(Side.SideNone, val)}
          />
        }
      />
    </OperItem>
  );
};
