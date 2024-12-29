import { Key } from 'react';
import cx from 'classnames';
import { usePropsValue } from '@fepkg/common/hooks';
import { Tooltip } from '../Tooltip';
import { TabItem, TabsProps } from './types';

export const Tabs = <T extends Key = Key>({
  items,
  defaultActiveKey,
  activeKey,
  className = '',
  baseLine = false,
  plain = false,
  badge,
  onChange
}: TabsProps<T>) => {
  const [innerActiveKey, setInnerActiveKey] = usePropsValue({
    defaultValue: defaultActiveKey,
    value: activeKey
  });

  const handleChange = (item: TabItem<T>) => {
    setInnerActiveKey(item.key);
    onChange?.(item);
  };

  const activeTextCls = cx('font-bold', plain ? 'text-gray-000' : 'text-primary-100');
  const inactiveCls = cx(
    'font-medium',
    plain ? 'text-gray-100 hover:text-gray-000' : 'text-gray-100 hover:text-primary-000'
  );

  return (
    <div className={cx('flex gap-0.5 select-none', className)}>
      {items.map(item => {
        const active = innerActiveKey === item.key;
        // 如果icon和label都存在的话支持响应式
        const reactive = item.label !== undefined && item.icon !== undefined;
        return (
          <div
            key={item.key}
            className={cx(
              'flex-center gap-1 h-8 text-sm rounded-lg cursor-pointer relative border border-solid border-transparent',
              reactive ? '[@media(max-width:1175px){&}]:w-10 [@media(min-width:1175px){&}]:w-24' : 'w-24',
              active && activeTextCls,
              active && baseLine && cx(plain ? 'border-b-orange-100' : 'border-b-primary-100', 'rounded-b-none'),
              active && !baseLine && cx(plain ? 'bg-orange-100' : 'bg-primary-600'),
              !active && inactiveCls,
              item.className
            )}
            onClick={() => handleChange(item)}
          >
            <Tooltip
              content={item.label}
              // 如果有展示item.label，则不用展示tooltip
              floatingProps={{ className: '[@media(min-width:1175px){&}]:hidden' }}
            >
              {item?.icon}
            </Tooltip>
            <div className={reactive ? '[@media(max-width:1174px){&}]:hidden' : ''}>{item.label}</div>
            {badge?.key === item.key && <div className="absolute right-7 top-2">{badge.node}</div>}
          </div>
        );
      })}
    </div>
  );
};
