import { useEffect } from 'react';
import { isUseLocalServer } from '@/common/ab-rules';
import { useOptimalQuoteByKeyMarketQuery } from '@/common/services/hooks/local-server/quote/useOptimalQuoteByKeyMarketQuery';
import { SpotDateMapSettlementType } from '@/common/services/hooks/local-server/utils';
import { useBondOptimalQuoteLiveQuery } from '@/common/services/hooks/useLiveQuery/BondQuote';
import { getSpotModalProps } from '@/components/IDCBoard/Panel/panelUtils';
import { ISpotDialog } from '@/pages/Spot/utils/openDialog';

export default function useSpotInner(
  initSpotParam: ISpotDialog,
  onUpdate?: (SpotModalProps) => void,
  invalidateDialog?: () => void
) {
  const isLocalServer = isUseLocalServer();
  const { data: localizationData, isSuccess: isLocalizationSuccess } = useBondOptimalQuoteLiveQuery({
    params: {
      keyMarket: initSpotParam?.bond?.key_market,
      spotDate: initSpotParam?.spotDate,
      doOnSuccess: data2 => {
        console.log('收到query消息', data2, Date.now());
      }
    },
    enabled: !isLocalServer
  });
  const { data: localServerData, isSuccess: isLocalServerSuccess } = useOptimalQuoteByKeyMarketQuery({
    params: {
      key_market: initSpotParam?.bond?.key_market ?? '',
      settlement_type_list: initSpotParam?.spotDate ? SpotDateMapSettlementType[initSpotParam?.spotDate] : []
    },
    enabled: isLocalServer
  });

  const data = isLocalServer ? localServerData : localizationData;
  const isSuccess = isLocalServer ? isLocalServerSuccess : isLocalizationSuccess;

  useEffect(() => {
    if (data && isSuccess) {
      console.log('data数据变化', data);
      const dialogProps = getSpotModalProps(
        initSpotParam.dealType,
        initSpotParam.bond,
        initSpotParam.optimal?.deal_liquidation_speed_list,
        data,
        initSpotParam?.spotDate
      );
      if (dialogProps) {
        console.log('CASE1 更新面板', Date.now());
        onUpdate?.(dialogProps);
      } else {
        console.log('CASE2 主动触发面板失效', Date.now());
        invalidateDialog?.();
      }
    }
  }, [data, initSpotParam, invalidateDialog, isSuccess, onUpdate]);
}
