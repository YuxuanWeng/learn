import { HTMLProps, useMemo } from 'react';
import { DealQuote } from '@fepkg/services/types/common';
import { DealType } from '@fepkg/services/types/enum';
import IDCGrid from '../Grid';
import { getSummaryQuote } from '../Panel/panelUtils';
import type { IGrid } from '../types';
import { isIDCQuoteSameType } from '../utils';

export interface IDCColProps {
  grid_list: IGrid[];
  rowCount?: number;
  onGridDoubleClick?: (dealType: DealType, gridData: IGrid) => void;
}

type IDom = Omit<HTMLProps<HTMLDivElement>, keyof IDCColProps>;

const IDCCol = ({ grid_list = [], rowCount = 2, onGridDoubleClick }: IDCColProps & IDom) => {
  const gridLst: IGrid[] = useMemo(() => {
    let list = grid_list;
    if (list.length < rowCount) {
      list = [
        ...list,
        ...new Array(rowCount - list.length).fill({ quote: { side: list[0]?.quote?.side }, isEmpty: true })
      ];
    }
    return list;
  }, [grid_list, rowCount]);

  return (
    <>
      {gridLst.slice(0, rowCount).map((gridData, index) => (
        <IDCGrid
          key={JSON.stringify(index)}
          {...gridData}
          showQuote={!isIDCQuoteSameType<Partial<DealQuote>>(getSummaryQuote(gridLst), gridData.quote)}
          onDoubleClick={dealType => onGridDoubleClick?.(dealType, gridData)}
        />
      ))}
    </>
  );
};

export default IDCCol;
