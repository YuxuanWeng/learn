import cx from 'classnames';
import { useAtom, useSetAtom } from 'jotai';
import { BasicTableQuoteFilter } from '@/components/BondFilter/BasicTableQuoteFilter';
import { basicTablePageAtom, basicTableQuoteFilterValueAtom } from '@/pages/ProductPanel/atoms/table';
import { useMainGroupData } from '../../providers/MainGroupProvider';
import { updateTableParamsCache } from '../../providers/MainGroupProvider/storage';
import { useProductPanel } from '../../providers/PanelProvider';
import { ProductPanelTableKey } from '../../types';
import { BasicTable } from '../BasicTable';

export const BasicContent = () => {
  const { activeTableKey, groupStoreKey } = useProductPanel();
  const { delayedActiveGroupState: activeGroup } = useMainGroupData();

  const [filterValue, setFilterValue] = useAtom(basicTableQuoteFilterValueAtom);
  const setPage = useSetAtom(basicTablePageAtom);

  const displayCls = activeTableKey === ProductPanelTableKey.Basic ? 'flex' : 'hidden';

  return (
    <div className={cx(displayCls, 'flex-col flex-1')}>
      <BasicTableQuoteFilter
        value={filterValue}
        onChange={val => {
          setFilterValue(val);
          setPage(1);

          if (activeGroup?.groupId) {
            updateTableParamsCache({
              storeKey: groupStoreKey,
              groupId: activeGroup.groupId,
              tableKeys: [ProductPanelTableKey.Basic],
              type: 'quoteFilterValue',
              value: val
            });
          }
        }}
      />
      <BasicTable />
    </div>
  );
};
