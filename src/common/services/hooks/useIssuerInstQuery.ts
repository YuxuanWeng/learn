import { CascaderOption } from '@fepkg/components/Cascader';
import { RequestConfig, RequestResponse } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { BaseDataIssuerInstGetAll } from '@fepkg/services/types/base-data/issuer-inst-get-all';
import { BankType, NcdSubtype, ProductType } from '@fepkg/services/types/enum';
import { QueryFunction, UseQueryOptions, useQuery } from '@tanstack/react-query';
import { groupBy } from 'lodash-es';
import { getAllIssuerInst } from '@/common/services/api/base-data/issuer-inst-all';
import { CONFIG_QUERY_STALE_TIME } from '@/components/Filter/constants/options';
import { useProductParams } from '@/layouts/Home/hooks';

const bank_type_list = [
  BankType.BankTypeSPD,
  BankType.BankTypeMCD,
  BankType.BankTypeSHD,
  BankType.BankTypeCCD,
  BankType.BankTypeFRD,
  BankType.BankTypeRRD,
  BankType.BankTypeRTD,
  BankType.BankTypeOTD
];

type ConfigFetchData = RequestResponse<BaseDataIssuerInstGetAll.Response>;

export enum IssuerCode {
  POB = 'POB',
  SCB = 'SCB',
  JCB = 'JCB',
  CCB = 'CCB',
  FCB = 'FCB',
  RB = 'RB',
  VIB = 'VIB',
  OTB = 'OTB'
}

const fatherNodesConfig = [
  { label: '政策性', value: IssuerCode.POB, depth: 1 },
  { label: '大行', value: IssuerCode.SCB, depth: 1 },
  { label: '股份制', value: IssuerCode.JCB, depth: 1 },
  { label: '城商行', value: IssuerCode.CCB, depth: 1 },
  { label: '外资行 ', value: IssuerCode.FCB, depth: 1 },
  { label: '农商', value: IssuerCode.RB, depth: 1 },
  { label: '村镇', value: IssuerCode.VIB, depth: 1 },
  { label: '其他', value: IssuerCode.OTB, depth: 1 }
];

export const BankTypeMapToIssuer: { [key in NcdSubtype]: string } = {
  [NcdSubtype.NcdSubtypeNone]: '',
  [NcdSubtype.NcdSubtypeSPB]: IssuerCode.POB,
  [NcdSubtype.NcdSubtypeMCB]: IssuerCode.SCB,
  [NcdSubtype.NcdSubtypeSHB]: IssuerCode.JCB,
  [NcdSubtype.NcdSubtypeCCB]: IssuerCode.CCB,
  [NcdSubtype.NcdSubtypeFRB]: IssuerCode.FCB,
  [NcdSubtype.NcdSubtypeRRB]: IssuerCode.RB,
  [NcdSubtype.NcdSubtypeRTB]: IssuerCode.VIB,
  [NcdSubtype.NcdSubtypeOTB]: IssuerCode.OTB
};

export const IssuerMapToBankType: { [key in IssuerCode]: NcdSubtype } = {
  [IssuerCode.POB]: NcdSubtype.NcdSubtypeSPB,
  [IssuerCode.SCB]: NcdSubtype.NcdSubtypeMCB,
  [IssuerCode.JCB]: NcdSubtype.NcdSubtypeSHB,
  [IssuerCode.CCB]: NcdSubtype.NcdSubtypeCCB,
  [IssuerCode.FCB]: NcdSubtype.NcdSubtypeFRB,
  [IssuerCode.RB]: NcdSubtype.NcdSubtypeRRB,
  [IssuerCode.VIB]: NcdSubtype.NcdSubtypeRTB,
  [IssuerCode.OTB]: NcdSubtype.NcdSubtypeOTB
};

const getFatherConfig = (productType?: ProductType) => {
  if (productType === ProductType.NCDP) {
    return fatherNodesConfig.filter(v => v.value !== IssuerCode.VIB && v.value !== IssuerCode.POB);
  }
  return fatherNodesConfig;
};

const getOriginData = (value: ConfigFetchData, productType?: ProductType): ConfigFetchData => {
  if (productType === ProductType.NCDP) {
    return {
      ...value,
      issuer_lite_list: value.issuer_lite_list?.filter(
        v => v.bank_type !== IssuerCode.VIB && v.bank_type !== IssuerCode.POB
      )
    };
  }
  return value;
};

const transformIssuerInst = (data: BaseDataIssuerInstGetAll.Response, productType?: ProductType) => {
  const issuerList = data?.issuer_lite_list ?? [];
  const issuerListGroupByBankType = groupBy(issuerList, 'bank_type');
  const options = getFatherConfig(productType);
  const nodes = options.map(v => ({
    ...v,
    children: (issuerListGroupByBankType[v.value] ?? []).map(children => ({
      label: children.issuer_name,
      value: children.inst_code,
      depth: 2
    }))
  }));

  return nodes;
};

export const useIssuerInstConfigQuery = <
  TSelectData = { origin: BaseDataIssuerInstGetAll.Response; nodes: CascaderOption[] }
>(
  requestConfig?: RequestConfig,
  queryOptions?: Omit<UseQueryOptions<ConfigFetchData, unknown, TSelectData>, 'queryKey' | 'queryFn'>
) => {
  const { productType } = useProductParams();
  const queryKey = [APIs.baseData.getAllIssuerInst, bank_type_list, productType] as const;
  const queryFn: QueryFunction<ConfigFetchData> = ({ signal }) => {
    return getAllIssuerInst({ bank_type_list }, { ...requestConfig, signal });
  };

  const query = useQuery<ConfigFetchData, unknown, TSelectData>({
    queryKey,
    staleTime: CONFIG_QUERY_STALE_TIME,
    ...queryOptions,
    queryFn,
    refetchOnWindowFocus: false,
    select:
      queryOptions?.select ??
      (data => {
        const nodes = transformIssuerInst(data, productType);
        return { origin: getOriginData(data, productType), nodes } as unknown as TSelectData;
      })
  });
  return query;
};
