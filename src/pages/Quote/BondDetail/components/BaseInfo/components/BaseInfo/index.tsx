import { FC, useMemo } from 'react';
import cx from 'classnames';
import { FiccBondDetail } from '@fepkg/services/types/common';
import DescribeItem from '@/components/ReadOnly/DescribeItem';
import { ReadOnlyOption } from '@/components/ReadOnly/types';
import { TypeProps } from '@/pages/Quote/BondDetail/type';
import { getBaseInfo, getCopyContext } from '@/pages/Quote/BondDetail/utils';
import { CollapseCaption } from '../CollapseCaption';

type Props = TypeProps & {
  baseInfo: FiccBondDetail;
  className?: string;
};

const BaseInfo: FC<Props> = ({ className = '', onChange, visible, baseInfo }) => {
  const titleOnChange = (value: boolean) => {
    onChange(0, value);
  };

  const items = useMemo(() => {
    const data = getBaseInfo(baseInfo);
    return [
      { label: '债券全称', value: data.full_name, className: 'col-span-2', isTruncate: false },
      { label: '主体评级', value: data.issuer_rating_current },
      { label: '债项评级', value: data.rating_current },
      { label: '债券类型', value: data.selective_name },
      { label: '含权类型', value: data.option_type },
      { label: '债券期限', value: data.maturity_term },
      { label: '发行规模', value: data.issue_amount },
      { label: '担保方式', value: data.warrant_method },
      { label: '剩余期限', value: data.time_to_maturity },
      { label: '担保人', value: data.warranter },
      { label: '还本方式', value: data.repayment_method },
      { label: '主承销商', value: data.underwriter_code, className: 'col-span-2', isTruncate: false },
      { label: '承销团', value: data.underwriter_group, className: 'col-span-2', isTruncate: false }
    ] as ReadOnlyOption[];
  }, [baseInfo]);

  const onCopy = () => {
    window.Main.copy(getCopyContext(items, 2));
  };

  return (
    <div className={cx('col-start-1 col-end-3', className)}>
      {/* 基本信息头 */}
      <CollapseCaption
        title="基本信息"
        open={visible}
        onChange={titleOnChange}
        onCopy={onCopy}
      />

      {/* 基本信息内容区 */}
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

export default BaseInfo;
