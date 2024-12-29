import { useMemo } from 'react';
import { message } from '@fepkg/components/Message';
import { InstitutionTiny } from '@fepkg/services/types/common';
import { createContainer } from 'unstated-next';
import { useImmer } from 'use-immer';

export type InitialState = {
  defaultSelectedInst?: InstitutionTiny[];
  maxSelectedInst?: number;
};

const SearchInstContainer = createContainer((initialState?: InitialState) => {
  /** 允许选中的最大的机构数 */
  const maxSelectedInst = initialState?.maxSelectedInst;

  /** 模糊搜索到的机构列表 */
  const [searchInst, setSearchInst] = useImmer<InstitutionTiny[]>([]);

  /** 选中机构列表 */
  const [selectedInst, setSelectedInst] = useImmer<InstitutionTiny[]>(initialState?.defaultSelectedInst ?? []);

  /** 是否全选 */
  const isSelectAll = useMemo(() => {
    if (!searchInst?.length) return false;
    if (searchInst.every(v => selectedInst.some(selected => selected.inst_id === v.inst_id))) return true;
    return false;
  }, [searchInst, selectedInst]);

  /** 是否半选 */
  const isIndeterminate = useMemo(() => {
    if (isSelectAll) return false;
    if (!selectedInst.length) return false;
    const indeterminate = searchInst?.some(search =>
      selectedInst.map(selected => selected.inst_id).includes(search.inst_id)
    );
    return indeterminate;
  }, [isSelectAll, searchInst, selectedInst]);

  /**
   * 删除机构
   * @param instId 机构ID
   */
  const handleDeleteInst = (instId: string) => {
    const inst = selectedInst.filter(v => v.inst_id !== instId);
    setSelectedInst(inst);
  };

  /** 全选 */
  const handleSelectAll = () => {
    if (maxSelectedInst !== undefined) {
      if ((searchInst?.length || 0) > maxSelectedInst) {
        message.error(`机构最多允许添加${maxSelectedInst}个`);
        return;
      }
    }

    setSelectedInst(draft => {
      if (isSelectAll) {
        // 取消全选
        const searchInstIds = searchInst?.map(v => v.inst_id) || [];
        draft = draft.filter(v => !searchInstIds.includes(v.inst_id));
      } else {
        // 全选
        // 找到之前已经选中的和当前选中的diff，将diff更新到选中中
        const updateData = [...draft];
        if (searchInst) {
          for (const inst of searchInst) {
            if (!updateData.some(prevInst => prevInst.inst_id === inst.inst_id)) {
              updateData.push(inst);
            }
          }
        }
        draft = updateData;
      }
      return draft;
    });
  };

  /** 搜索列表变化时的回调函数，首次加载会返回接口的全部数据 */
  const handleSearchedInstChange = (inst: InstitutionTiny[]) => {
    setSearchInst(inst);
  };

  /**
   * 选中机构
   * @param instId 机构ID
   * @param val 是否选中
   * @returns
   */
  const handleSelectedInstChange = (instId: string, val: boolean) => {
    if (val && maxSelectedInst !== undefined && selectedInst.length > maxSelectedInst) {
      message.error(`机构最多允许添加${maxSelectedInst}个`);
      return;
    }

    if (val === true && !selectedInst.some(v => v.inst_id === instId)) {
      const inst = searchInst?.find(v => v.inst_id === instId);
      if (!inst) return;
      setSelectedInst([...(selectedInst || []), inst]);
    } else if (!val) {
      const inst = selectedInst.filter(v => v.inst_id !== instId);
      setSelectedInst(inst);
    }
  };

  return {
    isSelectAll,
    isIndeterminate,
    searchInst,
    selectedInst,
    handleDeleteInst,
    handleSelectAll,
    handleSearchedInstChange,
    handleSelectedInstChange
  };
});

export const SearchInstProvider = SearchInstContainer.Provider;
export const useSearchInst = SearchInstContainer.useContainer;
