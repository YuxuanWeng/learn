import cx from 'classnames';
import { useAtom, useSetAtom } from 'jotai';
import { ReferredTableQuoteFilter } from '@/components/BondFilter/ReferredTableQuoteFilter';
import { referredTablePageAtom, referredTableQuoteFilterValueAtom } from '@/pages/ProductPanel/atoms/table';
import { useMainGroupData } from '../../providers/MainGroupProvider';
import { updateTableParamsCache } from '../../providers/MainGroupProvider/storage';
import { useProductPanel } from '../../providers/PanelProvider';
import { ProductPanelTableKey } from '../../types';
import { BasicTable } from '../BasicTable';

export const ReferredContent = () => {
  const { activeTableKey, groupStoreKey } = useProductPanel();
  const { delayedActiveGroupState: activeGroup } = useMainGroupData();

  const [filterValue, setFilterValue] = useAtom(referredTableQuoteFilterValueAtom);
  const setPage = useSetAtom(referredTablePageAtom);

  const displayCls = activeTableKey === ProductPanelTableKey.Referred ? 'flex' : 'hidden';

  return (
    <div className={cx(displayCls, 'flex-col flex-1')}>
      <ReferredTableQuoteFilter
        value={filterValue}
        onChange={val => {
          setFilterValue(val);
          setPage(1);

          if (activeGroup?.groupId) {
            updateTableParamsCache({
              storeKey: groupStoreKey,
              groupId: activeGroup.groupId,
              tableKeys: [ProductPanelTableKey.Referred],
              type: 'quoteFilterValue',
              value: val
            });
          }
        }}
      />
      <BasicTable referred />
    </div>
  );
};
