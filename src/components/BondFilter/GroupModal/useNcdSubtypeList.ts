import { IssuerCode, useIssuerInstConfigQuery } from '@/common/services/hooks/useIssuerInstQuery';
import { getNcdSubtypeList } from '../utils';

// 发行人对应的细分类型列表
const issuerCodes = new Set(Object.values(IssuerCode));

export const useNcdSubtypeList = () => {
  const { data: issuerList } = useIssuerInstConfigQuery();

  const getSubtypeList = (issuerIdList: string[]) => {
    return getNcdSubtypeList(issuerIdList ?? [], issuerList?.origin.issuer_lite_list ?? [], issuerCodes);
  };
  return getSubtypeList;
};
