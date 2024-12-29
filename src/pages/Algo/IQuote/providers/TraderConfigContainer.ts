import { useEffect, useMemo, useRef, useState } from 'react';
import { message } from '@fepkg/components/Message';
import { createContainer } from 'unstated-next';
import { resetTraderConfig } from '@/common/services/api/algo/quick-chat-api/reset-broker-all-trader-config';
import { updateTraderConfig } from '@/common/services/api/algo/quick-chat-api/update-trader-config';
import { useProductParams } from '@/layouts/Home/hooks';
import { BdsProductTypeMap } from '../constants';
import { useTraderConfigListData } from '../queries/useTraderConfigListData';
import { UpdateFnProps } from './TraderConfigProvider';
import { useTraderFuzzySearch } from './TraderFuzzySearchProvider';

/** 交易员挂单设置上下文 */
export const TraderConfigContainer = createContainer(() => {
  const [visible, setVisible] = useState(false);

  const { data: traderConfigList, refetch } = useTraderConfigListData(visible);

  const [selectedTraderId, setSelectedTraderId] = useState<string | undefined>(traderConfigList?.[0]?.trader_id);

  const traderFuzzySearch = useTraderFuzzySearch();

  useEffect(() => {
    if (selectedTraderId && traderConfigList?.some(v => v.trader_id === selectedTraderId)) return;
    if (!traderConfigList?.length) return;
    setSelectedTraderId(traderConfigList[0].trader_id);
  }, [selectedTraderId, traderConfigList]);

  const currentTrader = useMemo(
    () => traderConfigList?.find(v => v.trader_id === selectedTraderId),
    [selectedTraderId, traderConfigList]
  );

  const { productType } = useProductParams();
  const bdsProductType = BdsProductTypeMap[productType];

  const traderMapRef = useRef<Record<string, HTMLDivElement>>({});

  const openModal = () => {
    setVisible(true);
  };

  /** 保存交易员配置修改 */
  const save = async ({ traderId, key, value }: UpdateFnProps) => {
    await updateTraderConfig({ trader_id: traderId, [key]: value, product_type: bdsProductType });
    await refetch();
    message.success('保存成功');
  };

  const closeModal = () => {
    traderFuzzySearch.setKeyword('');
    traderFuzzySearch.setSelectedTrader(void 0);
    setVisible(false);
  };

  /** 恢复默认 */
  const reset = async () => {
    await resetTraderConfig({ product_type: bdsProductType });
    await refetch();
  };

  return {
    traderFuzzySearch,
    currentTrader,
    traderConfigList,

    selectedTraderId,
    setSelectedTraderId,

    visible,
    traderMapRef,
    save,
    reset,
    openModal,
    closeModal
  };
});

export const TraderConfigProvider = TraderConfigContainer.Provider;
export const useTraderConfig = TraderConfigContainer.useContainer;
