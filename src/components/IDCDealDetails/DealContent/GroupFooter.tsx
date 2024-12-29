import { useMemo } from 'react';
import cx from 'classnames';
import { Side } from '@fepkg/services/types/enum';
import { useFilter } from '../SearchFilter/providers/FilterStateProvider';
import { DealContainerData, TypeDealContentSum, TypeDealItemSum } from '../type';
import { DealGroupFoot } from './DealGroupFoot';

type GroupFooterProps = { data: DealContainerData };

export const GroupFooter = ({ data }: GroupFooterProps) => {
  const sumData: TypeDealContentSum[] = useMemo(() => {
    const map = new Map<string, TypeDealItemSum>();
    let targetDeals = data.deals ?? [];
    if (data.isHistory) {
      targetDeals = data.historyDeals ?? [];
    }
    for (const item of targetDeals) {
      const { parent_deal: deal } = item;
      const mapK = deal.bond_basic_info?.key_market ?? '';
      const obj = map.get(mapK);
      if (obj) {
        if (item.dealSide === Side.SideBid) {
          obj.gvnNum += deal.volume || 0;
        } else if (item.dealSide === Side.SideOfr) {
          obj.tknNum += deal.volume || 0;
        }
      } else {
        map.set(mapK, {
          key_market: deal.bond_basic_info?.display_code ?? '',
          short_name: deal.bond_basic_info?.short_name,
          gvnNum: item.dealSide === Side.SideBid ? deal.volume || 0 : 0,
          tknNum: item.dealSide === Side.SideOfr ? deal.volume || 0 : 0,
          sumId: mapK
        });
      }
    }
    return [...map.values()].map(item => ({
      ...item,
      gvnNum: item.gvnNum >= 10000 ? `${item.gvnNum / 10000}E` : String(item.gvnNum),
      tknNum: item.tknNum >= 10000 ? `${item.tknNum / 10000}E` : String(item.tknNum)
    }));
  }, [data.deals, data.historyDeals, data.isHistory]);

  const { getPreferenceValue } = useFilter();

  /** 分组中是否显示方向和汇总信息 */
  const showConfig = useMemo(() => getPreferenceValue(data.groupId), [data.groupId, getPreferenceValue]);

  return showConfig.showSum && sumData.length ? (
    <div
      className={cx(
        'px-2 pb-2 rounded-t-none bg-gray-600 border border-solid border-y-0 border-gray-500',
        data.isLastGroup && 'rounded-b-lg border-b'
      )}
    >
      <DealGroupFoot
        sumData={sumData}
        className={data.isLast ? 'rounded-b-lg' : ''}
      />
    </div>
  ) : null;
};
