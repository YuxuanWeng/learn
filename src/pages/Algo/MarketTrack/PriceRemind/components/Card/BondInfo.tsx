import { memo, useMemo } from 'react';
import cx from 'classnames';
import { Tooltip } from '@fepkg/components/Tooltip';
import { FiccBondBasic } from '@fepkg/services/types/common';
import { isEqual } from 'lodash-es';
import { getRating, getValuation } from '@/common/utils/copy';

type Props = {
  /** 债券信息 */
  bondInfo: FiccBondBasic;
  /**  期限和债券字体的颜色 */
  textCls: string;
};
const Inner = ({ bondInfo, textCls }: Props) => {
  const { short_name, display_code, time_to_maturity } = bondInfo;
  /** 剩余期限 */
  const timeToMaturity = useMemo(() => {
    return (
      <Tooltip
        truncate
        content={time_to_maturity}
      >
        <div className={cx(textCls, 'w-[96px] px-4 truncate')}>{time_to_maturity}</div>
      </Tooltip>
    );
  }, [textCls, time_to_maturity]);

  /** 债券简称 */
  const bondShortName = useMemo(() => {
    return (
      <Tooltip
        truncate
        content={short_name}
      >
        <div className={cx('w-[120px] px-4 truncate', textCls)}>{short_name}</div>
      </Tooltip>
    );
  }, [textCls, short_name]);

  /** 评级   获取方式同报价复制中的评级 */
  const rating = getRating(bondInfo);

  /** 中债估值  */
  const copyValuation = getValuation(bondInfo);

  /** 券码 评级  中债估值 */
  const bondLabel = useMemo(() => {
    const valuation = (copyValuation.startsWith('估值') ? copyValuation.slice(3) : copyValuation).split('|');
    return (
      <div className="flex justify-center items-center gap-x-2 px-3 h-7 text-gray-100 bg-gray-700 rounded-lg">
        <div>{display_code}</div>
        <div>{rating}</div>
        {valuation.length === 1 && <div>{valuation[0]}</div>}
        {valuation.length === 2 && (
          <div className="flex gap-x-1">
            <div>{valuation[0]}</div>
            <div>|</div>
            <div>{valuation[1]}</div>
          </div>
        )}
      </div>
    );
  }, [display_code, rating, copyValuation]);
  return (
    <div className="flex items-center">
      {timeToMaturity}
      {bondShortName}
      {bondLabel}
    </div>
  );
};

export const BondInfo = memo(Inner, (prevProps, nextProps) => isEqual(prevProps, nextProps));
