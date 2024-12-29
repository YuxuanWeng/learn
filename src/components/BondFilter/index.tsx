import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import cx from 'classnames';
import { isNCD } from '@fepkg/business/utils/product';
import { Button } from '@fepkg/components/Button';
import { Combination } from '@fepkg/components/Combination';
import { IconFilter, IconFilterFilled, IconManage } from '@fepkg/icon-park-react';
import { ProductType } from '@fepkg/services/types/enum';
import { useMemoizedFn } from 'ahooks';
import { useSetAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import { debounce, uniq } from 'lodash-es';
import {
  DEFAULT_BOND_ISSUE_INFO_FILTER_VALUE,
  DEFAULT_CUSTOM_SORTING_VALUE,
  DEFAULT_GENERAL_FILTER_VALUE,
  DEFAULT_QUICK_FILTER_VALUE
} from '@/common/constants/filter';
import { BankTypeMapToIssuer, useIssuerInstConfigQuery } from '@/common/services/hooks/useIssuerInstQuery';
import { BondIssueFilter } from '@/components/BondFilter/BondIssueFilter';
import { BondIssueFilterFilterInstance } from '@/components/BondFilter/BondIssueFilter/types';
import { QuickFilter } from '@/components/BondFilter/QuickFilter';
import { QuickFilterValue } from '@/components/BondFilter/QuickFilter/types';
import { useProductParams } from '@/layouts/Home/hooks';
import { useUpdateGlobalSearchValue } from '@/pages/ProductPanel/atoms/global-search';
import { tablePageAtomMap, tableSelectedRowKeysAtomMap } from '@/pages/ProductPanel/atoms/table';
import { useResetTablePage } from '@/pages/ProductPanel/hooks/useResetTablePage';
import { useResetTableSorter } from '@/pages/ProductPanel/hooks/useResetTableSorter';
import { useMainGroupData } from '@/pages/ProductPanel/providers/MainGroupProvider';
import { GroupStruct } from '@/pages/ProductPanel/providers/MainGroupProvider/types';
import { formatGeneralFilter } from '@/pages/ProductPanel/providers/MainGroupProvider/utils';
import { useProductPanel } from '@/pages/ProductPanel/providers/PanelProvider';
import { BCOGeneralFilter } from './BCOGeneralFilter';
import { BNCGeneralFilter } from './BNCGeneralFilter';
import { IssuerModal } from './BondIssueFilter/IssuerModal';
import { CustomSorting } from './CustomSorting';
import { CustomSortFieldOptions } from './CustomSorting/types';
import { GroupConfigModal } from './GroupModal';
import { useNcdSubtypeList } from './GroupModal/useNcdSubtypeList';
import { IssuerInstFilter } from './IssuerInstFilter';
import { NCDAdvancedFilter } from './NCDAdvancedFilter';
import { NCDFiltersParsingInput } from './NCDFiltersParsing';
import { NCDFiltersParsingCallBack } from './NCDFiltersParsing/types';
import { NCDGeneralFilter } from './NCDGeneralFilter';
import { NCDPGeneralFilter } from './NCDPGeneralFilter';
import ShowAll from './ShowAll';
import { BondFilterInstance, BondIssueInfoFilterValue, GeneralFilterInstance, GeneralFilterValue } from './types';
import { getQuicklyOptionKeys } from './utils';

type BondFilterProps = {
  groupValue: GroupStruct;
  onChange?: (value: GroupStruct) => void;
  autoSaveCustomSorting?: (value: CustomSortFieldOptions) => void;
  reset?: () => void;
  switchMode?: () => void;
};

export const BondFilter = forwardRef<BondFilterInstance, BondFilterProps>(
  ({ groupValue, onChange, autoSaveCustomSorting, reset, switchMode }, ref) => {
    const { productType } = useProductParams();
    const advanceMode = groupValue.isAdvanceMode === true;
    const [groupFilterVisible, setGroupFilterVisible] = useState(false);

    const { activeTableKey, groupStoreKey, sidebarOpen } = useProductPanel();
    const { delayedActiveGroupState: activeGroup } = useMainGroupData();

    const getSubtypeList = useNcdSubtypeList();

    const [updateGlobalSearch] = useUpdateGlobalSearchValue(groupStoreKey, useResetTablePage);
    const {
      groupId,
      quickFilter: quickFilterValue = DEFAULT_QUICK_FILTER_VALUE,
      advanceOuterQuickFilter: advanceQuickFilterValue = DEFAULT_QUICK_FILTER_VALUE,
      generalFilter: generalFilterValue = DEFAULT_GENERAL_FILTER_VALUE,
      bondIssueInfoFilter: bondIssueInfoFilterValue = DEFAULT_BOND_ISSUE_INFO_FILTER_VALUE,
      customSorting: customSortingValue = DEFAULT_CUSTOM_SORTING_VALUE
    } = groupValue;

    const [quickFilterValueInner, setQuickFilterValueInner] = useState<QuickFilterValue>(
      quickFilterValue ?? DEFAULT_QUICK_FILTER_VALUE
    );

    const [advanceQuickFilterValueInner, setAdvanceQuickFilterValueInner] = useState<QuickFilterValue>(
      advanceQuickFilterValue ?? DEFAULT_QUICK_FILTER_VALUE
    );

    const [generalFilterValueInner, setGeneralFilterValueInner] = useState<GeneralFilterValue>(
      generalFilterValue ?? DEFAULT_GENERAL_FILTER_VALUE
    );

    const debounceChange = useMemo(
      () =>
        debounce(
          (
            key: 'quickFilter' | 'generalFilter' | 'advanceOuterQuickFilter',
            val: QuickFilterValue | GeneralFilterValue
          ) => {
            onChange?.({ ...groupValue, [key]: val });
          },
          100
        ),
      [groupValue, onChange]
    );

    const wrapperQuickFilterValueChange = (val: QuickFilterValue) => {
      if (advanceMode) {
        setAdvanceQuickFilterValueInner(val);
        debounceChange('advanceOuterQuickFilter', val);
      } else {
        setQuickFilterValueInner(val);
        debounceChange('quickFilter', val);
      }
    };

    const wrapperGeneralFilterChange = (val: GeneralFilterValue) => {
      setGeneralFilterValueInner(val);
      debounceChange('generalFilter', val);
    };

    /** 清空面板至空状态(针对快捷筛选 和 一般筛选) */
    const clearFilter = useMemoizedFn(() => {
      setQuickFilterValueInner(DEFAULT_QUICK_FILTER_VALUE);
      setGeneralFilterValueInner(DEFAULT_GENERAL_FILTER_VALUE);
    });

    /** 重置面板至默认状态(针对快捷筛选 和 一般筛选) */
    const resetFilter = useMemoizedFn(
      (val: {
        quickFilter?: QuickFilterValue | undefined;
        advanceOuterQuickFilter?: QuickFilterValue;
        generalFilter?: GeneralFilterValue | undefined;
      }) => {
        if (advanceMode) {
          setAdvanceQuickFilterValueInner({ ...DEFAULT_QUICK_FILTER_VALUE, ...val.advanceOuterQuickFilter });
        } else {
          setQuickFilterValueInner({ ...DEFAULT_QUICK_FILTER_VALUE, ...val.quickFilter });
        }
        setGeneralFilterValueInner(val.generalFilter ?? DEFAULT_GENERAL_FILTER_VALUE);
      }
    );

    /** 重置智能排序 & 自定义排序 */
    const resetQuickFilterSorting = () => {
      wrapperQuickFilterValueChange({ ...quickFilterValueInner, intelligence_sorting: false, custom_sorting: false });
    };

    useImperativeHandle(ref, () => ({
      clearFilter,
      resetQuickFilterSorting,
      resetFilter
    }));

    const resetActiveTablePage = useResetAtom(useMemo(() => tablePageAtomMap[activeTableKey], [activeTableKey]));
    const setActiveTableSelectedRowKeys = useSetAtom(
      useMemo(() => tableSelectedRowKeysAtomMap[activeTableKey], [activeTableKey])
    );

    const bondIssueFilterRef = useRef<BondIssueFilterFilterInstance>(null);
    const bcoGeneralFilterRef = useRef<GeneralFilterInstance>(null);
    const bncGeneralFilterRef = useRef<GeneralFilterInstance>(null);
    const ncdGeneralFilterRef = useRef<GeneralFilterInstance>(null);
    const ncdpGeneralFilterRef = useRef<GeneralFilterInstance>(null);

    const resetTablePage = useResetTablePage();
    const resetTableSorter = useResetTableSorter();

    const { data } = useIssuerInstConfigQuery();

    const issuerLiteList = data?.origin.issuer_lite_list ?? [];
    const instCodes = new Set(issuerLiteList.map(v => v.inst_code) ?? []);

    const resetParams = () => {
      // 清空当前表格分页
      resetActiveTablePage();
      // 清空表格当前选择状态
      setActiveTableSelectedRowKeys(new Set<string>());

      reset?.();

      clearFilter();

      // 清空组件内部的状态
      bondIssueFilterRef.current?.reset();
    };

    const setQuickFilterValue = (val: QuickFilterValue) => {
      wrapperQuickFilterValueChange(val);
    };

    const setGeneralFilterValue = (val: GeneralFilterValue) => {
      wrapperGeneralFilterChange(val);
    };

    /** 更新发行人信息的时候，获取联动后的generalFilter的值 */
    const getGeneralFilter = (issuerIdList?: string[]) => {
      const ncdSubtypeList = getSubtypeList(issuerIdList ?? []);
      const generalFilter = { ...groupValue.generalFilter, ncd_subtype_list: ncdSubtypeList };

      return formatGeneralFilter(generalFilter);
    };

    const setBondIssueInfoFilterValue = (bondIssueInfoFilter: BondIssueInfoFilterValue) => {
      const generalFilter = getGeneralFilter(bondIssueInfoFilter.issuer_id_list);
      setGeneralFilterValueInner(generalFilter);
      onChange?.({
        ...groupValue,
        generalFilter: isNCD(productType) ? generalFilter : groupValue.generalFilter,
        bondIssueInfoFilter
      });
    };

    const optionKeys = getQuicklyOptionKeys(productType, activeTableKey, advanceMode);

    const [customSortingVisible, setCustomSortingVisible] = useState(false);

    const updateIssueInfoFilterValue = (val: BondIssueInfoFilterValue) => {
      const generalFilter = getGeneralFilter(val.issuer_id_list ?? []);
      setGeneralFilterValueInner(generalFilter);
      onChange?.({ ...groupValue, generalFilter, bondIssueInfoFilter: val });
    };

    const handleQuickFilterChange = (val: QuickFilterValue) => {
      setQuickFilterValue(val);
      if (val.intelligence_sorting || val.custom_sorting) resetTableSorter(groupId);
      resetTablePage();
    };

    /** 发行人更新 */
    const handleIssuerInstFilterChange = (
      issuerIds: Set<string>,
      parseIngGeneralFilter?: GeneralFilterValue,
      /** 是否需要重置其余筛选项 */
      resetOtherFilter?: boolean
    ) => {
      /** 当识别出来筛选项时，需要清空其余细分筛选和所有快捷筛选 */
      const generalFilter = getGeneralFilter([...issuerIds]);
      const mergeGeneralFilter = resetOtherFilter
        ? {
            ...DEFAULT_GENERAL_FILTER_VALUE,
            ...parseIngGeneralFilter,
            ncd_subtype_list: generalFilter.ncd_subtype_list
          }
        : generalFilter;

      setGeneralFilterValueInner(formatGeneralFilter(mergeGeneralFilter));

      const quicklyFilterValue = resetOtherFilter ? DEFAULT_QUICK_FILTER_VALUE : groupValue.quickFilter;

      if (quicklyFilterValue) {
        if (advanceMode) {
          setAdvanceQuickFilterValueInner(quicklyFilterValue);
        } else {
          setQuickFilterValueInner(quicklyFilterValue);
        }
      }

      const bondIssueInfoFilter =
        resetOtherFilter && issuerIds.size > 0
          ? { ...DEFAULT_BOND_ISSUE_INFO_FILTER_VALUE, issuer_id_list: uniq([...issuerIds]) }
          : { ...groupValue.bondIssueInfoFilter, issuer_id_list: uniq([...issuerIds]) };

      onChange?.({
        ...groupValue,
        quickFilter: quicklyFilterValue,
        generalFilter: formatGeneralFilter(mergeGeneralFilter),
        bondIssueInfoFilter
      });
    };

    /** 细分债更新 */
    const handleGeneralFilterChange = (
      val: GeneralFilterValue,
      defaultIssuerIdList?: string[],
      /** 是否需要重置快捷筛选和其余细分筛选 */
      resetFilterValue?: boolean
    ) => {
      const hasNcdSubtypeList = !!val.ncd_subtype_list?.length;

      /** 找到银行细分债对应的发行人 */
      const bankIssuerIdList = hasNcdSubtypeList ? val.ncd_subtype_list?.map(v => BankTypeMapToIssuer[v]) ?? [] : [];

      /** 本次更新联动的发行人 */
      const issuerIdList = uniq([...bankIssuerIdList, ...(defaultIssuerIdList ?? [])]);

      /** 计算出本次需要重置的BondIssuerFilter */
      const bondIssueInfoFilter = resetFilterValue
        ? { ...DEFAULT_BOND_ISSUE_INFO_FILTER_VALUE, issuer_id_list: issuerIdList }
        : { ...groupValue.bondIssueInfoFilter, issuer_id_list: issuerIdList };

      const generalFilter = formatGeneralFilter(val);
      const quicklyFilterValue = resetFilterValue ? DEFAULT_QUICK_FILTER_VALUE : groupValue.quickFilter;

      /** 当识别出来筛选项时，需要清空其余细分筛选和所有快捷筛选 */
      const mergeGeneralFilter = resetFilterValue
        ? { ...DEFAULT_GENERAL_FILTER_VALUE, ...generalFilter }
        : { ...groupValue.generalFilter, ...generalFilter };

      if (quicklyFilterValue) {
        // 更新内部quicklyFilterValue状态，用于实时渲染
        if (advanceMode) {
          setAdvanceQuickFilterValueInner(quicklyFilterValue);
        } else {
          setQuickFilterValueInner(quicklyFilterValue);
        }
      }

      if (isNCD(productType)) {
        // 处理银行细分债和发行人的联动逻辑

        setGeneralFilterValueInner(mergeGeneralFilter);
        onChange?.({
          ...groupValue,
          quickFilter: quicklyFilterValue,
          generalFilter: mergeGeneralFilter,
          bondIssueInfoFilter
        });
      } else {
        setGeneralFilterValue(mergeGeneralFilter);
        resetTablePage();
      }
    };

    const handleParsing: NCDFiltersParsingCallBack = (g, b, i) => {
      if (i) updateGlobalSearch({ groupId: activeGroup?.groupId, inputFilter: i });

      if (g && !b?.issuer_id_list?.length) {
        handleGeneralFilterChange(g, [], true);
      }

      if (b?.issuer_id_list?.length && !g?.ncd_subtype_list?.length) {
        handleIssuerInstFilterChange(new Set(b.issuer_id_list ?? []), g, true);
      }

      if (g?.ncd_subtype_list?.length && b?.issuer_id_list?.length) {
        // 处理联动逻辑
        handleGeneralFilterChange(g, b.issuer_id_list, true);
      }
    };

    const showAdvFilterBtn = productType === ProductType.NCD || productType === ProductType.BCO;

    return (
      <>
        <div className="flex items-center gap-3 select-none ">
          {!advanceMode ? (
            <ShowAll onShowAll={resetParams} />
          ) : (
            <Button
              type="gray"
              ghost
              icon={<IconManage />}
              onClick={() => {
                setGroupFilterVisible(!groupFilterVisible);
              }}
              className="h-7"
            >
              分组配置
            </Button>
          )}

          <QuickFilter
            optionKeys={optionKeys}
            quickFilterValue={advanceMode ? advanceQuickFilterValueInner : quickFilterValueInner}
            onCustomSort={() => {
              setCustomSortingVisible(true);
            }}
            onChange={handleQuickFilterChange}
          />
        </div>

        {productType === ProductType.BCO && !advanceMode && (
          <BCOGeneralFilter
            ref={bcoGeneralFilterRef}
            value={generalFilterValueInner}
            onChange={handleGeneralFilterChange}
          />
        )}

        {productType === ProductType.BNC && (
          <BNCGeneralFilter
            ref={bncGeneralFilterRef}
            value={generalFilterValueInner}
            onChange={handleGeneralFilterChange}
          />
        )}

        {productType === ProductType.NCD && !advanceMode && <NCDFiltersParsingInput onChange={handleParsing} />}

        {productType === ProductType.NCD && !advanceMode && (
          <NCDGeneralFilter
            ref={ncdGeneralFilterRef}
            value={generalFilterValueInner}
            onChange={handleGeneralFilterChange}
          />
        )}

        {productType === ProductType.NCDP && (
          <div className="flex gap-[6px]">
            <NCDPGeneralFilter
              ref={ncdpGeneralFilterRef}
              value={generalFilterValueInner}
              onChange={handleGeneralFilterChange}
            />
            <Combination
              size="sm"
              background="prefix700-suffix600"
              suffixButton
              prefixNode={
                <IssuerInstFilter
                  className="!w-[230px]"
                  value={bondIssueInfoFilterValue.issuer_id_list ?? []}
                  onChange={handleIssuerInstFilterChange}
                />
              }
              suffixNode={
                <IssuerModal
                  onFilter={val => val.filter(v => instCodes.has(v.inst_code))}
                  value={bondIssueInfoFilterValue}
                  updateIssueInfoFilterValue={updateIssueInfoFilterValue}
                />
              }
            />
          </div>
        )}

        {productType !== ProductType.NCDP && !advanceMode && (
          <BondIssueFilter
            ref={bondIssueFilterRef}
            loggerEnabled
            productType={productType}
            value={bondIssueInfoFilterValue}
            onChange={val => {
              setBondIssueInfoFilterValue(val);
              resetTablePage();
            }}
          />
        )}

        <CustomSorting
          visible={customSortingVisible}
          onCancel={() => setCustomSortingVisible(false)}
          options={customSortingValue}
          onConfirm={autoSaveCustomSorting}
        />

        {showAdvFilterBtn && (
          <GroupConfigModal
            visible={groupFilterVisible}
            onClose={() => {
              setGroupFilterVisible(false);
            }}
          />
        )}

        {showAdvFilterBtn && (
          <div className={cx('w-11 pl-1 pr-3 bg-gray-800 fixed', sidebarOpen ? 'right-[160px]' : 'right-0')}>
            <Button.Icon
              key={`${advanceMode}`}
              className="w-7 h-7 t-[100px]"
              icon={advanceMode ? <IconFilter /> : <IconFilterFilled />}
              onClick={switchMode}
              tooltip={{
                content: advanceMode ? '切换至普通筛选' : '切换至高级筛选',
                delay: { open: 600 }
              }}
            />
          </div>
        )}

        {productType === ProductType.NCD && advanceMode && <NCDAdvancedFilter />}

        {productType === ProductType.BCO && advanceMode && <NCDAdvancedFilter />}
      </>
    );
  }
);
