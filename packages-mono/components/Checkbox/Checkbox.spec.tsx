import { describe, expect, it, vi } from 'vitest';
import { Ref, createRef } from 'react';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { fireEvent, render } from '@testing-library/react';
import { Checkbox } from './Checkbox';
import { CheckboxProps } from './types';

const createCheckbox = (
  props?: CheckboxProps & { ref?: Ref<HTMLInputElement> },
  cb?: (container: HTMLElement, el: HTMLLabelElement, inputEl: HTMLInputElement) => void
) => {
  const { container } = render(<Checkbox {...props} />);
  const el = container.querySelector('label');
  const inputEl = el?.querySelector('input');
  if (el && inputEl) {
    cb?.(container, el, inputEl);
  } else {
    throw Error('都没有 Checkbox，测个 🔨🔨');
  }
};

describe('Checkbox', () => {
  it('基本使用', () => {
    createCheckbox({}, (_, __, inputEl) => {
      expect(inputEl.checked).toBe(false);

      fireEvent.click(inputEl);
      expect(inputEl.checked).toBe(true);

      fireEvent.click(inputEl);
      expect(inputEl.checked).toBe(false);
    });
  });

  it('受控模式', () => {
    createCheckbox({ checked: true }, (_, __, inputEl) => {
      expect(inputEl.checked).toBe(true);

      fireEvent.click(inputEl);
      expect(inputEl.checked).toBe(true);

      fireEvent.click(inputEl);
      expect(inputEl.checked).toBe(true);
    });
  });

  it('初始值为 true，在点击之后 checked 状态应该切换为 false', () => {
    const onChange = vi.fn();
    createCheckbox({ defaultChecked: true, onChange }, (container, el) => {
      expect(container.querySelector('.checked')).toBeTruthy();
      fireEvent.click(el);
      expect(container.querySelector('.unchecked')).toBeTruthy();
      expect(onChange).toHaveBeenCalled();
    });
  });

  it('当为 disabled 状态时，点击不应切换 Checkbox', () => {
    const onChange = vi.fn();
    createCheckbox({ disabled: true, checked: true, onChange }, (container, el) => {
      expect(container.querySelector('.checked')).toBeTruthy();
      fireEvent.click(el);
      expect(container.querySelector('.checked')).toBeTruthy();
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  it('使用 ref 能正常聚/失焦 Checkbox', () => {
    const ref = createRef<HTMLInputElement>();
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    createCheckbox({ ref, onFocus, onBlur }, (_, __, inputEl) => {
      ref.current?.focus();
      expect(inputEl).toHaveFocus();

      ref.current?.blur();
      expect(inputEl).not.toHaveFocus();

      expect(onFocus).toHaveBeenCalled();
      expect(onBlur).toHaveBeenCalled();
    });
  });

  it('使用空格能正常切换 Checkbox', () => {
    const ref = createRef<HTMLInputElement>();
    const onChange = vi.fn();
    const onKeyDown = vi.fn();
    createCheckbox({ ref, onChange, onKeyDown }, (container, _, inputEl) => {
      expect(container.querySelector('.unchecked')).toBeTruthy();

      ref.current?.focus();
      expect(inputEl).toHaveFocus();

      fireEvent.keyDown(inputEl, { key: KeyboardKeys.Space });
      expect(container.querySelector('.checked')).toBeTruthy();
      expect(onChange).toHaveBeenCalled();
      expect(onKeyDown).toHaveBeenCalled();
    });
  });

  it('默认为不选中的 indeterminate 状态时，aria-checked 应为 mixed', () => {
    createCheckbox({ defaultChecked: false, indeterminate: true }, (_, __, inputEl) => {
      expect(inputEl.getAttribute('aria-checked')).toBe('mixed');
    });
  });

  it('点击不会调用多次 onClick 事件', () => {
    const onClick = vi.fn();
    createCheckbox({ onClick }, (_, el) => {
      fireEvent.click(el);
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  it('使用 ref 能正常触发 onClick 事件', () => {
    const ref = createRef<HTMLInputElement>();
    const onClick = vi.fn();
    createCheckbox({ ref, onClick }, (_, __) => {
      ref.current?.click();

      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });
});
