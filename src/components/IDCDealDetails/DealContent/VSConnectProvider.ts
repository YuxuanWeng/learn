import { useMemoizedFn } from 'ahooks';
import { createContainer } from 'unstated-next';
import { matchInternalCode } from '@/common/utils/internal-code';
import { useFilter } from '../SearchFilter/providers/FilterStateProvider';
import { useVirtualData } from './VirtualListProvider';

const VSConnectContainer = createContainer(() => {
  const { setSelectedIds, parentRef, selectedIds, setActiveRowKey, virtualList, updateOpenBrokers } = useFilter();

  const { scrollToIndex } = useVirtualData();

  const scrollToBroker = (brokerId: string) => {
    const index = virtualList.findIndex(v => v.broker?.user_id === brokerId);
    scrollToIndex?.(index, { align: 'center' });
  };

  const onFilterSeqNum = useMemoizedFn((val?: string, isEnterPress = false) => {
    const idList = val
      ? virtualList
          .filter(item => matchInternalCode(item?.parent_deal?.internal_code ?? '', val))
          .map(item => item.id ?? '')
      : [];
    // 单号没有输入 或者没有筛选到有效数据
    if (!val || idList.length === 0) {
      // 清空单号时，清空选中项
      setSelectedIds([]);
      // 回到顶部
      parentRef.current?.scrollTo({ top: 0 });
      return;
    }
    let rowKey = idList[0];
    if (isEnterPress && selectedIds.length === 1 && idList.length > 1) {
      const prevIndex = idList.findIndex(i => i === selectedIds[0]);
      const nextIndex = prevIndex + 1 > idList.length - 1 ? 0 : prevIndex + 1;
      rowKey = idList[nextIndex];
    }
    const index = virtualList.findIndex(v => v?.id === rowKey);
    setSelectedIds([rowKey]);
    setActiveRowKey(rowKey);
    // 滚动到当前高亮区域
    if (!index) return;
    const targetBroker = virtualList[index].broker;
    if (targetBroker) {
      updateOpenBrokers(oldBrokers => {
        const targetItem = oldBrokers.find(item => item.userId === targetBroker.user_id);
        if (targetItem) targetItem.isOpen = true;
        else {
          oldBrokers.push({ userId: targetBroker.user_id, isOpen: true });
        }
      });
      requestIdleCallback(() => {
        scrollToIndex?.(index, { align: 'center' });
      });
    }
  });

  return { onFilterSeqNum, scrollToBroker };
});

export const VSConnectProvider = VSConnectContainer.Provider;
export const useVSConnect = VSConnectContainer.useContainer;
