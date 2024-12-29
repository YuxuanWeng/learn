import { Dispatch, SetStateAction, useState } from 'react';
import cx from 'classnames';
import { ProductType } from '@fepkg/services/types/enum';
import { OperationTypeToNameMap, UndoOperationItem } from '@/common/undo-services/types';
import { logUndo } from '@/common/utils/undo';
import { LogFlowPhase } from '@/types/log';

type UndoListProps = {
  productType: ProductType;
  undoSnapshots?: UndoOperationItem[];
  selectUndoRecords: number[];
  setSelectUndoRecords: Dispatch<SetStateAction<number[]>>;
  recoverUndoSnapshot: (maxIdx: number, productType: ProductType) => Promise<string[]>;
  onEventSuccess?: () => void;
};

export const UndoList = ({
  productType,
  undoSnapshots,
  selectUndoRecords,
  setSelectUndoRecords,
  recoverUndoSnapshot,
  onEventSuccess
}: UndoListProps) => {
  const undoList = undoSnapshots?.sort((a, b) => b.idx - a.idx);

  const [selectTitle, setSelectTitle] = useState(false);

  return (
    <div
      className="flex justify-center flex-col rounded-lg border-gray-400 overflow-hidden bg-gray-600"
      onMouseLeave={() => {
        setSelectTitle(false);
        setSelectUndoRecords([]);
      }}
    >
      <div className={cx('h-9 border px-5', selectTitle ? 'bg-primary-600' : 'bg-gray-600')}>
        <div
          className={cx(
            'box-border h-full text-sm text-gray-000 border-transparent font-bold border border-solid flex items-center select-none',
            selectTitle ? '!border-b-primary-500' : '!border-b-gray-500'
          )}
          onMouseEnter={() => {
            setSelectUndoRecords([]);
            setSelectTitle(true);
          }}
          onClick={e => {
            e.stopPropagation();
          }}
        >
          最近操作
        </div>
      </div>

      {undoList?.map(v => {
        return (
          <div
            key={v.idx}
            className={cx(
              'flex cursor-default justify-between h-9 w-[222px] box-border hover:cursor-pointer',
              selectUndoRecords.includes(v.idx) ? 'bg-primary-600' : 'bg-gray-600'
            )}
            onMouseEnter={() => {
              setSelectUndoRecords(undoList.filter(i => i.idx >= v.idx).map(d => d.idx));
              setSelectTitle(true);
            }}
            onClick={async () => {
              logUndo({ phase: LogFlowPhase.Enter, undo: v });
              await recoverUndoSnapshot(v.idx, productType);
              logUndo({ phase: LogFlowPhase.Submit, undo: v });

              onEventSuccess?.();
            }}
          >
            <div className={cx('truncate w-[126px] text-gray-100 tracking-wide px-5 py-2 font-medium text-sm')}>
              {v.tag || `${v.data.length}条数据`}
            </div>
            <div className={cx(OperationTypeToNameMap.get(v.type)?.color, 'px-5 py-2 text-sm font-medium')}>
              {OperationTypeToNameMap.get(v.type)?.tag}
            </div>
          </div>
        );
      })}
    </div>
  );
};
