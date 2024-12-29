import { useMemo } from 'react';
import { useBondSearch } from '@fepkg/business/components/Search/BondSearch';
import { TextBadge } from '@fepkg/components/Tags';
import { UserSettingFunction } from '@fepkg/services/types/enum';
import { quoteSetting, useUserSetting } from '@/common/services/hooks/useSettings/useUserSetting';
import { getCouponRateCurrent } from '@/common/utils/bond';
import { isNotIntentional, transform2ValContent } from '@/common/utils/quote-price';
import { QuoteSettingsType } from '@/components/Quote/types';
import { ReadOnly } from '@/components/ReadOnly';
import { ReadOnlyOption } from '@/components/ReadOnly/types';

const baseCls = 'w-[208px]';

export const BondBasic = () => {
  const { getSetting } = useUserSetting<QuoteSettingsType>(quoteSetting);
  const { bondSearchState } = useBondSearch();

  const bond = bondSearchState.selected?.original;
  const decimalDigit = Number(getSetting<number>(UserSettingFunction.UserSettingValuationDecimalDigit) || 4);

  const options: ReadOnlyOption[] = useMemo(
    () => [
      { label: '代码', value: bond?.display_code, className: baseCls },
      {
        label: '简称',
        value: bond?.short_name,
        className: baseCls,
        suffix: !isNotIntentional(bond?.mkt_type) ? (
          <TextBadge
            className="min-w-[16px] !h-5 !w-5 text-xs !leading-3 text-center inline-block"
            text="N"
            type="BOND"
            title="未上市"
          />
        ) : undefined
      },
      { label: '评级', value: bond?.issuer_rating, className: baseCls },
      { label: '剩余期限', value: bond?.time_to_maturity, className: baseCls },
      { label: '票面利率', value: getCouponRateCurrent(bond), className: baseCls },
      { label: '估价', value: transform2ValContent(bond, decimalDigit), className: baseCls }
    ],
    [bond, decimalDigit]
  );

  return (
    <ReadOnly
      containerClassName="!gap-y-1 py-1"
      options={options}
      labelWidth={72}
    />
  );
};
