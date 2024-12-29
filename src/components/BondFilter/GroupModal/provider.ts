import { useMemo, useRef, useState } from 'react';
import { message } from '@fepkg/components/Message';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { BroadcastChannelEnum } from 'app/types/broad-cast';
import { uniq } from 'lodash-es';
import { createContainer } from 'unstated-next';
import { useImmer } from 'use-immer';
import {
  DEFAULT_BOND_ISSUE_INFO_FILTER_VALUE,
  DEFAULT_GENERAL_FILTER_VALUE,
  DEFAULT_QUICK_FILTER_VALUE
} from '@/common/constants/filter';
import { deleteFilterGroup } from '@/common/services/api/user/user-setting-delete-filter-group';
import { upsertFilterGroup } from '@/common/services/api/user/user-setting-upsert-filter-group';
import { FilterGroupsStruct, useAdvanceGroupQuery } from '@/common/services/hooks/useAdvanceGroupQuery';
import { BankTypeMapToIssuer } from '@/common/services/hooks/useIssuerInstQuery';
import { useProductParams } from '@/layouts/Home/hooks';
import { formatGeneralFilter } from '@/pages/ProductPanel/providers/MainGroupProvider/utils';
import { NCDFiltersParsingCallBack } from '../NCDFiltersParsing/types';
import { GeneralFilterValue } from '../types';
import { useNcdSubtypeList } from './useNcdSubtypeList';

const DEFAULT_DESC = {
  generalFilterValue: DEFAULT_GENERAL_FILTER_VALUE,
  quicklyFilterValue: DEFAULT_QUICK_FILTER_VALUE,
  bondIssueInfoFilterValue: DEFAULT_BOND_ISSUE_INFO_FILTER_VALUE
};

export const PanelGroupConfigContainer = createContainer(() => {
  const groupContainerRef = useRef<HTMLDivElement>(null);
  const [addGroupModalVisible, setAddGroupModalVisible] = useState(false);

  const { productType } = useProductParams();

  const targetProductType = productType === ProductType.BCO ? ProductType.BCO : undefined;

  const { data, refetch } = useAdvanceGroupQuery();

  const getSubtypeList = useNcdSubtypeList();

  const [groups, setGroups] = useImmer<FilterGroupsStruct[]>(data ?? []);

  const [selected, setSelected] = useState<string | undefined>(groups?.[0]?.groupId);

  const selectedGroup = useMemo(() => groups.find(v => v.groupId === selected), [groups, selected]);

  const { emit } = window.Broadcast;

  const emitGroupChange = () => {
    emit(BroadcastChannelEnum.BROADCAST_ADVANCE_GROUP_CHANGE);
  };

  /** 命名校验 */
  const check = (val?: string, isAdd = false) => {
    if (!val) {
      message.error('分组名不能为空');
      return false;
    }
    if (groups.filter(i => (isAdd ? i : i.groupId !== selected)).some(v => v.groupName === val)) {
      message.error('当前分组名已存在');
      return false;
    }
    return true;
  };

  /** 新增分组 */
  const addGroup = async (val?: string) => {
    if (!val) return false;
    if (!check(val, true)) return false;
    await upsertFilterGroup({
      product_type: targetProductType,
      filter_group: { group_name: val, desc: JSON.stringify(DEFAULT_DESC) }
    });
    const { data: newGroup } = await refetch();
    setGroups(newGroup ?? []);
    if (!selected) setSelected(newGroup?.[0].groupId);
    refetch();
    emitGroupChange();
    return true;
  };

  /** 删除分组 */
  const deleteGroup = async (groupId: string) => {
    if (groupId === selected) {
      const index = groups.findIndex(v => v.groupId === groupId);

      if (index && index >= 1) setSelected(groups[index - 1].groupId);
      else if (groups.length === 1 && groups[0].groupId === groupId) setSelected(void 0);
      else setSelected(groups[0].groupId);
    }

    // 乐观更新
    const newGroups = groups.filter(v => v.groupId !== groupId);
    setGroups(newGroups);

    await deleteFilterGroup({ product_type: targetProductType, group_id: groupId });
    refetch();
    emitGroupChange();
  };

  /** 更新分组名 */
  const updateGroupName = async (groupId: string, name = '') => {
    if (!check(name)) return false;

    // 乐观更新
    const newGroups = groups.map(v => {
      if (v.groupId === groupId) return { ...v, groupName: name };
      return v;
    });
    setGroups(newGroups);

    await upsertFilterGroup({ product_type: targetProductType, filter_group: { group_id: groupId, group_name: name } });
    refetch();
    emitGroupChange();
    return true;
  };

  const updateGroupFilter = async (value: FilterGroupsStruct) => {
    const index = groups.findIndex(v => v.groupId === value.groupId);
    if (index < 0) return;

    // 乐观更新
    setGroups(draft => {
      draft[index] = {
        ...draft[index],
        bondIssueInfoFilterValue: value.bondIssueInfoFilterValue,
        quicklyFilterValue: value.quicklyFilterValue,
        generalFilterValue: value.generalFilterValue
      };
      return draft;
    });

    await upsertFilterGroup({
      product_type: targetProductType,
      filter_group: {
        group_id: value.groupId,
        desc: JSON.stringify({
          bondIssueInfoFilterValue: value.bondIssueInfoFilterValue,
          quicklyFilterValue: value.quicklyFilterValue,
          generalFilterValue: value.generalFilterValue
        })
      }
    });

    refetch();
    emitGroupChange();
  };

  /** 清空条件 */
  const reset = () => {
    if (!selectedGroup?.groupId) return;
    updateGroupFilter({
      ...selectedGroup,
      generalFilterValue: DEFAULT_GENERAL_FILTER_VALUE,
      quicklyFilterValue: DEFAULT_QUICK_FILTER_VALUE,
      bondIssueInfoFilterValue: DEFAULT_BOND_ISSUE_INFO_FILTER_VALUE
    });
  };

  /** 更新发行人信息的时候，获取联动后的generalFilter的值 */
  const getGeneralFilter = (issuerIdList?: string[]) => {
    const ncdSubtypeList = getSubtypeList(issuerIdList ?? []);
    const generalFilter = { ...selectedGroup?.generalFilterValue, ncd_subtype_list: ncdSubtypeList };
    return formatGeneralFilter(generalFilter);
  };

  const handleGeneralFilterChange = (val: GeneralFilterValue, defaultIssuerIdList?: string[]) => {
    if (!selectedGroup?.groupId) return;
    const generalFilter = formatGeneralFilter(val);

    const hasNcdSubtypeList = !!val.ncd_subtype_list?.length;

    /** 找到银行细分债对应的发行人 */
    const bankIssuerIdList = hasNcdSubtypeList ? val.ncd_subtype_list?.map(v => BankTypeMapToIssuer[v]) ?? [] : [];

    /** 本次更新联动的发行人 */
    const issuerIdList = uniq([...bankIssuerIdList, ...(defaultIssuerIdList ?? [])]);

    /** 计算出本次需要重置的BondIssuerFilter */
    const bondIssueInfoFilterValue = { ...DEFAULT_BOND_ISSUE_INFO_FILTER_VALUE, issuer_id_list: issuerIdList };

    /** 当识别出来筛选项时，需要清空其余细分筛选和所有快捷筛选 */
    const mergeGeneralFilter = { ...DEFAULT_GENERAL_FILTER_VALUE, ...generalFilter };

    updateGroupFilter({
      ...selectedGroup,
      quicklyFilterValue: DEFAULT_QUICK_FILTER_VALUE,
      generalFilterValue: mergeGeneralFilter,
      bondIssueInfoFilterValue
    });
  };

  const handleIssuerInstFilterChange = (issuerIds: Set<string>, parseIngGeneralFilter?: GeneralFilterValue) => {
    if (!selectedGroup?.groupId) return;

    /** 当识别出来筛选项时，需要清空其余细分筛选和所有快捷筛选 */
    const generalFilter = getGeneralFilter([...issuerIds]);
    const mergeGeneralFilter = {
      ...DEFAULT_GENERAL_FILTER_VALUE,
      ...parseIngGeneralFilter,
      ncd_subtype_list: generalFilter.ncd_subtype_list
    };

    const bondIssueInfoFilterValue =
      issuerIds.size > 0
        ? { ...DEFAULT_BOND_ISSUE_INFO_FILTER_VALUE, issuer_id_list: uniq([...issuerIds]) }
        : { ...selectedGroup.bondIssueInfoFilterValue, issuer_id_list: uniq([...issuerIds]) };

    updateGroupFilter({
      ...selectedGroup,
      generalFilterValue: mergeGeneralFilter,
      quicklyFilterValue: DEFAULT_QUICK_FILTER_VALUE,
      bondIssueInfoFilterValue
    });
  };

  const handleParsing: NCDFiltersParsingCallBack = (g, b) => {
    if (!selectedGroup?.groupId) return;

    if (g && !b?.issuer_id_list?.length) handleGeneralFilterChange(g);

    if (b?.issuer_id_list?.length && !g?.ncd_subtype_list?.length) {
      handleIssuerInstFilterChange(new Set(b.issuer_id_list ?? []), g);
    }

    if (g?.ncd_subtype_list?.length && b?.issuer_id_list?.length) {
      // 处理联动逻辑
      handleGeneralFilterChange(g, b.issuer_id_list);
    }
  };

  return {
    reset,
    updateGroupFilter,
    handleParsing,
    productType,
    groups,
    selected,
    selectedGroup,
    updateGroupName,
    check,
    addGroup,
    deleteGroup,
    setSelected,
    groupContainerRef,
    addGroupModalVisible,
    setAddGroupModalVisible
  };
});

export const PanelGroupConfigProvider = PanelGroupConfigContainer.Provider;
export const usePanelGroupConfig = PanelGroupConfigContainer.useContainer;
