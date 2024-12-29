import { useTeamCollaboration } from '@/common/hooks/useTeamCollaboration';
import { useMarketDealQuery } from '@/common/services/hooks/useMarketDealQuery';
import { miscStorage } from '@/localdb/miscStorage';

export const usePanelData = ({ productType, pageSize, isMy }) => {
  const userId = miscStorage.userInfo?.user_id;

  const { currProductTypeTeamBrokerIdList } = useTeamCollaboration();

  const filterParams = {
    productType,
    quick_filter: { intelligence_sorting: false },
    intelligence_sorting: {},
    table_related_filter: { broker_id_list: isMy && userId ? [userId] : undefined },
    followed_broker_id_list: currProductTypeTeamBrokerIdList,
    input_filter: {},
    general_filter: {},
    offset: 0,
    count: pageSize
  };
  const requestConfig = { interval: 500 };
  const { data } = useMarketDealQuery({ productType, filterParams, requestConfig });

  return { data };
};
