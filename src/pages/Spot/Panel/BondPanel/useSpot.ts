import { useRef } from 'react';
import { SpotModalOpenType } from '@fepkg/business/constants/log-map';
import { DealQuote, FiccBondBasic } from '@fepkg/services/types/common';
import { DealType } from '@fepkg/services/types/enum';
import { cloneDeep } from 'lodash-es';
import { useDialogWindow } from '@/common/hooks/useDialog';
import { getNearestLiquidationSpeed } from '@/common/utils/liq-speed';
import { trackPoint } from '@/common/utils/logger/point';
import { SpotAppointModalProps, SpotDate } from '@/components/IDCSpot/types';
import { useProductParams } from '@/layouts/Home/hooks';
import { ISpotDialog, getSpotAppointDialogConfig, getSpotDialogConfig } from '@/pages/Spot/utils/openDialog';

export type OpenSpotParam = {
  dealType: DealType;
  optimal?: DealQuote;
  bond?: FiccBondBasic;
  quoteList?: DealQuote[];
  // 决定了有几个结算方式选项
  spotDate?: SpotDate;
};

export default function useSpot() {
  const { openDialog } = useDialogWindow();
  const forceUpdatedTime = useRef(0);
  const { productType } = useProductParams();

  // 打开点价弹窗
  const openSpotPricing = async (
    { dealType, optimal, bond, quoteList, spotDate }: OpenSpotParam,
    fromDetail: boolean
  ) => {
    trackPoint(fromDetail ? SpotModalOpenType.FromDetail : SpotModalOpenType.FromMain);
    forceUpdatedTime.current += 1;
    if (!bond || !optimal || !quoteList?.length) {
      console.log('入参不符合条件');
      return;
    }
    // 最优模式 and 远期下，做结算方式的过滤，只保留最近的远期交割
    const filteredOptimal = cloneDeep(optimal);
    if (spotDate === SpotDate.FRA) {
      if (filteredOptimal?.deal_liquidation_speed_list) {
        const nearestLiq = (await getNearestLiquidationSpeed(filteredOptimal?.deal_liquidation_speed_list))
          ?.liquidationSpeed;
        if (nearestLiq) {
          filteredOptimal.deal_liquidation_speed_list = [nearestLiq];
        }
      }
    }
    const option: ISpotDialog = {
      dealType,
      bond,
      optimal: filteredOptimal,
      quoteList,
      spotDate,
      forceUpdateTime: forceUpdatedTime.current
    };
    const { config } = getSpotDialogConfig(productType, option);
    openDialog(config);
  };

  // 打开指定模式点价弹窗
  const openSpotAppointPricing = ({ quote, dealType, bond }: SpotAppointModalProps) => {
    forceUpdatedTime.current += 1;
    if (!quote) {
      console.log('入参不符合条件');
      return;
    }
    const { config } = getSpotAppointDialogConfig({ dealType, quote, bond, openTimestamp: Date.now() });
    openDialog(config);
  };

  return { openSpotPricing, openSpotAppointPricing };
}
