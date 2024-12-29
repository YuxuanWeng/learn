import cx from 'classnames';
import { useAtom, useSetAtom } from 'jotai';
import { OptimalTableQuoteFilter } from '@/components/BondFilter/OptimalTableQuoteFilter';
import { bondTablePageAtom, bondTableQuoteFilterValueAtom } from '@/pages/ProductPanel/atoms/table';
import { useMainGroupData } from '../../providers/MainGroupProvider';
import { updateTableParamsCache } from '../../providers/MainGroupProvider/storage';
import { useProductPanel } from '../../providers/PanelProvider';
import { ProductPanelTableKey } from '../../types';
import { OptimalTable } from '../OptimalTable';

export const BondContent = () => {
  const { activeTableKey, groupStoreKey } = useProductPanel();
  const { delayedActiveGroupState: activeGroup } = useMainGroupData();

  const [filterValue, setFilterValue] = useAtom(bondTableQuoteFilterValueAtom);
  const setPage = useSetAtom(bondTablePageAtom);

  const displayCls = activeTableKey === ProductPanelTableKey.Bond ? 'flex' : 'hidden';

  return (
    <div className={cx(displayCls, 'flex-col flex-1')}>
      <OptimalTableQuoteFilter
        value={filterValue}
        onChange={val => {
          setFilterValue(val);
          setPage(1);

          if (activeGroup?.groupId) {
            updateTableParamsCache({
              storeKey: groupStoreKey,
              groupId: activeGroup.groupId,
              tableKeys: [ProductPanelTableKey.Bond],
              type: 'quoteFilterValue',
              value: val
            });
          }
        }}
      />
      <OptimalTable unquoted />
    </div>
  );
};
