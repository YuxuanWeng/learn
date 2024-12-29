import { FC, useMemo } from 'react';
import cx from 'classnames';
import { BondBenchmarkRate, FiccBondDetail } from '@fepkg/services/types/common';
import DescribeItem from '@/components/ReadOnly/DescribeItem';
import { ReadOnlyOption } from '@/components/ReadOnly/types';
import { TypeProps } from '@/pages/Quote/BondDetail/type';
import { getCopyContext, getRateInfo } from '@/pages/Quote/BondDetail/utils';
import { CollapseCaption } from '../CollapseCaption';

type Props = TypeProps & {
  baseInfo: FiccBondDetail;
  benchmarkRate?: BondBenchmarkRate;
  className?: string;
};

const RateInfo: FC<Props> = ({ className = '', onChange, visible, baseInfo, benchmarkRate }) => {
  const titleOnChange = (value: boolean) => {
    onChange(1, value);
  };

  const items = useMemo(() => {
    const rateInfo = getRateInfo(baseInfo, benchmarkRate);
    return [
      { label: '利率方式', value: rateInfo.coupon_type },
      { label: '票面利率', value: rateInfo.coupon_rate_current },
      { label: '基础利率名', value: rateInfo.name },
      { label: '基础利率', value: rateInfo.value },
      { label: '发行收益', value: rateInfo.issue_rate },
      { label: '发行价格', value: rateInfo.issue_price },
      { label: '付息频率', value: rateInfo.coupon_frequency },
      { label: '计息频率', value: rateInfo.compound_frequency }
    ] as ReadOnlyOption[];
  }, [baseInfo, benchmarkRate]);

  const onCopy = () => {
    window.Main.copy(getCopyContext(items, 2));
  };

  return (
    <div className={className}>
      <CollapseCaption
        title="利率信息"
        open={visible}
        onChange={titleOnChange}
        onCopy={onCopy}
      />
      <div className={cx(!visible && 'h-0 overflow-hidden')}>
        <div className="px-9 pt-3 pb-4 grid grid-cols-2 gap-x-4 gap-y-2">
          {items.map(item => (
            <DescribeItem
              key={item.label}
              label={item.label}
              value={item.value}
              isTruncate={item.isTruncate}
              className={`${item.className} min-h-[28px]`}
              labelWidth={96}
              contentBold
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RateInfo;
