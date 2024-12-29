import { BaseOption } from '../BaseOptionsRender/BaseOption';
import { useFloat } from './FloatProvider';
import { useSearch } from './SearchProvider';
import { SearchOption } from './types';

type FloatOptionProps = {
  index: number;
  option: SearchOption;
};

export const FloatOption = ({ index, option }: FloatOptionProps) => {
  const { setOpen, activeIndex, listRef, interactions } = useFloat();
  const { optionRender, innerValue, inputValue, change } = useSearch();

  const active = activeIndex === index;
  const selected = innerValue?.value === option?.value;

  let mergedOptionCls = 's-search-dropdown-option';
  if (selected) mergedOptionCls = `${mergedOptionCls} s-search-dropdown-option-selected`;
  if (active) mergedOptionCls = `${mergedOptionCls} s-search-dropdown-option-active`;
  if (option?.disabled) mergedOptionCls = `${mergedOptionCls} s-search-dropdown-option-disabled`;

  return (
    <BaseOption
      {...interactions.getItemProps({
        ref(el) {
          if (!option?.disabled) listRef.current[index] = el;
        },
        role: 'option',
        disabled: option?.disabled,
        // 用 onMouseDown 取代 onClick
        // 以避免单击鼠标按键时间长的习惯导致的 blur 提前生效问题
        onMouseDown() {
          if (!option?.disabled) change(option);
          setOpen(false);
        }
      })}
      active={active}
      selected={selected}
      // className={mergedOptionCls}
    >
      {optionRender ? optionRender(option.original, inputValue) : option.label}
    </BaseOption>
  );

  return (
    <div
      {...interactions.getItemProps({
        ref(el) {
          if (!option?.disabled) listRef.current[index] = el;
        },
        role: 'option',
        disabled: option?.disabled,
        // 用 onMouseDown 取代 onClick
        // 以避免单击鼠标按键时间长的习惯导致的 blur 提前生效问题
        onMouseDown() {
          if (!option?.disabled) change(option);
          setOpen(false);
        }
      })}
      className={mergedOptionCls}
    >
      {optionRender ? optionRender?.(option.original, inputValue) : option.label}
    </div>
  );
};
