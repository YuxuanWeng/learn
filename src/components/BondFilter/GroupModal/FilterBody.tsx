import cx from 'classnames';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { BankTypeMapToIssuer } from '@/common/services/hooks/useIssuerInstQuery';
import { formatGeneralFilter } from '@/pages/ProductPanel/providers/MainGroupProvider/utils';
import { GroupGeneralFilter } from '../GroupGeneralFilter';
import { GroupQuickFilterValue } from '../QuickFilter/types';
import ShowAll from '../ShowAll';
import { BondIssueInfoFilterValue, GeneralFilterValue } from '../types';
import { GroupBondIssueFilter } from './GroupBondIssueFilter';
import { GroupQuicklyFilter } from './GroupQuicklyFilter';
import { usePanelGroupConfig } from './provider';
import { useNcdSubtypeList } from './useNcdSubtypeList';

const productCls = {
  [ProductType.NCD]: {
    height: 'h-[316px]',
    gap: 'gap-3',
    px: ' px-3',
    quicklyFilterHeight: 'h-[52px]',
    showAllHeight: 'h-7'
  },
  [ProductType.BCO]: {
    height: 'h-[416px]',
    gap: 'gap-2',
    px: ' px-2',
    quicklyFilterHeight: 'h-[40px]',
    showAllHeight: 'h-6'
  }
};

export const FilterBody = () => {
  const { selectedGroup, productType, reset, updateGroupFilter } = usePanelGroupConfig();

  const getSubtypeList = useNcdSubtypeList();

  /** 更新发行人信息的时候，获取联动后的generalFilter的值 */
  const getGeneralFilter = (issuerIdList?: string[]) => {
    const ncdSubtypeList = getSubtypeList(issuerIdList ?? []);

    const generalFilter = { ...selectedGroup?.generalFilterValue, ncd_subtype_list: ncdSubtypeList };
    return formatGeneralFilter(generalFilter);
  };

  const handleFilterOnChange = (
    key: 'quicklyFilterValue' | 'generalFilterValue' | 'bondIssueInfoFilterValue',
    value?: GroupQuickFilterValue | GeneralFilterValue | BondIssueInfoFilterValue
  ) => {
    if (!selectedGroup?.groupId) return;

    let issuerIdList = selectedGroup.bondIssueInfoFilterValue?.issuer_id_list;

    if (key === 'generalFilterValue') {
      const currNcdSubtypeList = (value as GeneralFilterValue)?.ncd_subtype_list ?? [];

      const hasNcdSubtypeList = !!(value as GeneralFilterValue)?.ncd_subtype_list?.length;
      issuerIdList = hasNcdSubtypeList ? currNcdSubtypeList?.map(v => BankTypeMapToIssuer[v]) ?? [] : [];
    }

    if (key === 'bondIssueInfoFilterValue') {
      issuerIdList = (value as BondIssueInfoFilterValue).issuer_id_list;
    }

    const groupValue = { ...selectedGroup };
    if (key === 'generalFilterValue') {
      groupValue.generalFilterValue = value as GeneralFilterValue;
      groupValue.bondIssueInfoFilterValue = {
        ...groupValue.bondIssueInfoFilterValue,
        issuer_id_list: issuerIdList
      };
    }

    if (key === 'bondIssueInfoFilterValue') {
      groupValue.bondIssueInfoFilterValue = value as BondIssueInfoFilterValue;
      groupValue.generalFilterValue = getGeneralFilter((value as BondIssueInfoFilterValue).issuer_id_list);
    }

    if (key === 'quicklyFilterValue') {
      groupValue.quicklyFilterValue = value as GroupQuickFilterValue;
    }

    updateGroupFilter(groupValue);
  };

  return (
    <div
      className={cx(
        productCls[productType].height,
        productCls[productType].px,
        'rounded-lg bg-gray-800 border border-solid border-gray-600  items-center'
      )}
    >
      <div
        className={cx(
          productCls[productType].quicklyFilterHeight,
          'flex gap-3 items-center overflow-x-overlay max-w-[696px]'
        )}
      >
        <ShowAll
          onShowAll={reset}
          className={productCls[productType].showAllHeight}
        />

        <GroupQuicklyFilter
          quickFilterValue={selectedGroup?.quicklyFilterValue ?? {}}
          onChange={val => {
            handleFilterOnChange('quicklyFilterValue', val);
          }}
        />
      </div>
      <div className={cx('flex flex-col', productCls[productType].gap)}>
        <div className="component-dashed-x-600" />

        <div className={cx('overflow-x-overlay max-w-[680px] flex flex-col', productCls[productType].gap)}>
          <GroupGeneralFilter
            value={selectedGroup?.generalFilterValue}
            onChange={val => {
              handleFilterOnChange('generalFilterValue', val);
            }}
          />
        </div>

        <div className="component-dashed-x-600" />

        <GroupBondIssueFilter
          value={selectedGroup?.bondIssueInfoFilterValue}
          onChange={val => {
            handleFilterOnChange('bondIssueInfoFilterValue', val);
          }}
        />
      </div>
    </div>
  );
};
