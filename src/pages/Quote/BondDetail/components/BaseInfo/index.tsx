import { useState } from 'react';
import cx from 'classnames';
import { BondBenchmarkRate, FiccBondDetail, InstRating } from '@fepkg/services/types/common';
import { useCirculationMarketQuery, useHistoryLevelQuery, usePublisherQuery } from '../../hooks/useDataQuery';
import BondInfo from './components/BondInfo';
import PublisherInfo from './components/PublisherInfo';

type Props = {
  bondAppendixInfo: FiccBondDetail;
  height: number;
  benchmarkRate?: BondBenchmarkRate;
  issuerRatingList: InstRating[];
};

enum OptionType {
  BondDetail,
  IssueDetail
}

const BaseInfo = ({ bondAppendixInfo, height, benchmarkRate, issuerRatingList }: Props) => {
  const [tab, setTab] = useState(OptionType.BondDetail);

  const { data: bondHistoryLevelData } = useHistoryLevelQuery(bondAppendixInfo);
  const { data: circulationMarketData } = useCirculationMarketQuery(bondAppendixInfo);
  const { data: publisher } = usePublisherQuery(bondAppendixInfo.issuer_code);

  const options = [
    { label: '债券信息', value: OptionType.BondDetail },
    { label: '发行人信息', value: OptionType.IssueDetail }
  ];

  return (
    <div>
      <div className="flex p-3">
        {options.map(v => {
          return (
            <div
              key={v.value}
              className={cx(
                'w-[120px] h-8 flex items-center justify-center select-none border-solid border border-transparent',
                'hover:text-primary-100',
                tab === v.value && 'border-b-primary-100 text-primary-100'
              )}
              onClick={() => {
                setTab(v.value);
                window.getSelection()?.removeAllRanges();
              }}
            >
              {v.label}
            </div>
          );
        })}
      </div>

      <div
        style={{ height: `${height - 164}px` }}
        className="overflow-y-overlay rounded-lg px-3"
      >
        {/* 债券信息 */}
        <BondInfo
          visible={tab === OptionType.BondDetail}
          baseInfo={bondAppendixInfo}
          isMortgage={bondAppendixInfo.is_mortgage}
          benchmarkRate={benchmarkRate}
          bondHistoryLevelData={bondHistoryLevelData}
          circulationMarketData={circulationMarketData}
        />

        {/* 发行人信息 */}
        <PublisherInfo
          visible={tab === OptionType.IssueDetail}
          bondInfo={bondAppendixInfo}
          publisher={publisher}
          issuerRatingList={issuerRatingList}
        />
      </div>
    </div>
  );
};

export default BaseInfo;
