import { useMemo } from 'react';
import cx from 'classnames';
import { Caption } from '@fepkg/components/Caption';
import { Tooltip } from '@fepkg/components/Tooltip';
import { IconCheckCircleFilled, IconCloseCircleFilled } from '@fepkg/icon-park-react';
import { groupBy } from 'lodash-es';
import { DiffDeal, DiffKeys } from '@/components/IDCDealDetails/type';
import { useBonds } from './useBonds';

type DiffContentProps = {
  type: 'old' | 'new';
  data?: DiffDeal[];
};

const getIcon = (val?: string) => {
  if (val === '是') {
    return (
      <IconCheckCircleFilled
        size={16}
        className="text-primary-200"
      />
    );
  }
  return (
    <IconCloseCircleFilled
      size={16}
      className="text-danger-200"
    />
  );
};

export const DiffContent = ({ type, data }: DiffContentProps) => {
  const keyMarkets = [data?.find(v => v.key === DiffKeys.BondCode)].map(v => v?.value).filter(Boolean);
  const bonds = useBonds(keyMarkets);
  const groupKeyMarketBonds = groupBy(bonds.data?.bondBasicList, 'key_market');

  const header = useMemo(() => {
    if (type === 'old') return <Caption>旧内容</Caption>;
    return <Caption type="orange">新内容</Caption>;
  }, [type]);

  return (
    <div className="w-[323px] bg-gray-800 rounded-lg py-2 px-3 flex flex-col gap-1">
      <div>{header}</div>
      {data?.map(v => {
        const showIcon = v.key === DiffKeys.FlagBridge;
        const value = v.key === DiffKeys.BondCode ? groupKeyMarketBonds[v.value ?? '']?.[0]?.display_code : v.value;

        return (
          <div
            key={v.key}
            className="flex h-8 items-center"
          >
            <span className="w-[120px] text-gray-200">{v.label}</span>
            {showIcon && getIcon(v.value)}
            <Tooltip
              truncate
              content={value}
            >
              <span
                className={cx(
                  'w-[178px] font-bold truncate',
                  v.hasChanged ? 'text-orange-100' : 'text-gray-000',
                  showIcon ? 'ml-2' : ''
                )}
              >
                {value || '--'}
              </span>
            </Tooltip>
          </div>
        );
      })}
    </div>
  );
};
