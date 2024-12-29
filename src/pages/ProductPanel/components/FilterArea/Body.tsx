import { useMemo } from 'react';
import cx from 'classnames';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { useAdvanceGroupQuery } from '@/common/services/hooks/useAdvanceGroupQuery';
import { BondFilter } from '@/components/BondFilter';
import { NavigatorItemId } from '@/components/Navigator';
import { useNavigatorCheckedIdValue } from '@/layouts/Home/atoms';
import { useProductParams } from '@/layouts/Home/hooks';
import { useProductPanel } from '@/pages/ProductPanel/providers/PanelProvider';
import { useMainGroupData } from '../../providers/MainGroupProvider';

const FilterHeightMap: { [key: number]: number } = {
  [ProductType.BCO]: 232,
  [ProductType.BNC]: 160,
  [ProductType.NCDP]: 88,
  [ProductType.NCD]: 196
};

export const Body = ({ showMenu }: { showMenu?: boolean }) => {
  const { activeGroupState, modifyLocalGroup, resetFilter, bondFilterRef, autoSaveCustomSorting } = useMainGroupData();
  const { filterOpen } = useProductPanel();
  const { productType } = useProductParams();

  const switchShowGeneralFilter = async () => {
    await modifyLocalGroup({
      ...activeGroupState.activeGroup,
      groupId: activeGroupState.activeGroup?.groupId || '',
      isAdvanceMode: !activeGroupState.activeGroup?.isAdvanceMode
    });
  };

  const { data: advanceGroupData } = useAdvanceGroupQuery();

  const filterHeight = useMemo(() => {
    if (activeGroupState.activeGroup?.isAdvanceMode) {
      if (advanceGroupData === undefined) return 0;
      return advanceGroupData?.length ? 160 : 180;
    }
    return FilterHeightMap[productType];
  }, [activeGroupState.activeGroup?.isAdvanceMode, advanceGroupData, productType]);

  // 加 2 是因为设计稿为 180px，但 -mt-px 会往上偏移 1 px，底部边框也会占据 1 px，计算后元素内内容才为设计稿的 180px 高
  const computedHeight = filterHeight + 2;

  const checkedId = useNavigatorCheckedIdValue();
  // TODO: 后面看看
  if (!activeGroupState.activeGroup) return null;

  const key = JSON.stringify(activeGroupState.activeGroup.groupId);

  return (
    <div
      className={cx(
        '-mt-px border-0 border-b border-solid border-gray-600 select-none duration-200 ease-linear relative overflow-y-hidden',
        checkedId === NavigatorItemId.Market ? 'overflow-x-overlay' : 'overflow-none',
        showMenu ? 'border-l' : ''
      )}
      style={{
        transitionProperty: 'max-height',
        maxHeight: filterOpen ? computedHeight : 0
      }}
    >
      <div className="flex flex-col gap-x-3 gap-y-2 p-3 flex-1">
        <BondFilter
          ref={bondFilterRef}
          key={key}
          groupValue={activeGroupState.activeGroup}
          onChange={modifyLocalGroup}
          autoSaveCustomSorting={autoSaveCustomSorting}
          reset={resetFilter}
          switchMode={switchShowGeneralFilter}
        />
      </div>
    </div>
  );
};
