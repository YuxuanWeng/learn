import { FC, useMemo } from 'react';
import DescribeItem from '@/components/ReadOnly/DescribeItem';
import { ReadOnlyOption } from '@/components/ReadOnly/types';
import { LatestBondInfo } from '@/pages/Quote/BondDetail/type';
import { defaultDisplayItem, getDisplayItem } from '@/pages/Quote/BondDetail/utils';

type Props = {
  latestBondInfo?: LatestBondInfo;
};

const DisplayItem: FC<Props> = ({ latestBondInfo }) => {
  const items = useMemo(() => {
    const data = latestBondInfo ? getDisplayItem(latestBondInfo) : defaultDisplayItem;
    return [
      { label: '债券简称', value: data.short_name, enableCopy: true },
      { label: '债券代码', value: data.bond_code, enableCopy: true },
      { label: '剩余期限', value: data.time_to_maturity, enableCopy: true },
      { label: '评级', value: data.rating_current, enableCopy: true },
      { label: '债券类型', value: data.selective_name, enableCopy: true },
      { label: '发行量', value: data.issue_amount, enableCopy: true },
      { label: '票面利率', value: data.coupon_rate_current, enableCopy: true },
      { label: '发行人', value: data.publisher, enableCopy: true },
      { label: '担保方式', value: data.warrant_method, enableCopy: true },
      { label: '利率方式', value: data.coupon_type, enableCopy: true },
      { label: '质押率', value: data.conversion_rate, enableCopy: true },
      { label: '到期日', value: data.maturity_date, enableCopy: true },
      {
        label: '债券评级机构',
        value: data.rating_inst_code,
        enableCopy: true,
        className: 'col-span-3'
      }
    ] as ReadOnlyOption[];
  }, [latestBondInfo]);

  return (
    <div className="py-2 bg-gray-800 px-7 rounded-lg">
      <div className="grid grid-rows-3 grid-cols-5 gap-x-4 gap-y-2">
        {items.map(item => (
          <DescribeItem
            key={item.label}
            label={item.label}
            value={item.value}
            enableCopy={item.enableCopy}
            className={`${item.className} min-h-[28px]`}
            labelWidth={96}
            contentBold
          />
        ))}
      </div>
    </div>
  );
};
export default DisplayItem;
