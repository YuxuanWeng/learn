import { describe, expect, it, vi } from 'vitest';
import { ForwardRefExoticComponent, Ref, createRef } from 'react';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { createEvent, fireEvent, render } from '@testing-library/react';
import { Radio } from './Radio';
import { RadioButton } from './RadioButton';
import { RadioButtonProps, RadioProps, RadioType } from './types';

const createRadio = (
  type: RadioType,
  props?: (RadioProps & RadioButtonProps) & { ref?: Ref<HTMLInputElement> },
  cb?: (container: HTMLElement, el: HTMLLabelElement, inputEl: HTMLInputElement) => void
) => {
  let RadioRender = Radio;
  if (type === 'button') RadioRender = RadioButton as ForwardRefExoticComponent<RadioProps>;

  const { container } = render(<RadioRender {...props} />);
  const el = container.querySelector('label');
  const inputEl = el?.querySelector('input');
  if (el && inputEl) {
    cb?.(container, el, inputEl);
  } else {
    throw Error('都没有 Radio，测个 🔨🔨');
  }
};

describe('Radio', () => {
  it('基本使用', () => {
    createRadio('radio', {}, (_, __, inputEl) => {
      expect(inputEl.checked).toBe(false);

      fireEvent.click(inputEl);
      expect(inputEl.checked).toBe(true);

      fireEvent.click(inputEl);
      expect(inputEl.checked).toBe(true);
    });
  });

  it('受控模式', () => {
    createRadio('radio', { checked: true }, (_, __, inputEl) => {
      expect(inputEl.checked).toBe(true);

      fireEvent.click(inputEl);
      expect(inputEl.checked).toBe(true);

      fireEvent.click(inputEl);
      expect(inputEl.checked).toBe(true);
    });
  });

  it('初始值为 true，在点击之后 checked 状态应该切换为 false', () => {
    const onChange = vi.fn();
    createRadio('radio', { defaultChecked: true, onChange }, (container, el) => {
      expect(container.querySelector('.checked')).toBeTruthy();
      fireEvent.click(el);
      expect(container.querySelector('.checked')).toBeTruthy();
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  it('当为 disabled 状态时，点击不应切换 Radio', () => {
    const onChange = vi.fn();
    createRadio('radio', { disabled: true, checked: true, onChange }, (container, el) => {
      expect(container.querySelector('.checked')).toBeTruthy();
      fireEvent.click(el);
      expect(container.querySelector('.checked')).toBeTruthy();
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  it('使用 ref 能正常聚/失焦 Radio', () => {
    const ref = createRef<HTMLInputElement>();
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    createRadio('radio', { ref, onFocus, onBlur }, (_, __, inputEl) => {
      ref.current?.focus();
      expect(inputEl).toHaveFocus();

      ref.current?.blur();
      expect(inputEl).not.toHaveFocus();

      expect(onFocus).toHaveBeenCalled();
      expect(onBlur).toHaveBeenCalled();
    });
  });

  it('使用空格能正常选中 Radio', () => {
    const ref = createRef<HTMLInputElement>();
    const onChange = vi.fn();
    const onKeyDown = vi.fn();
    createRadio('radio', { ref, onChange, onKeyDown }, (container, _, inputEl) => {
      expect(container.querySelector('.unchecked')).toBeTruthy();

      ref.current?.focus();
      expect(inputEl).toHaveFocus();

      fireEvent.keyDown(inputEl, { key: KeyboardKeys.Space });
      expect(container.querySelector('.checked')).toBeTruthy();
      expect(onChange).toHaveBeenCalled();
      expect(onKeyDown).toHaveBeenCalled();

      fireEvent.keyDown(inputEl, { key: KeyboardKeys.Space });
      expect(container.querySelector('.checked')).toBeTruthy();
    });
  });

  it('当为 ctrl 状态时，按下 command 键或 ctrl 键点击应切换 Radio', () => {
    const onChange = vi.fn();
    createRadio('radio', { ctrl: true, onChange }, (_, __, inputEl) => {
      expect(inputEl).not.toBeChecked();

      fireEvent.click(inputEl);
      expect(inputEl).toBeChecked();

      fireEvent(inputEl, createEvent.click(inputEl, { metaKey: true }));
      expect(inputEl).not.toBeChecked();
      expect(onChange).toBeCalledTimes(2);
    });
  });
});

describe('RadioButton', () => {
  it('默认为选中时，边框色应为 text-primary-100', () => {
    createRadio('button', { defaultChecked: true }, (_, el) => {
      expect(el).toHaveClass('text-primary-100');
    });
  });

  it('当为 disabled 状态时，鼠标锚点应为 cursor-not-allowed', () => {
    createRadio('button', { disabled: true }, (_, el) => {
      expect(el).toHaveClass('cursor-not-allowed');
    });
  });
});
