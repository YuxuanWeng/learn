import { useEffect, useMemo, useState } from 'react';
import { DateOffsetEnum } from '@fepkg/business/types/date';
import { LiquidationSpeedTag } from '@fepkg/services/types/enum';
import { BatchGetTreadDayAndDeliDayProps, DaysStruct } from '@/common/types/liq-speed';
import { batchGetTreadDayAndDeliDay } from '@/common/utils/liq-speed';

export const useTradeAndDeliveryDate = (
  params?: BatchGetTreadDayAndDeliDayProps,
  listedDate?: string
): [DaysStruct[], (v: DaysStruct[]) => void] => {
  const [treadDayAndDeliDays, setTreadDayAndDeliDays] = useState<DaysStruct[]>([]);

  const defaultParams = useMemo(() => {
    const response: BatchGetTreadDayAndDeliDayProps = [];
    const LiquidationSpeedTagStatic = [
      LiquidationSpeedTag.Today,
      LiquidationSpeedTag.Tomorrow,
      LiquidationSpeedTag.Monday,
      LiquidationSpeedTag.Tuesday,
      LiquidationSpeedTag.Wednesday,
      LiquidationSpeedTag.Thursday,
      LiquidationSpeedTag.Friday,
      LiquidationSpeedTag.Saturday,
      LiquidationSpeedTag.Sunday
    ];
    for (const tag of LiquidationSpeedTagStatic) {
      response.push({ tag, offset: DateOffsetEnum.PLUS_0 }, { tag, offset: DateOffsetEnum.PLUS_1 });
    }
    return response;
  }, []);

  useEffect(() => {
    (async () => {
      const response = await batchGetTreadDayAndDeliDay(params || defaultParams, listedDate);
      setTreadDayAndDeliDays(response);
    })();
  }, [defaultParams, listedDate, params]);

  return [treadDayAndDeliDays, setTreadDayAndDeliDays];
};
