import { describe, expect, it, vi } from 'vitest';
import { ReactNode, Ref, createRef } from 'react';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { IconCheck } from '@fepkg/icon-park-react';
import { fireEvent, render, screen } from '@testing-library/react';
import { changeInput, clickEl } from '@packages/utils/testing';
import { Input } from './Input';
import { InputProps } from './types';

const createInput = (
  props?: InputProps & { ref?: Ref<HTMLInputElement> },
  cb?: (container: HTMLElement, el: HTMLLabelElement, inputEl: HTMLInputElement) => void
) => {
  const { container } = render(<Input {...props} />);
  const el = container.querySelector('label');
  const inputEl = el?.querySelector('input');
  if (el && inputEl) {
    cb?.(container, el, inputEl);
  } else {
    throw Error('都没有 Input，测个 🔨🔨');
  }
};

describe('Input', () => {
  it('基本使用', () => {
    createInput({}, container => {
      expect(container).toBeTruthy();
    });
  });

  it('受控模式', () => {
    const value = '内容文本';
    createInput({ value }, (_, __, inputEl) => {
      expect(inputEl.value).toBe(value);

      changeInput(inputEl, '改变内容');
      expect(inputEl.value).toBe(value);
    });
  });

  it('初始值为 before，在输入之后 value 应改变为 after', () => {
    const onChange = vi.fn();
    createInput({ defaultValue: 'before', onChange }, (_, __, inputEl) => {
      expect(inputEl.value).toBe('before');

      changeInput(inputEl, 'after');
      expect(inputEl.value).toBe('after');
      expect(onChange).toHaveBeenCalled();
    });
  });

  it('当为 disabled 状态，输入不应改变 Input value', () => {
    const onChange = vi.fn();
    createInput({ disabled: true, defaultValue: 'before', onChange }, (_, __, inputEl) => {
      expect(inputEl.value).toBe('before');

      changeInput(inputEl, 'after');
      expect(inputEl.value).toBe('before');
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  it('使用 ref 能正常聚/失焦 Input', () => {
    const ref = createRef<HTMLInputElement>();
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    createInput({ ref, onFocus, onBlur }, (_, __, inputEl) => {
      ref.current?.focus();
      expect(inputEl).toHaveFocus();

      ref.current?.blur();
      expect(inputEl).not.toHaveFocus();

      expect(onFocus).toHaveBeenCalled();
      expect(onBlur).toHaveBeenCalled();
    });
  });

  it('点击 Input 外层时应聚焦 Input', () => {
    const ref = createRef<HTMLInputElement>();
    const onClick = vi.fn();
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    createInput({ ref, onClick, onFocus, onBlur }, (_, el, inputEl) => {
      clickEl(el);

      expect(inputEl).toHaveFocus();
      expect(onClick).toHaveBeenCalledTimes(1);
      expect(onFocus).toHaveBeenCalledOnce();

      clickEl(el);

      expect(inputEl).toHaveFocus();
      expect(onClick).toHaveBeenCalledTimes(2);
      expect(onFocus).toHaveBeenCalledOnce();
    });
  });

  it('当为 disabled 状态，点击 Input 外层时不应聚焦 Input', () => {
    const ref = createRef<HTMLInputElement>();
    const onFocus = vi.fn();
    createInput({ ref, disabled: true, onFocus }, (_, el, inputEl) => {
      clickEl(el);

      expect(inputEl).not.toHaveFocus();
      expect(onFocus).not.toHaveBeenCalled();
    });
  });

  it('点击 Clean icon, 焦点应该聚焦在 Input', () => {
    const iconCls = '.s-input-clear-icon';
    const onChange = vi.fn();

    createInput({ defaultValue: 'before', onChange }, (container, _, inputEl) => {
      const clearIconEl = container.querySelector(iconCls);
      expect(clearIconEl).toBeInTheDocument();

      expect(inputEl.value).toBe('before');

      if (clearIconEl) fireEvent.click(clearIconEl);
      expect(inputEl.value).toBe('');
      expect(inputEl).toHaveFocus();
    });
  });

  it('点击 Clean icon, 焦点不应该聚焦在 Input', () => {
    const iconCls = '.s-input-clear-icon';
    const onChange = vi.fn();

    createInput({ defaultValue: 'before', onChange, focusAfterClearing: false }, (container, _, inputEl) => {
      const clearIconEl = container.querySelector(iconCls);
      expect(clearIconEl).toBeInTheDocument();

      expect(inputEl.value).toBe('before');

      if (clearIconEl) fireEvent.click(clearIconEl);
      expect(inputEl.value).toBe('');
      expect(inputEl).not.toHaveFocus();
    });
  });

  it('点击 Clean icon 应清空 Input value', () => {
    const iconCls = '.s-input-clear-icon';
    const onChange = vi.fn();

    createInput({ defaultValue: 'before', onChange }, (container, _, inputEl) => {
      const clearIconEl = container.querySelector(iconCls);
      expect(clearIconEl).toBeInTheDocument();

      expect(inputEl.value).toBe('before');

      changeInput(inputEl, 'after');
      expect(inputEl.value).toBe('after');

      if (clearIconEl) fireEvent.click(clearIconEl);
      expect(inputEl.value).toBe('');
      expect(onChange).toHaveBeenCalledTimes(2);
    });
  });

  it('只按下 Clean icon 不应清空 Input value', () => {
    const iconCls = '.s-input-clear-icon';
    const onChange = vi.fn();

    createInput({ defaultValue: 'before', onChange }, (container, _, inputEl) => {
      const clearIconEl = container.querySelector(iconCls);
      expect(clearIconEl).toBeInTheDocument();

      expect(inputEl.value).toBe('before');

      changeInput(inputEl, 'after');
      expect(inputEl.value).toBe('after');

      if (clearIconEl) fireEvent.mouseDown(clearIconEl);
      expect(inputEl.value).toBe('after');
      expect(onChange).toHaveBeenCalledTimes(1);
    });
  });

  it('当为 disabled 状态，不应展示 Clean icon', () => {
    const iconCls = '.s-input-clear-icon';

    createInput({ disabled: true }, (container, _, inputEl) => {
      const clearIconEl = container.querySelector(iconCls);
      expect(clearIconEl).not.toBeInTheDocument();
    });
  });

  it('设置标题', () => {
    const label = '标题';
    createInput({ label }, () => {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
  });

  it('设置 size', () => {
    const size = 'xs';
    createInput({ size }, () => {
      expect(screen.getByRole('textbox')).toHaveClass('text-sm');
    });
  });

  it('设置 padding', () => {
    let padding: number | number[] = [5];
    createInput({ padding }, (_, el) => {
      expect(el).toHaveStyle(`padding: ${padding[0]}px`);
    });

    padding = [5, 10];
    createInput({ padding }, (_, el) => {
      expect(el).toHaveStyle(`padding: ${padding[0]}px ${padding[1]}px`);
    });

    padding = [5, 10, 15];
    createInput({ padding }, (_, el) => {
      expect(el).toHaveStyle(`padding: ${padding[0]}px ${padding[1]}px ${padding[2]}px`);
    });

    padding = [5, 10, 15, 20];
    createInput({ padding }, (_, el) => {
      expect(el).toHaveStyle(`padding: ${padding[0]}px ${padding[1]}px ${padding[2]}px ${padding[3]}px`);
    });

    padding = [5, 10, 15, 20, 25];
    createInput({ padding }, (_, el) => {
      expect(el).toHaveStyle('padding: 0');
    });

    padding = 5;
    createInput({ padding }, (_, el) => {
      expect(el).toHaveStyle('padding: 5px');
    });
  });

  it('设置/不设置 Suffix icon', () => {
    const iconCls = '.s-input-suffix-icon';

    let suffixIcon: ReactNode | null = <IconCheck />;
    createInput({ suffixIcon }, container => {
      expect(container.querySelector(iconCls)).toBeInTheDocument();
    });

    suffixIcon = null;
    createInput({ suffixIcon }, container => {
      expect(container.querySelector(iconCls)).not.toBeInTheDocument();
    });
  });

  // it('当为 disabled 状态，设置 Suffix icon 颜色应为 peer-disabled/input:text-gray-400', () => {
  //   const iconCls = '.s-input-suffix-icon';

  //   const suffixIcon = <IconCheck />;
  //   createInput({ disabled: true, suffixIcon }, container => {
  //     const iconEl = container.querySelector(iconCls);
  //     expect(iconEl).toHaveClass('peer-disabled/input:text-gray-400');
  //     expect(iconEl).not.toHaveClass('bg-gray-300');
  //   });
  // });

  it('点击 Suffix icon 应响应事件', () => {
    const iconCls = '.s-input-suffix-icon';
    const onSuffixClick = vi.fn();

    const suffixIcon = <IconCheck />;
    createInput({ suffixIcon, onSuffixClick }, container => {
      const iconEl = container.querySelector(iconCls);
      expect(iconEl).toBeInTheDocument();

      if (iconEl) fireEvent.click(iconEl);
      expect(onSuffixClick).toHaveBeenCalled();
    });
  });

  it('当为 disabled 状态，点击 Suffix icon 不应响应事件', () => {
    const iconCls = '.s-input-suffix-icon';
    const onSuffixClick = vi.fn();

    const suffixIcon = <IconCheck />;
    createInput({ disabled: true, suffixIcon, onSuffixClick }, container => {
      const iconEl = container.querySelector(iconCls);
      expect(iconEl).toBeInTheDocument();

      if (iconEl) fireEvent.click(iconEl);
      expect(onSuffixClick).not.toHaveBeenCalled();
    });
  });

  it('只按下 Suffix icon 不应响应事件', () => {
    const iconCls = '.s-input-suffix-icon';
    const onSuffixClick = vi.fn();

    const suffixIcon = <IconCheck />;
    createInput({ suffixIcon, onSuffixClick }, container => {
      const iconEl = container.querySelector(iconCls);
      expect(iconEl).toBeInTheDocument();

      if (iconEl) fireEvent.mouseDown(iconEl);
      expect(onSuffixClick).not.toHaveBeenCalled();
    });
  });

  it('设置/不设置 Clean icon', () => {
    const iconCls = '.s-input-clear-icon';

    let clearIcon: ReactNode | null = <IconCheck />;
    createInput({ clearIcon: clearIcon }, container => {
      expect(container.querySelector(iconCls)).toBeInTheDocument();
    });

    clearIcon = null;
    createInput({ clearIcon }, container => {
      expect(container.querySelector(iconCls)).not.toBeInTheDocument();
    });
  });

  it('设置圆角', () => {
    createInput({ rounded: true }, (_, el) => {
      expect(el).toHaveClass('rounded-lg');
    });
  });

  it('通过某个按键清空 Input value', () => {
    const onChange = vi.fn();
    const onKeyDown = vi.fn();

    createInput(
      { defaultValue: 'before', clearByKeyboard: KeyboardKeys.Escape, onChange, onKeyDown },
      (_, __, inputEl) => {
        expect(inputEl.value).toBe('before');

        changeInput(inputEl, 'after');
        expect(inputEl.value).toBe('after');
        expect(onChange).toHaveBeenCalled();

        fireEvent.keyDown(inputEl, { key: KeyboardKeys.Escape });
        expect(inputEl.value).toBe('');
        expect(onKeyDown).toHaveBeenCalled();
      }
    );
  });

  it('按下回车应触发回调', () => {
    const onChange = vi.fn();
    const onEnterPress = vi.fn();
    const onKeyDown = vi.fn();

    createInput({ defaultValue: 'before', onChange, onEnterPress, onKeyDown }, (_, __, inputEl) => {
      expect(inputEl.value).toBe('before');

      changeInput(inputEl, 'after');
      fireEvent.keyDown(inputEl, { key: KeyboardKeys.Enter });
      expect(inputEl.value).toBe('after');
      expect(onChange).toHaveBeenCalled();
      expect(onEnterPress).toHaveBeenCalled();
      expect(onKeyDown).toHaveBeenCalled();
    });
  });

  it('当为 disabled 状态，按下回车不应触发回调', () => {
    const onChange = vi.fn();
    const onEnterPress = vi.fn();
    const onKeyDown = vi.fn();

    createInput({ defaultValue: 'before', disabled: true, onChange, onEnterPress, onKeyDown }, (_, __, inputEl) => {
      expect(inputEl.value).toBe('before');

      changeInput(inputEl, 'after');
      fireEvent.keyDown(inputEl, { key: KeyboardKeys.Enter });
      expect(inputEl.value).toBe('before');
      expect(onChange).not.toHaveBeenCalled();
      expect(onEnterPress).not.toHaveBeenCalled();
      expect(onKeyDown).not.toHaveBeenCalled();
    });
  });

  it('当为 composition 状态，composition 系列输入应优化', () => {
    const onChange = vi.fn();
    const onEnterPress = vi.fn();
    const onKeyDown = vi.fn();
    const onCompositionStart = vi.fn();
    const onCompositionUpdate = vi.fn();
    const onCompositionEnd = vi.fn();

    createInput(
      {
        defaultValue: 'before',
        composition: true,
        onChange,
        onEnterPress,
        onKeyDown,
        onCompositionStart,
        onCompositionUpdate,
        onCompositionEnd
      },
      (_, __, inputEl) => {
        expect(inputEl.value).toBe('before');

        fireEvent.focus(inputEl);
        fireEvent.compositionStart(inputEl, { target: { value: '你好' } });
        fireEvent.compositionUpdate(inputEl, { target: { value: '你好' } });
        fireEvent.keyDown(inputEl, { key: KeyboardKeys.Enter });
        fireEvent.compositionEnd(inputEl);
        expect(inputEl.value).toBe('你好');
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onEnterPress).toHaveBeenCalled();
        expect(onKeyDown).toHaveBeenCalled();
        expect(onCompositionStart).toHaveBeenCalled();
        expect(onCompositionUpdate).toHaveBeenCalled();
        expect(onCompositionEnd).toHaveBeenCalled();
      }
    );
  });
});
