import { MouseEvent, MutableRefObject, ReactNode, useEffect, useMemo, useState } from 'react';
import { Checkbox } from '@fepkg/components/Checkbox';
import type { GetRecommendBond } from '@fepkg/services/types/algo/get-recommend-bond';
import { useEventListener } from 'usehooks-ts';
import TextWithTooltip from '@/components/TextWithTooltip';
import styles from './style.module.less';

export type BcoRecommendTableColumn<ItemType, MetaType = any> = {
  render?: (cell: ItemType, parent?: MetaType) => ReactNode;
  renderText?: (cell: ItemType) => string;
  textCellClass?: string;
  width: number;
  name: string;
  title?: string;
  headerClass?: string;
  fixRight?: boolean;
};

export type BCOBondRecommendStepTableIDSelection = {
  itemID: string;
  parentID: string;
};

type CheckItemCallbackProps = {
  value: boolean;
  traderID: string;
  bondID?: string;
};

type RenderHeaderProps = {
  user: GetRecommendBond.TraderRecommendBond;
  isChecked: boolean;
  indeterminate: boolean;
  onCheck: (val: boolean) => void;
};

type BcoRecommendTableProps<ItemType, MetaType = any> = {
  columns: BcoRecommendTableColumn<ItemType, MetaType>[];
  selectedRowIDs?: string[];
  onSelectRow?: (item: string[]) => void;
  list: ItemType[];
  getItemID: (item: ItemType) => string;
  checkedIDs?: string[];
  showCheckBox?: boolean;
  onCheck?: (item: ItemType, checked: boolean) => void;
  meta?: MetaType;
  bordered?: boolean;
  showHeader?: boolean;
  refMap?: MutableRefObject<Record<string, HTMLDivElement>>;
  onRowClick?: (e: MouseEvent<HTMLDivElement>, item: ItemType, selected: boolean) => void;
  onRowMousedown?: (e: MouseEvent<HTMLDivElement>, item: ItemType) => void;
  onRowMouseenter?: (e: MouseEvent<HTMLDivElement>, item: ItemType) => void;
  allowGrow?: boolean;
};

export function BcoRecommendTable<ItemType, MetaType = any>({
  columns,
  selectedRowIDs,
  onSelectRow,
  list,
  getItemID,
  checkedIDs = [],
  showCheckBox = false,
  onCheck,
  meta,
  bordered = false,
  showHeader = false,
  refMap,
  onRowClick,
  onRowMousedown,
  onRowMouseenter,
  allowGrow
}: BcoRecommendTableProps<ItemType, MetaType>) {
  const fullWidth = columns.reduce((prev, next) => prev + next.width, 0) + 48;

  const rows = list.map((item, index) => {
    const selected = selectedRowIDs?.includes(getItemID(item));

    const bg = selected ? 'bg-primary-600' : 'bg-gray-800';

    const fixStyle = `sticky right-0 ${bg} h-full ${styles['table-suffix']} !flex-grow-0 !pr-3`;

    return (
      <div
        onClick={e => {
          onRowClick?.(e, item, selected === true);

          onSelectRow?.([getItemID(item)]);
        }}
        onMouseDown={e => {
          onRowMousedown?.(e, item);
        }}
        onMouseEnter={e => {
          onRowMouseenter?.(e, item);
        }}
        className={`h-8 flex items-center border-solid border-l-0 border-r-0 border-transparent border hover:border-primary-200 ${
          index === 0 ? '' : 'mt-px'
        } ${selected ? 'bg-primary-600' : 'bg-gray-800'} ${styles['talbe-row']}`}
        key={getItemID(item)}
        style={{ minWidth: fullWidth }}
      >
        {showCheckBox && (
          <div className={`sticky ${bg} h-full flex items-center left-0 ${styles['table-prefix']}`}>
            <Checkbox
              className="mx-[18px]"
              checked={checkedIDs.includes(getItemID(item))}
              onChange={checked => {
                onCheck?.(item, checked);
              }}
            />
          </div>
        )}
        {columns.map((c, cellIndex) => (
          <div
            className={`px-3 -my-px h-[calc(100%+2px)] overflow-y-hidden ${allowGrow ? 'flex-grow' : ''} ${
              bordered && cellIndex !== 0 ? 'border-solid border-gray-700 border-0 border-l' : ''
            } ${c.fixRight ? fixStyle : ''}`}
            key={c.name}
            style={{
              width: c.width,
              minWidth: c.width
            }}
            ref={
              refMap == null
                ? undefined
                : node => {
                    if (node == null || refMap.current == null) return;
                    refMap.current[getItemID(item)] = node;
                  }
            }
          >
            {c.render == null ? (
              <div className={`flex items-center h-full text-[13px] text-auxiliary-000 ${c.textCellClass ?? ''}`}>
                <TextWithTooltip
                  maxWidth={c.width - 12 * 2}
                  text={c.renderText?.(item)}
                />
              </div>
            ) : (
              c.render(item, meta)
            )}
          </div>
        ))}
      </div>
    );
  });

  return (
    <div
      className={showHeader ? 'border border-solid border-gray-400 rounded bg-gray-700 flex flex-col h-full' : ''}
      style={showHeader ? { width: fullWidth } : { minWidth: fullWidth }}
    >
      {showHeader && (
        <div className="flex">
          {columns.map(c => (
            <div
              className={`px-3 h-8 flex justify-center items-center ${c.headerClass ?? ''}`}
              key={c.name}
              style={{
                width: c.width,
                minWidth: c.width
              }}
            >
              {c.title}
            </div>
          ))}
        </div>
      )}
      {showHeader ? <div className="flex-1 overflow-y-overlay overflow-x-hidden">{rows}</div> : rows}
    </div>
  );
}

export type BCOBondRecommendStepTableProps = {
  refMap: MutableRefObject<Record<string, HTMLDivElement>>;
  list: GetRecommendBond.TraderRecommendBond[];
  columns: BcoRecommendTableColumn<GetRecommendBond.RecommendedBond, GetRecommendBond.TraderRecommendBond>[];
  renderHeader: (props: RenderHeaderProps) => ReactNode;
  checkedItemIds: BCOBondRecommendStepTableIDSelection[];
  onCheckItem: (val: CheckItemCallbackProps) => void;
  collapse?: boolean;
};

// 信用债推券的债券“表格”
// 行为与标准表格差异较大故不复用
export const BCOBondRecommendStepTable = ({
  list,
  columns,
  collapse = false,
  renderHeader,
  checkedItemIds,
  onCheckItem,
  refMap
}: BCOBondRecommendStepTableProps) => {
  const [selectedRow, setSelectedRow] = useState<BCOBondRecommendStepTableIDSelection[]>();

  const [dragStartItem, setDragStartItem] = useState<BCOBondRecommendStepTableIDSelection>();

  useEventListener('mouseup', () => {
    setDragStartItem(undefined);
  });

  const allSelectItems = useMemo(() => {
    return list.reduce(
      (prev, next) => {
        return [
          ...prev,
          ...(next.list?.map(i => ({
            itemID: i.recommend_bond_id,
            parentID: next.trader_id,
            quote_copy: i.quote_copy
          })) ?? [])
        ];
      },
      [] as (BCOBondRecommendStepTableIDSelection & { quote_copy })[]
    );
  }, [list]);

  useEffect(() => {
    const itemCopys = allSelectItems
      ?.filter(
        i =>
          selectedRow?.some(selected => selected.itemID === i.itemID && selected.parentID === i.parentID) &&
          i.quote_copy != null
      )
      ?.map(i => i.quote_copy);

    if (itemCopys != null && itemCopys?.length !== 0) {
      window.Main.copy(itemCopys?.join('\n'));
    }
  }, [selectedRow]);

  return (
    <div className="select-none">
      {list.map(user => {
        const checkedBondIDs = checkedItemIds
          .filter(i => i.parentID === user.trader_id && user.list?.some(item => item.recommend_bond_id === i.itemID))
          .map(i => i.itemID);

        const isChecked = (user.list ?? []).length > 0 && user.list?.length === checkedBondIDs.length;

        const indeterminate =
          (user.list ?? []).length > 0 && checkedBondIDs.length > 0 && user.list?.length !== checkedBondIDs.length;

        return (
          <div
            onDoubleClick={() => {
              refMap.current[user.trader_id]?.scrollIntoView();
            }}
            key={user.trader_id}
            ref={node => {
              if (node == null || refMap.current == null) return;

              refMap.current[user.trader_id] = node;
            }}
            className="bg-gray-750 mb-2 rounded-[4px] overflow-hidden"
          >
            {renderHeader({
              user,
              isChecked,
              indeterminate,
              onCheck: val => {
                onCheckItem({
                  value: val,
                  traderID: user.trader_id
                });
              }
            })}
            <div className="max-h-[132px] overflow-overlay relative">
              <BcoRecommendTable
                allowGrow
                columns={columns}
                list={collapse && user.list != null && user.list.length !== 0 ? [user.list[0]] : user.list ?? []}
                selectedRowIDs={selectedRow?.map(i => i.itemID)}
                getItemID={i => i.recommend_bond_id}
                checkedIDs={checkedBondIDs}
                showCheckBox
                onCheck={(subItem, checked) => {
                  onCheckItem({
                    value: checked,
                    traderID: user.trader_id,
                    bondID: subItem.recommend_bond_id
                  });
                }}
                meta={user}
                onRowClick={(e, item, selected) => {
                  if (e.ctrlKey || e.metaKey) {
                    if (selected) {
                      setSelectedRow(
                        selectedRow?.filter(
                          i => !(i.itemID === item.recommend_bond_id && i.parentID === user.trader_id) ?? []
                        )
                      );
                    } else {
                      setSelectedRow([
                        ...(selectedRow ?? []),
                        {
                          itemID: item.recommend_bond_id,
                          parentID: user.trader_id
                        }
                      ]);
                    }
                  } else {
                    setSelectedRow([{ itemID: item.recommend_bond_id, parentID: user.trader_id }]);
                  }
                }}
                onRowMousedown={(_, item) => {
                  setDragStartItem({ itemID: item.recommend_bond_id, parentID: user.trader_id });
                }}
                onRowMouseenter={(_, item) => {
                  if (dragStartItem == null) return;

                  const startIndex = allSelectItems.findIndex(
                    i => i.itemID === dragStartItem.itemID && i.parentID === dragStartItem.parentID
                  );

                  const index = allSelectItems.findIndex(
                    i => i.itemID === item.recommend_bond_id && i.parentID === user.trader_id
                  );

                  if (startIndex == null || index == null) return;

                  const start = Math.min(index, startIndex);
                  const end = Math.max(index, startIndex);

                  setSelectedRow(allSelectItems.slice(start, end + 1));
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
