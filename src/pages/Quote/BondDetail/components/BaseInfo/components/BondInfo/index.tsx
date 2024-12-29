import { FC, MouseEvent } from 'react';
import cx from 'classnames';
import { useLocalStorage } from '@fepkg/business/hooks/useLocalStorage';
import { SPACE_TEXT } from '@fepkg/common/constants';
import { BondBenchmarkRate, BondRating, FiccBondBasic, FiccBondDetail } from '@fepkg/services/types/common';
import { LSKeys, getLSKey } from '@/common/constants/ls-keys';
import { useProductParams } from '@/layouts/Home/hooks';
import BaseInfo from '../BaseInfo';
import BondCalendar from '../BondCalendar';
import BondLiteTable from '../BondLiteTable';
import { circulationMarketColumns } from '../BondLiteTable/columns';
import BondRatingTable from '../BondRatingTable';
import RateInfo from '../RateInfo';

const baseCls = 'bg-gray-800 rounded-lg border border-solid border-gray-600';
const copyMarketInfo = (_evt: MouseEvent<HTMLDivElement>, rowData: FiccBondBasic) => {
  window.Main.copy(`${rowData.display_code}${SPACE_TEXT.repeat(8)}${rowData.short_name}`);
};

type Props = {
  visible: boolean;
  baseInfo: FiccBondDetail;
  benchmarkRate?: BondBenchmarkRate;
  isMortgage?: boolean;
  circulationMarketData?: FiccBondBasic[];
  bondHistoryLevelData?: BondRating[];
};
const BondInfo: FC<Props> = ({
  visible,
  baseInfo,
  benchmarkRate,
  isMortgage,
  circulationMarketData,
  bondHistoryLevelData
}) => {
  const { productType } = useProductParams();
  /**
   * 基本信息显示隐藏控制
   */
  const [firstItemVisible, setFirstItemVisible] = useLocalStorage(
    getLSKey(LSKeys.SingleBondDetailBondInfoFirstItemVisible, productType),
    true
  );

  /**
   * 利率信息  债券日历显示隐藏控制
   */
  const [secondItemVisible, setSecondItemVisible] = useLocalStorage(
    getLSKey(LSKeys.SingleBondDetailBondInfoSecondItemVisible, productType),
    true
  );

  /**
   * 流通市场信息  债项历史评级  表格显示隐藏
   */
  const [thirdItemVisible, setThirdItemVisible] = useLocalStorage(
    getLSKey(LSKeys.SingleBondDetailBondInfoThirdItemVisible, productType),
    true
  );

  const onChangeVisible = (level: number, v: boolean) => {
    switch (level) {
      case 0:
        setFirstItemVisible(v);
        break;
      case 1:
        setSecondItemVisible(v);
        break;
      case 2:
        setThirdItemVisible(v);
        break;
      default:
    }
  };

  return (
    <div className={cx('grid grid-cols-2 gap-4 grid-flow-row', !visible && 'h-0 overflow-hidden')}>
      {/* 基本信息 */}
      <BaseInfo
        className={baseCls}
        visible={firstItemVisible}
        onChange={onChangeVisible}
        baseInfo={baseInfo}
      />
      {/* 利率信息 */}
      <RateInfo
        className={baseCls}
        visible={secondItemVisible}
        onChange={onChangeVisible}
        baseInfo={baseInfo}
        benchmarkRate={benchmarkRate}
      />
      {/* 债券日历 */}
      <BondCalendar
        className={baseCls}
        visible={secondItemVisible}
        onChange={onChangeVisible}
        baseInfo={baseInfo}
      />
      <BondLiteTable
        className={baseCls}
        title="流通市场信息"
        columns={circulationMarketColumns}
        columnVisibleKeys={
          isMortgage
            ? ['listed_market', 'display_code', 'short_name', 'conversion_rate']
            : ['listed_market', 'display_code', 'short_name']
        }
        data={circulationMarketData}
        onChange={onChangeVisible}
        visible={thirdItemVisible}
        onCellClick={copyMarketInfo}
      />
      <BondRatingTable
        className={baseCls}
        title="债项历史评级"
        data={bondHistoryLevelData}
        onChange={onChangeVisible}
        visible={thirdItemVisible}
      />
    </div>
  );
};

export default BondInfo;
