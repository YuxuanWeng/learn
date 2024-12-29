import { FC, useMemo } from 'react';
import cx from 'classnames';
import { FiccBondDetail } from '@fepkg/services/types/common';
import DescribeItem from '@/components/ReadOnly/DescribeItem';
import { ReadOnlyOption } from '@/components/ReadOnly/types';
import { TypeProps } from '@/pages/Quote/BondDetail/type';
import { getBondCalendar, getCopyContext } from '@/pages/Quote/BondDetail/utils';
import { CollapseCaption } from '../CollapseCaption';

type Props = TypeProps & {
  baseInfo: FiccBondDetail;
  className?: string;
};

const BondCalendar: FC<Props> = ({ className = '', onChange, visible, baseInfo }) => {
  const titleOnChange = (value: boolean) => {
    onChange(1, value);
  };

  const items = useMemo(() => {
    const data = getBondCalendar(baseInfo);
    return [
      { label: '发行开始日', value: data.issue_start_date },
      { label: '行权日', value: data.option_date },
      { label: '起息日', value: data.interest_start_date },
      { label: '下市日', value: data.delisted_date },
      { label: '上市日', value: data.listed_date },
      { label: '到期日', value: data.maturity_date },
      { label: '下次付息日', value: data.next_coupon_date }
    ] as ReadOnlyOption[];
  }, [baseInfo]);

  const onCopy = () => {
    window.Main.copy(getCopyContext(items, 2));
  };

  return (
    <div className={className}>
      <CollapseCaption
        title="债券日历"
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

export default BondCalendar;
