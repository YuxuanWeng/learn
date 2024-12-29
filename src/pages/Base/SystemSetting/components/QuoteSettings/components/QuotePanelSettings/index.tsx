import { useMemo } from 'react';
import { parseJSON } from '@fepkg/common/utils';
import { Caption } from '@fepkg/components/Caption';
import { Combination } from '@fepkg/components/Combination';
import { Side, UserSettingFunction } from '@fepkg/services/types/enum';
import { QuoteComponent } from '@/components/business/Quote';
import { VolumeUnit } from '@/components/business/Quote/types';
import CommonRadio from '../../../CommonRadio';
import CommonSwitch from '../../../CommonSwitch';
import { CommonTypeValue, IUserSettingValue, ParseQuoteAmountValue, TypeItem } from '../../types';

type QuotePanelSettingsProps = {
  data: IUserSettingValue;
  onChange: (value: IUserSettingValue) => void;
};
const isNumber = (n?: CommonTypeValue) => !Number.isNaN(Number(n));

export const formatQuoteAmount = (v: CommonTypeValue) => {
  if (isNumber(v)) {
    return {
      value: String(v),
      unit: VolumeUnit.TenThousand
    };
  }
  if (typeof v === 'string') {
    const res = parseJSON<ParseQuoteAmountValue>(v);
    return { ...res, value: res?.value === 'undefined' ? undefined : res?.value };
  }
  if (typeof v === 'object' && 'unit' in v) {
    return v;
  }

  return undefined;
};

const ValuationOptions: TypeItem[] = [
  { label: '四位估值小数', value: 4 },
  { label: '三位估值小数', value: 3 },
  { label: '二位估值小数', value: 2 }
];

const QuotePanelSettings = ({ data, onChange }: QuotePanelSettingsProps) => {
  const parseQuoteAmount = useMemo(() => {
    const value = data[UserSettingFunction.UserSettingQuoteAmount];
    return formatQuoteAmount(value);
  }, [data]);

  return (
    <div className="mt-6">
      <Caption type="orange">
        <span className="text-sm select-none font-bold">报价面板</span>
      </Caption>

      <div className="flex flex-col pl-6">
        <div className="flex flex-wrap gap-x-[72px] gap-y-6 mt-6">
          <CommonSwitch
            label="报价自动加*"
            value={data[UserSettingFunction.UserSettingQuoteAutoAddStar]}
            onChange={value => {
              onChange({ [UserSettingFunction.UserSettingQuoteAutoAddStar]: value });
            }}
          />

          <CommonSwitch
            label="报价识别默认加*"
            value={data[UserSettingFunction.UserSettingQuoteParsingDefaultFlagStar]}
            onChange={value => {
              onChange({ [UserSettingFunction.UserSettingQuoteParsingDefaultFlagStar]: value });
            }}
          />
        </div>

        <Combination
          size="sm"
          containerCls="w-[280px] mt-6"
          background="prefix700-suffix600"
          prefixNode={
            <QuoteComponent.Volume
              className="w-[200px] rounded-r-none rounded-l-lg"
              label="默认数量"
              side={Side.SideNone}
              defaultUnit={parseQuoteAmount?.unit ?? VolumeUnit.TenThousand}
              value={parseQuoteAmount?.value}
              onChange={(_, value?: string) => {
                onChange({
                  [UserSettingFunction.UserSettingQuoteAmount]: {
                    value,
                    unit: parseQuoteAmount?.unit ?? VolumeUnit.TenThousand
                  }
                });
              }}
            />
          }
          suffixNode={
            <QuoteComponent.Unit
              clearIcon={null}
              size="md"
              className="w-20"
              label=""
              value={parseQuoteAmount?.unit ?? VolumeUnit.TenThousand}
              onChange={(unit?: VolumeUnit) => {
                const quoteAmount: ParseQuoteAmountValue = {
                  unit,
                  value: parseQuoteAmount?.value
                };
                onChange({
                  [UserSettingFunction.UserSettingQuoteAmount]: quoteAmount
                });
              }}
            />
          }
        />

        <div className="flex w-[632px] h-7 mt-6 border border-solid border-gray-600 rounded-lg">
          <CommonRadio
            border={false}
            label="估值小数位选择"
            value={data[UserSettingFunction.UserSettingValuationDecimalDigit] || 4}
            list={ValuationOptions}
            key="估值小数位选择"
            onChange={value => {
              onChange({ [UserSettingFunction.UserSettingValuationDecimalDigit]: value });
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default QuotePanelSettings;
