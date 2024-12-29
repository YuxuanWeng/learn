import cx from 'classnames';
import { SettlementLabel } from '@fepkg/services/types/bds-enum';
import styles from './style.module.less';

type Item = { label: string; amount: number; key: SettlementLabel };

export type TabsProps = {
  activeKey?: SettlementLabel;
  items: Item[];
  onItemClick?: (item: Item) => void;
};

export const TabComp = ({ items, onItemClick, activeKey }: TabsProps) => {
  const handleItemClick = (item: Item) => {
    onItemClick?.(item);
  };

  return (
    <div className="flex gap-0.5 select-none bg-gray-700">
      {items.map(item => {
        const isActive = activeKey === item.key;

        return (
          <div
            key={item.key}
            className={cx(
              'flex-center gap-1 w-30 h-10 text-sm rounded-lg cursor-pointer relative border border-solid border-transparent',
              isActive ? 'font-bold text-primary-100 border-b-primary-100 rounded-b-none' : 'font-medium text-gray-100',
              !isActive && styles['tab-inactive']
            )}
            onClick={() => handleItemClick(item)}
          >
            {item.label}
            {item.amount > 0 && (
              <div
                className={cx(
                  'ml-2 w-4 h-4 rounded text-xs flex-center',
                  isActive ? 'text-primary-100 bg-primary-600' : 'text-gray-200 bg-gray-600 '
                )}
              >
                {item.amount}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
