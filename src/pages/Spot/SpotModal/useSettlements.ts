import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { SERVER_NIL } from '@fepkg/common/constants';
import { DealQuote, LiquidationSpeed } from '@fepkg/services/types/common';
import { LiquidationSpeedTag } from '@fepkg/services/types/enum';
import { isEqual, toInteger } from 'lodash-es';
import { isFRALiquidation } from '@packages/utils/liq-speed';
import { SettlementMethod } from '@/common/types/liq-speed';
import { transformToLiqSpeedList } from '@/common/utils/liq-speed';
import { trackPoint } from '@/common/utils/logger/point';
import { SpotDate } from '@/components/IDCSpot/types';

const DefaultLiqList = [
  { tag: LiquidationSpeedTag.Today, offset: 0 },
  { tag: LiquidationSpeedTag.Today, offset: 1 },
  { tag: LiquidationSpeedTag.Tomorrow, offset: 0 }
];

const listToday1Tomorrow0 = [
  {
    tag: LiquidationSpeedTag.Today,
    offset: 1
  },
  {
    tag: LiquidationSpeedTag.Tomorrow,
    offset: 0
  }
];

const listToday0 = [
  {
    tag: LiquidationSpeedTag.Today,
    offset: 0
  }
];

/**
 * 报价条目要根据（紧急无星>紧急单星>紧急双星>非紧急无星>非紧急单星>非紧急双星，时间）重新进行排序
 */
export const sortSamePriceQuote = (bondQuoteI: DealQuote, bondQuoteJ: DealQuote) => {
  // 是否加急 且 有星号
  if (bondQuoteI.flag_urgent && !bondQuoteJ.flag_urgent) {
    return SERVER_NIL;
  }
  if (bondQuoteI.flag_urgent === bondQuoteJ.flag_urgent) {
    // 加急状态相同 比较 星号（从小到大）
    if (bondQuoteI.flag_star < bondQuoteJ.flag_star) {
      return SERVER_NIL;
    }
    if (bondQuoteI.flag_star === bondQuoteJ.flag_star) {
      // 价格相同， 加急&星号相同 => 比较时间
      if (toInteger(bondQuoteI.update_time) < toInteger(bondQuoteJ.update_time)) {
        return SERVER_NIL;
      }
      return 0;
    }
  }
  return 1;
};

const isLiqInCheckedSettlements = (a: LiquidationSpeed, checkedSettlements: LiquidationSpeed[]) => {
  return checkedSettlements.some(b => {
    if (b.tag === LiquidationSpeedTag.Default) return true; // 不限
    if (
      (b.tag === LiquidationSpeedTag.Today && b.offset === 1) ||
      (b.tag === LiquidationSpeedTag.Tomorrow && b.offset === 0)
    ) {
      if (a.tag === LiquidationSpeedTag.Default) {
        return true;
      } // 默认
    }
    return isEqual(a, b);
  });
};

export const getFilteredQuoteList = (quoteList: DealQuote[], checkedSettlements: LiquidationSpeed[]) => {
  if (!checkedSettlements?.length) return quoteList;
  const result = quoteList
    ?.filter(q => {
      if (!q.deal_liquidation_speed_list?.length) return true;
      return q.deal_liquidation_speed_list.some(a => isLiqInCheckedSettlements(a, checkedSettlements));
    })
    .sort(sortSamePriceQuote);
  return result;
};

interface IProps {
  spotDate?: SpotDate;
  optimal: DealQuote;
  quoteList: DealQuote[];
}

export default function useLiqList({ spotDate, optimal, quoteList }: IProps) {
  const [shownSettlements, setShownSettlements] = useState<LiquidationSpeed[] | undefined>();
  const [defaultSettlements, setDefaultSettlements] = useState<LiquidationSpeed[]>([]);
  const [checkedSettlements, setCheckedSettlementList] = useState<LiquidationSpeed[]>(defaultSettlements);

  const renderModeSettlements = useCallback(() => {
    if (spotDate === SpotDate.Today1Tommorow0) {
      setShownSettlements(listToday1Tomorrow0);
      setDefaultSettlements(listToday1Tomorrow0);
    } else if (spotDate === SpotDate.Plus0) {
      setShownSettlements(listToday0);
      setDefaultSettlements(listToday0);
    } else if (spotDate === SpotDate.NonFRA) {
      setShownSettlements([...listToday0, ...listToday1Tomorrow0]);
      setDefaultSettlements([...listToday0, ...listToday1Tomorrow0]);
    } else if (spotDate === SpotDate.FRA) {
      const fraLiquidations = optimal.deal_liquidation_speed_list?.filter(item => isFRALiquidation(item)) || [];
      setShownSettlements(fraLiquidations);
    } else {
      setShownSettlements(DefaultLiqList);
      setDefaultSettlements(DefaultLiqList.slice(1));
    }
  }, [optimal.deal_liquidation_speed_list, spotDate]);

  useLayoutEffect(() => {
    renderModeSettlements();
  }, [renderModeSettlements]);

  const onDateShortcutsChange = (methods: SettlementMethod[]) => {
    setCheckedSettlementList(transformToLiqSpeedList(methods));
    trackPoint('change-date-shortcuts');
  };

  const filteredList: DealQuote[] | undefined = useMemo(() => {
    return getFilteredQuoteList(quoteList, checkedSettlements);
  }, [quoteList, checkedSettlements]);

  const settlementsForSubmit = useMemo(() => {
    if (spotDate === SpotDate.FRA) return optimal.deal_liquidation_speed_list;
    if (isEqual(checkedSettlements, [{ tag: LiquidationSpeedTag.Default, offset: 0 }])) {
      return DefaultLiqList;
    }
    return checkedSettlements;
  }, [checkedSettlements, spotDate, optimal]);

  return {
    shownSettlements,
    settlementsForSubmit,
    defaultSettlements,
    onDateShortcutsChange,
    filteredList
  };
}
