import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { transformProductType } from '@fepkg/business/constants/map';
import { isNCD } from '@fepkg/business/utils/product';
import { Cascader, getBothDepthData } from '@fepkg/components/Cascader';
import { Combination } from '@fepkg/components/Combination';
import { Select } from '@fepkg/components/Select';
import { ProductType } from '@fepkg/services/types/enum';
import { useMemoizedFn } from 'ahooks';
import { DEFAULT_BOND_ISSUE_INFO_FILTER_VALUE } from '@/common/constants/filter';
import { useDistrictConfigQuery } from '@/common/services/hooks/useDistrictConfigQuery';
import { formatSelectOption, useInstInfoQuery } from '@/common/services/hooks/useInstInfoQuery';
import { useSwSectorConfigQuery } from '@/common/services/hooks/useSwSectorConfigQuery';
import { getYearConfig } from '@/common/utils/date';
import { IssuerInstFilter } from '../IssuerInstFilter';
import { BondIssueInfoFilterValue } from '../types';
import { IssuerModal } from './IssuerModal';
import { BondIssueFilterFilterInstance, BondIssueFilterFilterProps } from './types';
import { useTimeConsumingLog } from './useTimeConsumingLog';

const defaultPagination = { offset: 0, count: 10 };
const defaultSelectV1Props = {
  className: 'flex-shrink-0 w-[262px] h-7'
};
const defaultSelectProps = {
  className: 'flex-shrink-0 w-[262px] h-7',
  labelWidth: 60,
  placeholder: '不限',
  multiple: true,
  search: true,
  optionFilter: true,
  destroyOnClose: true
};

export const BondIssueFilter = forwardRef<BondIssueFilterFilterInstance, BondIssueFilterFilterProps>(
  ({ productType, loggerEnabled, value = DEFAULT_BOND_ISSUE_INFO_FILTER_VALUE, onChange, disabled }, ref) => {
    const isBCO = productType === ProductType.BCO;

    const { data: sectorConfig } = useSwSectorConfigQuery();
    const { data: districtConfig } = useDistrictConfigQuery();

    /** 发行人关键词 */
    const [issuerKeyword, setIssuerKeyword] = useState('');
    /** 担保人关键词 */
    const [warranterKeyword, setWarranterKeyword] = useState('');

    const { data: issuerConfig, isFetching: isIssuerConfigFetching } = useInstInfoQuery(
      issuerKeyword,
      'issuer',
      defaultPagination,
      undefined,
      { select: formatSelectOption }
    );
    const { data: warranterConfig, isFetching: isWarranterConfigFetching } = useInstInfoQuery(
      warranterKeyword,
      'warranter',
      defaultPagination,
      undefined,
      { select: formatSelectOption }
    );

    const yearConfig = useMemo(() => getYearConfig(), []);

    const reset = () => {
      setIssuerKeyword('');
      setWarranterKeyword('');
    };

    useImperativeHandle(ref, () => ({
      reset
    }));

    /** 更新债券发行信息筛选项 */
    const updateIssueInfoFilterValue = (val: BondIssueInfoFilterValue) => {
      onChange?.({ ...value, ...val });
    };

    const remarkPrefix = productType ? transformProductType(productType).en : '';

    useTimeConsumingLog({
      loggerEnabled,
      remark: `${remarkPrefix}-issuer`,
      keyword: issuerKeyword,
      fetching: isIssuerConfigFetching,
      total: issuerConfig?.total
    });

    useTimeConsumingLog({
      loggerEnabled,
      remark: `${remarkPrefix}-warranter`,
      keyword: warranterKeyword,
      fetching: isWarranterConfigFetching,
      total: warranterConfig?.total
    });

    const getIssuerSelectNode = useMemoizedFn(() => {
      if (isNCD(productType)) {
        return (
          <IssuerInstFilter
            disabled={disabled}
            value={value.issuer_id_list ?? []}
            onChange={val => {
              onChange?.({ ...value, issuer_id_list: [...val] });
            }}
          />
        );
      }

      return (
        <Select
          label="发行人"
          disabled={disabled}
          {...defaultSelectProps}
          className={isBCO ? 'flex-shrink-0 w-[230px] !bg-gray-700' : defaultSelectV1Props.className}
          optionFilter={false}
          options={issuerConfig?.options ?? []}
          inputValue={issuerKeyword}
          selectedOptions={(value?.issuer_list?.filter(issuer => !!issuer) as { label: string; value: string }[]) ?? []}
          value={value.issuer_id_list ?? []}
          onInputChange={setIssuerKeyword}
          onChange={(val, _, __, opts) => {
            updateIssueInfoFilterValue({ issuer_id_list: val, issuer_list: opts });
          }}
        />
      );
    });

    return (
      <div className="flex items-center h-7 gap-3">
        {productType !== ProductType.NCD && (
          <Cascader
            label="行业"
            disabled={disabled}
            {...defaultSelectV1Props}
            options={sectorConfig ?? []}
            value={[...(value.sw_sector_list ?? []), ...(value.sw_subsector_list ?? [])]}
            onChange={(_, val = []) => {
              const [sw_sector_list, sw_subsector_list] = getBothDepthData(val);
              updateIssueInfoFilterValue({ sw_sector_list, sw_subsector_list });
            }}
          />
        )}

        <Select
          label="地区"
          disabled={disabled}
          {...defaultSelectProps}
          options={districtConfig ?? []}
          value={value.province_list ?? []}
          onChange={val => {
            updateIssueInfoFilterValue({ province_list: val });
          }}
        />
        <Select
          label="年份"
          disabled={disabled}
          {...defaultSelectProps}
          options={yearConfig}
          value={value.year_list ?? []}
          onChange={val => {
            updateIssueInfoFilterValue({ year_list: val });
          }}
        />

        {/* 信用债才需要发行人识别 */}
        {isBCO ? (
          <Combination
            size="sm"
            background="prefix700-suffix600"
            suffixButton
            disabled={disabled}
            prefixNode={getIssuerSelectNode()}
            suffixNode={
              <IssuerModal
                disabled={disabled}
                value={value}
                updateIssueInfoFilterValue={updateIssueInfoFilterValue}
              />
            }
          />
        ) : (
          getIssuerSelectNode()
        )}

        <Select
          label="担保人"
          disabled={disabled}
          {...defaultSelectProps}
          optionFilter={false}
          options={warranterConfig?.options ?? []}
          inputValue={warranterKeyword}
          selectedOptions={(value?.warranter_list?.filter(Boolean) as { label: string; value: string }[]) ?? []}
          value={value.warranter_id_list ?? []}
          onInputChange={setWarranterKeyword}
          onChange={(val, _, __, opts) => {
            updateIssueInfoFilterValue({ warranter_id_list: val, warranter_list: opts });
          }}
        />
      </div>
    );
  }
);
