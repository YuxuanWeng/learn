import { useState } from 'react';
import { TableSorterOrder } from '@fepkg/components/Table';
import { QuoteSortedField } from '@fepkg/services/types/bds-enum';
import { useMemoizedFn } from 'ahooks';
import { groupBy, isEqual } from 'lodash-es';
import { createContainer } from 'unstated-next';
import { useImmer } from 'use-immer';
import { CustomSortFieldOptions, CustomSortOption, CustomSortOptionsConfig } from './types';

export type InitialState = {
  defaultOptions?: CustomSortFieldOptions;
};

const customSortOptionsGroupByKey = groupBy(CustomSortOptionsConfig, 'sortedField');

const transformHasOptionConfig = (options: CustomSortFieldOptions): CustomSortOption[] => {
  return [
    ...options
      .filter(v => !!customSortOptionsGroupByKey[v.sortedField ?? QuoteSortedField.FieldNone]?.length)
      .map(v => {
        const sortedField = v.sortedField ?? QuoteSortedField.FieldNone;
        return {
          sortedField,
          order: v.order,
          label: customSortOptionsGroupByKey[sortedField][0].label,
          radioGroup: customSortOptionsGroupByKey[sortedField][0].radioGroup
        };
      }),
    { sortedField: QuoteSortedField.FieldNone, label: '', radioGroup: [] }
  ];
};

const CustomSortingContainer = createContainer((initialState?: InitialState) => {
  const defaultOptions = initialState?.defaultOptions ?? [];
  const [options, setOptions] = useImmer(transformHasOptionConfig(defaultOptions));
  const [configModalVisible, setConfigModalVisible] = useState(false);

  const updateOption = (key: QuoteSortedField, sort: TableSorterOrder) => {
    setOptions(draft => {
      const index = draft.findIndex(v => v.sortedField === key);
      draft[index].order = sort;
    });
  };

  /** 处理拖拽相关的事件 */
  const updateSort = (target: QuoteSortedField, dest?: QuoteSortedField) => {
    const currentTarget = options.find(v => v.sortedField === target);
    const placeHolderOptions = options.find(v => v.sortedField === QuoteSortedField.FieldNone);
    if (!currentTarget || target === dest) return;

    // 如果dest不存在，说明拖动当前记录到最后
    if (!dest) {
      setOptions(draft => {
        return [
          ...draft.filter(v => v.sortedField !== target && v.sortedField !== QuoteSortedField.FieldNone),
          currentTarget,
          placeHolderOptions ?? {
            sortedField: QuoteSortedField.FieldNone,
            label: '',
            order: TableSorterOrder.DESC,
            radioGroup: []
          }
        ];
      });
    } else {
      const patch: CustomSortOption[] = [];
      const newOptions = options.filter(v => v.sortedField !== target);
      for (const v of newOptions) {
        if (v.sortedField === dest) patch.push(currentTarget);
        patch.push(v);
      }
      setOptions(patch);
    }
  };

  const deleteOptions = (key: QuoteSortedField) => {
    setOptions(draft => {
      const index = draft.findIndex(v => v.sortedField === key);
      draft.splice(index, 1);
    });
  };

  const getStateOptions = useMemoizedFn((): CustomSortFieldOptions => {
    return options
      .filter(v => v.sortedField !== QuoteSortedField.FieldNone)
      .map(v => ({ sortedField: v.sortedField, order: v.order ?? TableSorterOrder.DESC }));
  });

  /** 判断options是否修改过 */
  const hasChanged = useMemoizedFn(() => {
    const stateOptions = getStateOptions();
    return !isEqual(stateOptions, defaultOptions);
  });

  const saveConfig = (data: CustomSortFieldOptions) => {
    setConfigModalVisible(false);

    const selectedKeys = transformHasOptionConfig(data);
    const prevKeys = new Set(options.map(v => v.sortedField));

    setOptions(
      selectedKeys.map(v => {
        if (prevKeys.has(v.sortedField)) {
          return options.find(prev => prev.sortedField === v.sortedField) as CustomSortOption;
        }
        return v;
      })
    );
  };

  return {
    options,
    updateOption,
    updateSort,
    deleteOptions,
    getStateOptions,
    hasChanged,
    saveConfig,
    configModalVisible,
    setConfigModalVisible
  };
});

export const CustomSortingProvider = CustomSortingContainer.Provider;
export const useCustomSorting = CustomSortingContainer.useContainer;
