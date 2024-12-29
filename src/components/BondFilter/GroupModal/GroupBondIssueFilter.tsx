import { useMemo, useState } from 'react';
import cx from 'classnames';
import { Cascader, getBothDepthData } from '@fepkg/components/Cascader';
import { Select } from '@fepkg/components/Select';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { useDistrictConfigQuery } from '@/common/services/hooks/useDistrictConfigQuery';
import { formatSelectOption, useInstInfoQuery } from '@/common/services/hooks/useInstInfoQuery';
import { useSwSectorConfigQuery } from '@/common/services/hooks/useSwSectorConfigQuery';
import { getYearConfig } from '@/common/utils/date';
import { useProductParams } from '@/layouts/Home/hooks';
import { BondIssueFilterFilterProps } from '../BondIssueFilter/types';
import { IssuerInstFilter } from '../IssuerInstFilter';
import { BondIssueInfoFilterValue } from '../types';

const defaultPagination = { offset: 0, count: 10 };

const defaultSelectProps = {
  className: 'flex-shrink-0',
  labelWidth: 72,
  placeholder: '不限',
  multiple: true,
  search: true,
  optionFilter: true,
  destroyOnClose: true
};

const defaultSelectV1Props = {
  className: 'flex-shrink-0 w-[218px] h-6'
};

const productCls = {
  [ProductType.NCD]: { gap: 'gap-3', height: '!h-7', width: '!max-w-[calc(50%_-_6px)] !w-[calc(50%_-_6px)]' },
  [ProductType.BCO]: { gap: 'gap-2', height: '!h-6', width: '!max-w-[218px] !w-[218px]' }
};

export const GroupBondIssueFilter = ({
  value,
  disabled,
  onChange
}: Omit<BondIssueFilterFilterProps, 'productType'>) => {
  const { data: districtConfig } = useDistrictConfigQuery();
  const { data: sectorConfig } = useSwSectorConfigQuery();
  const { productType } = useProductParams();

  /** 担保人关键词 */
  const [warranterKeyword, setWarranterKeyword] = useState('');

  const { data: warranterConfig } = useInstInfoQuery(warranterKeyword, 'warranter', defaultPagination, undefined, {
    select: formatSelectOption
  });

  const yearConfig = useMemo(() => getYearConfig(), []);

  const updateIssueInfoFilterValue = (val: BondIssueInfoFilterValue) => {
    onChange?.({ ...value, ...val });
  };

  const warranterList = value?.warranter_list?.filter(Boolean) ?? [];

  return (
    <div className={cx(productCls[productType].gap, 'flex flex-col w-[672px]')}>
      <div className="flex gap-3">
        {productType === ProductType.BCO && (
          <Cascader
            label="行业"
            disabled={disabled}
            {...defaultSelectV1Props}
            options={sectorConfig ?? []}
            value={[...(value?.sw_sector_list ?? []), ...(value?.sw_subsector_list ?? [])]}
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
          className={cx(defaultSelectProps.className, productCls[productType].height, productCls[productType].width)}
          options={districtConfig ?? []}
          value={value?.province_list ?? []}
          onChange={val => {
            updateIssueInfoFilterValue({ province_list: val });
          }}
        />
        <Select
          label="年份"
          disabled={disabled}
          {...defaultSelectProps}
          className={cx(defaultSelectProps.className, productCls[productType].height, productCls[productType].width)}
          options={yearConfig}
          value={value?.year_list ?? []}
          onChange={val => {
            updateIssueInfoFilterValue({ year_list: val });
          }}
        />
      </div>
      <div className="flex gap-3">
        <IssuerInstFilter
          className={cx(defaultSelectProps.className, productCls[productType].width, productCls[productType].height)}
          disabled={disabled}
          value={value?.issuer_id_list ?? []}
          onChange={val => {
            onChange?.({ ...value, issuer_id_list: [...val] });
          }}
        />
        <Select
          label="担保人"
          disabled={disabled}
          {...defaultSelectProps}
          className={cx(defaultSelectProps.className, productCls[productType].width, productCls[productType].height)}
          optionFilter={false}
          options={warranterConfig?.options ?? []}
          inputValue={warranterKeyword}
          selectedOptions={warranterList}
          value={value?.warranter_id_list ?? []}
          onInputChange={setWarranterKeyword}
          onChange={(val, _, __, opts) => {
            updateIssueInfoFilterValue({ warranter_id_list: val, warranter_list: opts });
          }}
        />
      </div>
    </div>
  );
};
