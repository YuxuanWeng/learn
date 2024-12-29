import { useCallback, useState } from 'react';
import type { GetConfig } from '@fepkg/services/types/algo/get-config';
import { createContainer } from 'unstated-next';
import { bcoBondRecommendGetConfig } from '@/common/services/api/algo/bond-recommend-api/get-config';

// 为 table 提供公用 provider，防止过多的数据传递
const BCORecommendTableBondListContainer = createContainer((initialState?: { refresh?: VoidFunction }) => {
  return {
    refresh: initialState?.refresh
  };
});

export const BCORecommendTableProvider = BCORecommendTableBondListContainer.Provider;
export const useBCORecommendTable = BCORecommendTableBondListContainer.useContainer;

// 为 table 提供公用 provider，防止过多的数据传递
const BCORecommendTableSchemaInputContainer = createContainer(() => {
  const [schemaInputMap, setSchemaInputMap] = useState<Record<string, string>>({});

  return {
    schemaInputMap,
    setSchemaInputMap
  };
});

export const BCORecommendSchemaInputProvider = BCORecommendTableSchemaInputContainer.Provider;
export const useBCORecommendSchemaInput = BCORecommendTableSchemaInputContainer.useContainer;

const BCORecommendTableBondTraderManagementContainer = createContainer(
  (initialState?: {
    onCheck?: (props: { checked: boolean; item: GetConfig.TraderBondConfig; column: string }) => void;
    onOpenParsingModal: (traderID: string) => void;
  }) => {
    return {
      onCheck: initialState?.onCheck,
      onOpenParsingModal: initialState?.onOpenParsingModal
    };
  }
);

export const BCORecommendTableBondTraderManagementeProvider = BCORecommendTableBondTraderManagementContainer.Provider;
export const useBCORecommendTableBondTraderManagement = BCORecommendTableBondTraderManagementContainer.useContainer;

const BCORecommendTraderConfigListContainer = createContainer(() => {
  const [traderConfigs, setTraderConfigs] = useState<GetConfig.TraderBondConfig[]>([]);

  const refreshTraderConfig = useCallback(async () => {
    const res = await bcoBondRecommendGetConfig({});

    setTraderConfigs(res.list ?? []);
  }, []);

  return {
    traderConfigs,
    setTraderConfigs,
    refreshTraderConfig
  };
});

export const BCORecommendTraderConfigListProvider = BCORecommendTraderConfigListContainer.Provider;
export const useBCORecommendTraderConfigList = BCORecommendTraderConfigListContainer.useContainer;
