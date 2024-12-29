import { createContainer } from 'unstated-next';
import { useImmer } from 'use-immer';
import { TypeSearchFilter } from '@/components/IDCDealDetails/type';
import { initSearchFilter } from '../../utils';

type StackStatus = {
  activeKey: string;
  stack: TypeSearchFilter[];
};

const HISTORY_LENGTH = 4;

const HistoryStackContextContainer = createContainer(() => {
  const [stackState, updateStack] = useImmer<StackStatus>({
    activeKey: initSearchFilter.key,
    stack: [initSearchFilter]
  });

  // TODO 待重构成和useImmer的updater类似的方法
  function saveParams(val: TypeSearchFilter) {
    updateStack(draft => {
      let list = draft.stack;
      const nowIndex = list.findIndex(item => item.key === draft.activeKey);
      if (nowIndex) {
        list = list.slice(0, nowIndex + 1);
      }
      // 如果存满了就删掉最后一个
      if (list.length === HISTORY_LENGTH) {
        draft.stack.shift();
      }
      // 将当前保存的这个设置为active
      draft.activeKey = val.key;
      // 将当前保存这个push到最后面
      list.push(val);
      draft.stack = list;
    });
  }

  return { stackState, updateStack, saveParams };
});

export const HistoryStackProvider = HistoryStackContextContainer.Provider;
export const useHistoryStack = HistoryStackContextContainer.useContainer;
