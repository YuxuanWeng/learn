import { describe, expect, it, vi } from 'vitest';
import { Ref, createRef } from 'react';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { fireEvent, render } from '@testing-library/react';
import { Switch } from './Switch';
import { SwitchProps } from './types';

const createSwitch = (
  props?: SwitchProps & { ref?: Ref<HTMLButtonElement> },
  cb?: (container: HTMLElement, el: HTMLButtonElement) => void
) => {
  const { container } = render(<Switch {...props} />);
  const el = container.querySelector('button');
  if (el) {
    cb?.(container, el);
  } else {
    throw Error('都没有 Switch，测个 🔨🔨');
  }
};

describe('Switch', () => {
  it('基本使用', () => {
    createSwitch({}, (container, el) => {
      expect(container.querySelector('.unchecked')).toBeTruthy();
      fireEvent.click(el);
      expect(container.querySelector('.checked')).toBeTruthy();
    });
  });

  it('初始值为 true，在点击之后 checked 状态应切换为 false', () => {
    const onChange = vi.fn();
    createSwitch({ defaultChecked: true, onChange }, (container, el) => {
      expect(container.querySelector('.checked')).toBeTruthy();
      fireEvent.click(el);
      expect(container.querySelector('.unchecked')).toBeTruthy();
      expect(onChange).toHaveBeenCalled();
    });
  });

  it('当为 disabled 状态时，点击不应切换 Switch', () => {
    const onChange = vi.fn();
    createSwitch({ disabled: true, checked: true, onChange }, (container, el) => {
      expect(container.querySelector('.checked')).toBeTruthy();
      fireEvent.click(el);
      expect(container.querySelector('.checked')).toBeTruthy();
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  it('使用 ref 能正常聚/失焦 Switch', () => {
    const ref = createRef<HTMLButtonElement>();
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    createSwitch({ ref, onFocus, onBlur }, (_, el) => {
      ref.current?.focus();
      expect(el).toHaveFocus();

      ref.current?.blur();
      expect(el).not.toHaveFocus();

      expect(onFocus).toHaveBeenCalled();
      expect(onBlur).toHaveBeenCalled();
    });
  });

  it('使用空格能正常切换 Switch', () => {
    const ref = createRef<HTMLButtonElement>();
    const onChange = vi.fn();
    const onKeyDown = vi.fn();
    createSwitch({ ref, onChange, onKeyDown }, (container, el) => {
      expect(container.querySelector('.unchecked')).toBeTruthy();

      ref.current?.focus();
      expect(el).toHaveFocus();

      fireEvent.keyDown(el, { key: KeyboardKeys.Space });
      expect(container.querySelector('.checked')).toBeTruthy();
      expect(onChange).toHaveBeenCalled();
      expect(onKeyDown).toHaveBeenCalled();
    });
  });
});
