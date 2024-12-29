import { useMemo } from 'react';
import cx from 'classnames';
import { useAtom, useSetAtom } from 'jotai';
import { NCDPTableFilter } from '@/components/BondFilter/NCDPTableFilter';
import {
  basicTablePageAtom,
  basicTableQuoteFilterValueAtom,
  referredTablePageAtom,
  referredTableQuoteFilterValueAtom
} from '../../atoms/table';
import { useMainGroupData } from '../../providers/MainGroupProvider';
import { updateTableParamsCache } from '../../providers/MainGroupProvider/storage';
import { useProductPanel } from '../../providers/PanelProvider';
import { ProductPanelTableKey } from '../../types';
import { NCDPTable } from '../NCDPTable';

export const TableContent = ({ referred = false }) => {
  const { activeTableKey, groupStoreKey } = useProductPanel();
  const { delayedActiveGroupState: activeGroup } = useMainGroupData();

  /** 当前组件的表格 Key */
  const tableKey = referred ? ProductPanelTableKey.Referred : ProductPanelTableKey.Basic;
  /** 当前组件是否处于激活状态 */
  const active = tableKey === activeTableKey;

  const [filterValue, setFilterValue] = useAtom(
    useMemo(() => (referred ? referredTableQuoteFilterValueAtom : basicTableQuoteFilterValueAtom), [referred])
  );
  const setPage = useSetAtom(useMemo(() => (referred ? referredTablePageAtom : basicTablePageAtom), [referred]));

  const displayCls = active ? 'flex' : 'hidden';

  return (
    <div className={cx(displayCls, 'flex-col flex-1 relative')}>
      <NCDPTableFilter
        value={filterValue}
        onChange={val => {
          setFilterValue(val);
          setPage(1);

          if (activeGroup?.groupId) {
            updateTableParamsCache({
              storeKey: groupStoreKey,
              groupId: activeGroup.groupId,
              tableKeys: [tableKey],
              type: 'quoteFilterValue',
              value: val
            });
          }
        }}
      />
      <NCDPTable referred={referred} />
    </div>
  );
};
