import { useMemo } from 'react';
import { useBondSearch } from '@fepkg/business/components/Search/BondSearch';
import { TextBadge } from '@fepkg/components/Tags';
import { getCouponRateCurrent } from '@/common/utils/bond';
import { isNotIntentional } from '@/common/utils/quote-price';
import { ReadOnly } from '@/components/ReadOnly';

export const BondBasic = ({ labelWidth = 80, containerClassName = 'gap-x-12' }) => {
  const { bondSearchState } = useBondSearch();

  const options = useMemo(() => {
    const activeBond = bondSearchState.selected?.original;
    return [
      {
        label: '简称',
        value: activeBond?.short_name,
        suffix: !isNotIntentional(activeBond?.mkt_type) ? (
          <TextBadge
            text="N"
            type="BOND"
            title="未上市"
          />
        ) : undefined
      },
      { label: '评级', value: activeBond?.issuer_rating },
      { label: '剩余期限', value: activeBond?.time_to_maturity },
      { label: '票面利率', value: getCouponRateCurrent(activeBond) }
    ];
  }, [bondSearchState.selected?.original]);

  return (
    <ReadOnly
      containerClassName={containerClassName}
      optionsClassName="h-7 py-0"
      options={options}
      rowCount={2}
      labelWidth={labelWidth}
    />
  );
};
