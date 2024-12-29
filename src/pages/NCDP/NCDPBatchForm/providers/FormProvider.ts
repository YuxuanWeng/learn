import { useState } from 'react';
import { getNextTradedDate } from '@fepkg/business/hooks/useDealDateMutation';
import { IssuerDateType } from '@fepkg/services/types/bds-enum';
import { NCDPInfo } from '@fepkg/services/types/common';
import { createContainer } from 'unstated-next';
import { useImmer } from 'use-immer';
import { v4 } from 'uuid';
import { NCDPBatchFormListItem, NCDPBatchFormMode } from '../types';
import { transform2Price } from '../utils';

type InitialState = {
  /** 操作模式 */
  mode: NCDPBatchFormMode;
  /** 默认带入的 NCDP 信息 */
  defaultValues?: NCDPInfo[];
};

export const initList = (initialState?: InitialState, length = 50): NCDPBatchFormListItem[] => {
  let res: NCDPBatchFormListItem[] = [...new Array(length).keys()].map(() => ({ key: v4() }));

  if (initialState?.defaultValues?.length) {
    res = [];

    for (const item of initialState.defaultValues) {
      res.push({ ...item, key: v4(), original: item, price: transform2Price(item.fr_type, item.price) });
    }
  }

  return res;
};

const NCDPBatchFormContainer = createContainer((initialState?: InitialState) => {
  const [defaultIssuerDateType] = useState<IssuerDateType>(() => {
    // 默认使用明天（下一个工作日）
    const nextTradedDate = getNextTradedDate();
    let res = new Date(nextTradedDate).getDay();
    if (res === 0) res = IssuerDateType.IssuerDateTypeSunday;
    return res;
  });

  const [formList, updateFormList] = useImmer<NCDPBatchFormListItem[]>(initList(initialState));
  const [formLoading, setFormLoading] = useState(false);

  const mode = initialState?.mode;
  const isEdit = mode === NCDPBatchFormMode.Edit;
  const isBatch = formList.length > 1;

  return { mode, isEdit, isBatch, defaultIssuerDateType, formList, updateFormList, formLoading, setFormLoading };
});

export const NCDPBatchFormProvider = NCDPBatchFormContainer.Provider;
export const useNCDPBatchForm = NCDPBatchFormContainer.useContainer;
