import cx from 'classnames';
import { useAtom, useSetAtom } from 'jotai';
import { DealTableQuoteFilter } from '@/components/BondFilter/DealTableQuoteFilter';
import { dealTablePageAtom, dealTableQuoteFilterValueAtom } from '@/pages/ProductPanel/atoms/table';
import { useProductPanel } from '@/pages/ProductPanel/providers/PanelProvider';
import { useMainGroupData } from '../../providers/MainGroupProvider';
import { updateTableParamsCache } from '../../providers/MainGroupProvider/storage';
import { ProductPanelTableKey } from '../../types';
import { DealTable } from '../DealTable';

export const DealContent = () => {
  const { activeTableKey, groupStoreKey } = useProductPanel();
  const { delayedActiveGroupState: activeGroup } = useMainGroupData();

  const [filterValue, setFilterValue] = useAtom(dealTableQuoteFilterValueAtom);
  const setPage = useSetAtom(dealTablePageAtom);

  const displayCls = activeTableKey === ProductPanelTableKey.Deal ? 'flex' : 'hidden';

  return (
    <div className={cx(displayCls, 'flex-col flex-1 relative')}>
      <DealTableQuoteFilter
        value={filterValue}
        onChange={val => {
          setFilterValue(val);
          setPage(1);
          if (activeGroup?.groupId) {
            updateTableParamsCache({
              storeKey: groupStoreKey,
              groupId: activeGroup.groupId,
              tableKeys: [ProductPanelTableKey.Deal],
              type: 'quoteFilterValue',
              value: val
            });
          }
        }}
      />
      <DealTable />
    </div>
  );
};
