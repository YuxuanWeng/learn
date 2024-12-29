import { useMemo } from 'react';
import { Caption } from '@fepkg/components/Caption';
import { Combination } from '@fepkg/components/Combination';
import { IconRightArrow } from '@fepkg/icon-park-react';
import { Side, UserSettingFunction } from '@fepkg/services/types/enum';
import { QuoteComponent } from '@/components/business/Quote';
import { VolumeUnit } from '@/components/business/Quote/types';
import { CoQuoteVolumeSetting, CommonTypeValue, IUserSettingValue, ParseQuoteAmountValue } from '../../types';

type QuotePanelSettingsProps = {
  data: IUserSettingValue;
  onChange: (value: IUserSettingValue) => void;
};

const isCoQuoteVolumeSetting = (v?: CommonTypeValue): v is CoQuoteVolumeSetting => {
  if (typeof v === 'object' && 'limit' in v) {
    return true;
  }
  return false;
};

const CollaborativeQuoteSettings = ({ data, onChange }: QuotePanelSettingsProps) => {
  const { limit, target } = useMemo(() => {
    const value = data[UserSettingFunction.UserSettingCoQuoteVolume];
    if (isCoQuoteVolumeSetting(value)) {
      return value;
    }
    return { limit: {}, target: {} };
  }, [data]);

  const update = (type: keyof CoQuoteVolumeSetting, value?: ParseQuoteAmountValue) => {
    if (type === 'limit') {
      onChange({
        [UserSettingFunction.UserSettingCoQuoteVolume]: {
          limit: { ...value },
          target
        }
      });
    } else {
      onChange({
        [UserSettingFunction.UserSettingCoQuoteVolume]: {
          limit,
          target: { ...value }
        }
      });
    }
  };

  return (
    <div className="mt-6">
      <Caption type="secondary">
        <span className="text-sm select-none font-bold">协同报价</span>
      </Caption>

      <div className="flex flex-col pl-6">
        <div className="flex w-[632px] h-7 mt-6 border border-solid border-gray-600 rounded-lg items-center relative">
          <Combination
            size="sm"
            containerCls="absolute top-[-1px] left-[-1px]"
            background="prefix700-suffix600"
            prefixNode={
              <QuoteComponent.Volume
                className="w-[200px] h-6 rounded-r-none rounded-l-lg"
                labelWidth={64}
                label="报价量≥"
                side={Side.SideNone}
                defaultUnit={limit?.unit ?? VolumeUnit.TenThousand}
                value={limit?.value}
                onChange={(_, value?: string) => {
                  update('limit', {
                    value,
                    unit: limit?.unit ?? VolumeUnit.TenThousand
                  });
                }}
              />
            }
            suffixNode={
              <QuoteComponent.Unit
                clearIcon={null}
                className="w-20"
                label=""
                value={limit?.unit ?? VolumeUnit.TenThousand}
                onChange={(unit?: VolumeUnit) => {
                  update('limit', {
                    value: limit?.value,
                    unit
                  });
                }}
              />
            }
          />

          <div className="absolute left-1/2 -translate-x-1/2 flex flex-center">
            <span className="ml-3 text-gray-200 text-sm font-medium">改量</span>
            <IconRightArrow className="ml-1 mr-4 text-gray-200" />
          </div>

          <Combination
            size="sm"
            containerCls="absolute top-[-1px] right-[-1px]"
            background="prefix700-suffix600"
            prefixNode={
              <QuoteComponent.Volume
                className="w-[200px] h-6 rounded-r-none rounded-l-lg"
                label="报价量"
                labelWidth={64}
                side={Side.SideNone}
                defaultUnit={target?.unit ?? VolumeUnit.TenThousand}
                value={target?.value}
                onChange={(_, value?: string) => {
                  update('target', {
                    value,
                    unit: target?.unit ?? VolumeUnit.TenThousand
                  });
                }}
              />
            }
            suffixNode={
              <QuoteComponent.Unit
                clearIcon={null}
                label=""
                className="w-20"
                value={target?.unit ?? VolumeUnit.TenThousand}
                onChange={(unit?: VolumeUnit) => {
                  update('target', {
                    value: target?.value,
                    unit
                  });
                }}
              />
            }
          />
        </div>
      </div>
    </div>
  );
};
export default CollaborativeQuoteSettings;
