import cx from 'classnames';
import { Placeholder } from '@fepkg/components/Placeholder';
import { Item } from '../../../HoverItem';
import { useGroupConfig } from '../../provider';

const BASE_CLS = 'flex flex-col w-[50%] gap-2';

export const Body = () => {
  const { groups, traders, deleteTraders } = useGroupConfig();

  if (!groups.length) return null;

  if (!traders?.length) {
    return (
      <div className="flex flex-auto justify-center items-center">
        <Placeholder
          size="xs"
          type="no-data"
          label="暂无分组成员"
        />
      </div>
    );
  }

  const mid = Math.ceil(traders.length / 2);
  const left = traders.slice(0, mid);
  const right = traders.slice(mid);

  const lintHeight = left.length * 40 - 8;

  return (
    <div className="flex flex-1 overflow-overlay w-full -mr-3 pr-2 pb-2">
      <div className={cx(BASE_CLS, 'pr-2')}>
        {left.map(v => {
          return (
            <Item
              key={v.trader_id}
              value={v.trader_id}
              className="w-50 min-h-[32px]"
              name={v.cp}
              showWarn={false}
              invalid={v.invalid}
              onDelete={val => {
                deleteTraders([val]);
              }}
            />
          );
        })}
      </div>

      <div
        className="component-dashed-y-600"
        style={{ height: lintHeight }}
      />

      <div className={cx(BASE_CLS, 'pl-2')}>
        {right.map(v => {
          return (
            <Item
              key={v.trader_id}
              value={v.trader_id}
              name={<span>{v.cp}</span>}
              className="w-50 min-h-[32px]"
              showWarn={false}
              invalid={v.invalid}
              onDelete={val => {
                deleteTraders([val]);
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
