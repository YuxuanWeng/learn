import { ReactNode } from 'react';
import { BaseOption } from '../BaseOptionsRender/BaseOption';
import { useFloat } from '../Search/FloatProvider';
import { useSelect } from './SelectProvider';
import { SelectOption } from './types';

type FloatOptionProps = {
  index: number;
  option: SelectOption;
};

export const FloatOption = ({ index, option }: FloatOptionProps) => {
  const { setOpen, activeIndex, listRef, floating, interactions } = useFloat();
  const { multiple, optionRender, inputValue, display, change } = useSelect();

  const active = activeIndex === index;
  const selected = display.selected.some(item => item.value === option.value);

  let mergedOptionCls = 's-select-dropdown-option';
  if (selected) mergedOptionCls = `${mergedOptionCls} s-select-dropdown-option-selected`;
  if (active) mergedOptionCls = `${mergedOptionCls} s-select-dropdown-option-active`;
  if (option?.disabled) mergedOptionCls = `${mergedOptionCls} s-select-dropdown-option-disabled`;

  let node: ReactNode = option.label;

  // if (multiple)
  //   node = (
  //     <Checkbox
  //       disabled={option?.disabled}
  //       checked={selected}
  //     >
  //       {option.label}
  //     </Checkbox>
  //   );

  if (optionRender) node = optionRender(option, inputValue);

  return (
    <BaseOption
      {...interactions.getItemProps({
        ref(el) {
          if (!option?.disabled) listRef.current[index] = el;
        },
        role: 'option',
        disabled: option?.disabled,
        // 用 onMouseDown 取代 onClick
        // 以避免单击鼠标按键时间长的习惯导致的 blur 提 前生效问题
        onMouseDown() {
          if (!option?.disabled) change(option);
          if (!multiple) setOpen(false);
        }
      })}
      active={active}
      checkbox={multiple}
      selected={selected}
      multiple={multiple}
      checkboxProps={{ disabled: option?.disabled, checked: selected, input: false }}
    >
      {node}
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
        // 以避免单击鼠标按键时间长的习惯导致的 blur 提 前生效问题
        onMouseDown() {
          if (!option?.disabled) change(option);
          if (!multiple) setOpen(false);
        }
      })}
      className={mergedOptionCls}
    >
      {node}
    </div>
  );
};
