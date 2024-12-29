import { ForwardedRef, Key, forwardRef, useImperativeHandle, useRef, useState } from 'react';
import cx from 'classnames';
import { usePropsValue } from '@fepkg/common/hooks';
import { Input } from '@fepkg/components/Input';
import { message } from '@fepkg/components/Message';
import { TabItem } from '@fepkg/components/Tabs';
import { Tooltip } from '@fepkg/components/Tooltip';
import { RenameTabsProps, TabProps } from './types';

const activeTextCls = 'text-primary-100 font-bold';
const inactiveCls = 'text-gray-100 font-medium hover:text-primary-100';

export type TabInstance = {
  /** 重置状态 */
  reset?: () => void;
};

function TabInner<T extends Key = Key>(props: TabProps<T>, ref: ForwardedRef<TabInstance>) {
  const { item, active, baseLine = false, maxLength = false, onChange, onRename } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  const [editing, setEditing] = useState(false);
  const [currentLabel, setCurrentLabel] = useState(item.label);
  const [error, setError] = useState(false);

  const resetEdit = () => {
    setEditing(false);
    setError(false);
  };

  const reset = () => {
    resetEdit();
    setCurrentLabel(item.label);
  };

  useImperativeHandle(ref, () => ({
    reset
  }));

  const switchError = () => {
    setError(true);
    inputRef.current?.focus();
  };

  const handleSubmit = (byBlur = false) => {
    const trimLabel = currentLabel.trim();
    if (!trimLabel.length) {
      message.error('名称不能为空!');
      if (byBlur) reset();
      else switchError();
      return;
    }

    setEditing(false);
    const updateSuccess = onRename?.({ ...item, label: currentLabel });
    if (updateSuccess === undefined) return;

    if (updateSuccess) resetEdit();
    else if (byBlur) reset();
    else switchError();
  };

  return (
    <div
      className={cx(
        'flex-center gap-1 w-30 h-10 text-sm rounded-lg cursor-pointer relative border border-solid border-transparent',
        active && activeTextCls,
        active && baseLine && 'border-b-primary-100 rounded-b-none',
        active && !baseLine && 'bg-primary-600',
        !active && inactiveCls,
        item.className
      )}
      onClick={() => {
        if (!editing) onChange?.(item);
      }}
      onDoubleClick={e => {
        e.stopPropagation();
        setEditing(true);
        requestIdleCallback(() => {
          inputRef.current?.focus();
        });
      }}
    >
      <Tooltip
        truncate
        content={item.label}
      >
        <span className="text-center absolute w-25 truncate">{item.label}</span>
      </Tooltip>
      <Input
        ref={inputRef}
        className={cx('absolute text-gray-000 undraggable', editing ? 'visible' : 'invisible')}
        value={currentLabel}
        maxLength={maxLength || void 0}
        error={error}
        onChange={setCurrentLabel}
        onBlur={() => handleSubmit(true)}
        onEnterPress={() => handleSubmit()}
        onClick={evt => evt.stopPropagation()}
      />
    </div>
  );
}

const Tab = forwardRef(TabInner) as <T extends Key = Key>(
  props: TabProps<T> & { ref?: ForwardedRef<TabInstance> }
) => ReturnType<typeof TabInner>;

export const RenameTabs = <T extends Key = Key>({
  items,
  defaultActiveKey,
  activeKey,
  className = '',
  onChange,
  ...rest
}: RenameTabsProps<T>) => {
  const [innerActiveKey, setInnerActiveKey] = usePropsValue({
    defaultValue: defaultActiveKey,
    value: activeKey
  });

  const tabRef = useRef<TabInstance>(null);

  const handleChange = (item: TabItem<T>) => {
    setInnerActiveKey(item.key);
    onChange?.(item);
    tabRef.current?.reset?.();
  };

  return (
    <div className={cx('flex gap-0.5 select-none', className)}>
      {items.map(item => {
        const active = innerActiveKey === item.key;
        return (
          <Tab<T>
            {...rest}
            ref={tabRef}
            key={item.key}
            item={item}
            active={active}
            onChange={handleChange}
          />
        );
      })}
    </div>
  );
};
