import { describe, expect, it, vi } from 'vitest';
import { Ref, createRef } from 'react';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { fireEvent, render, screen } from '@testing-library/react';
import { changeInput, clickEl } from '@packages/utils/testing';
import { TextArea } from './TextArea';
import { TextAreaProps } from './types';

const longText =
  '一段很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的文本';

const createTextArea = (
  props?: TextAreaProps & { ref?: Ref<HTMLTextAreaElement> },
  cb?: (container: HTMLElement, el: HTMLLabelElement, inputEl: HTMLTextAreaElement) => void
) => {
  const { container } = render(<TextArea {...props} />);
  const el = container.querySelector('label');
  const inputEl = el?.querySelector('textarea');
  if (el && inputEl) {
    cb?.(container, el, inputEl);
  } else {
    throw Error('都没有 TextArea，测个 🔨🔨');
  }
};

describe('TextArea', () => {
  it('基本使用', () => {
    createTextArea({}, container => {
      expect(container).toBeTruthy();
    });
  });

  it('受控模式', () => {
    const value = '内容文本';
    createTextArea({ value }, (_, __, inputEl) => {
      expect(inputEl.value).toBe(value);

      changeInput(inputEl, '改变内容');
      expect(inputEl.value).toBe(value);
    });
  });

  it('初始值为 before，在输入之后 value 应改变为 after', () => {
    const onChange = vi.fn();
    createTextArea({ defaultValue: 'before', onChange }, (_, __, inputEl) => {
      expect(inputEl.value).toBe('before');

      changeInput(inputEl, 'after');
      expect(inputEl.value).toBe('after');
      expect(onChange).toHaveBeenCalled();
    });
  });

  it('当为 disabled 状态，输入不应改变 TextArea value', () => {
    const onChange = vi.fn();
    createTextArea({ disabled: true, defaultValue: 'before', onChange }, (_, __, inputEl) => {
      expect(inputEl.value).toBe('before');

      changeInput(inputEl, 'after');
      expect(inputEl.value).toBe('before');
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  it('使用 ref 能正常聚/失焦 TextArea', () => {
    const ref = createRef<HTMLTextAreaElement>();
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    createTextArea({ ref, onFocus, onBlur }, (_, __, inputEl) => {
      ref.current?.focus();
      expect(inputEl).toHaveFocus();

      ref.current?.blur();
      expect(inputEl).not.toHaveFocus();

      expect(onFocus).toHaveBeenCalled();
      expect(onBlur).toHaveBeenCalled();
    });
  });

  it('点击 TextArea 外层时应聚焦 TextArea', () => {
    const ref = createRef<HTMLTextAreaElement>();
    const onClick = vi.fn();
    const onFocus = vi.fn();
    createTextArea({ ref, onClick, onFocus }, (_, el, inputEl) => {
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

  it('当为 disabled 状态，点击 TextArea 外层时不应聚焦 TextArea', () => {
    const ref = createRef<HTMLTextAreaElement>();
    const onFocus = vi.fn();
    createTextArea({ ref, disabled: true, onFocus }, (_, el, inputEl) => {
      clickEl(el);

      expect(inputEl).not.toHaveFocus();
      expect(onFocus).not.toHaveBeenCalled();
    });
  });

  it('设置标题', () => {
    const label = '标题';
    createTextArea({ label }, () => {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
  });

  it('设置 size', () => {
    const size = 'xs';
    createTextArea({ size }, () => {
      expect(screen.getByRole('textbox')).toHaveClass('text-sm');
    });
  });

  it('设置 padding', () => {
    let padding: number | number[] = [5];
    createTextArea({ padding }, (_, el, inputEl) => {
      const paddingVal = padding[0];
      expect(el).toHaveStyle(`padding: ${paddingVal}px 0px ${paddingVal}px ${paddingVal}px`);
      expect(inputEl).toHaveStyle(`paddingRight: ${paddingVal + 1}px`);
    });

    padding = [5, 10];
    createTextArea({ padding }, (_, el, inputEl) => {
      expect(el).toHaveStyle(`padding: ${padding[0]}px 0px ${padding[0]}px ${padding[1]}px`);
      expect(inputEl).toHaveStyle(`paddingRight: ${padding[1] + 1}px`);
    });

    padding = [5, 10, 15];
    createTextArea({ padding }, (_, el, inputEl) => {
      expect(el).toHaveStyle(`padding: ${padding[0]}px 0px ${padding[2]}px 10px`);
      expect(inputEl).toHaveStyle(`paddingRight: ${padding[1] + 1}px`);
    });

    padding = [5, 10, 15, 20];
    createTextArea({ padding }, (_, el, inputEl) => {
      expect(el).toHaveStyle(`padding: ${padding[0]}px 0px ${padding[2]}px ${padding[3]}px`);
      expect(inputEl).toHaveStyle(`paddingRight: ${padding[1] + 1}px`);
    });

    padding = [5, 10, 15, 20, 25];
    createTextArea({ padding }, (_, el, inputEl) => {
      expect(el).toHaveStyle('padding: 0px 0px 0px 0px');
      expect(inputEl).toHaveStyle('paddingRight: 0px');
    });

    padding = 5;
    createTextArea({ padding }, (_, el, inputEl) => {
      expect(el).toHaveStyle('padding: 5px 0 5px 5px');
      expect(inputEl).toHaveStyle('paddingRight: 6px');
    });
  });

  it('设置圆角', () => {
    createTextArea({ rounded: true }, (_, el) => {
      expect(el).toHaveClass('rounded-lg');
    });
  });

  it('通过某个按键清空 TextArea value', () => {
    const onChange = vi.fn();
    const onKeyDown = vi.fn();

    createTextArea(
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

    createTextArea({ defaultValue: 'before', onChange, onEnterPress, onKeyDown }, (_, __, inputEl) => {
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

    createTextArea({ defaultValue: 'before', disabled: true, onChange, onEnterPress, onKeyDown }, (_, __, inputEl) => {
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

    createTextArea(
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

  it('自适应高度', async () => {
    window.getComputedStyle = vi.fn().mockImplementation(() => ({
      borderBottomWidth: '0px',
      borderTopWidth: '0px',
      lineHeight: '20px',
      paddingBottom: '0px',
      paddingTop: '0px'
    }));

    let autoSize: TextAreaProps['autoSize'] = true;
    const defaultValue = 'before';

    createTextArea({ defaultValue, autoSize }, (_, __, inputEl) => {
      expect(inputEl.value).toBe('before');
      expect(inputEl.style.height).toBe('20px');
    });

    createTextArea({ defaultValue, autoSize: { maxRows: 3 } }, (_, __, inputEl) => {
      expect(inputEl.value).toBe('before');
      expect(inputEl.style.height).toBe('20px');
      vi.spyOn(inputEl, 'scrollHeight', 'get').mockImplementation(() => 129);

      changeInput(inputEl, longText);
      expect(inputEl.style.height).not.toBe('20px');
    });

    createTextArea({ defaultValue, autoSize: { minRows: 2, maxRows: 3 } }, (_, __, inputEl) => {
      expect(inputEl.value).toBe('before');
      expect(inputEl.style.height).toBe('40px');
    });
  });

  it('设置 maxLength & showWordLimit，应当展示字数限制', () => {
    const defaultValue = 'before';

    createTextArea(
      {
        defaultValue,
        autoSize: { minRows: 1, maxRows: 3 },
        showWordLimit: true,
        maxLength: { errorOnly: true, length: 100 }
      },
      (container, __, inputEl) => {
        expect(inputEl.value).toBe('before');
        expect(inputEl.style.height).toBe('20px');

        let limitEl = container.querySelector('.s-textarea-limit');
        expect(limitEl).not.toBeInTheDocument();
        vi.spyOn(inputEl, 'scrollHeight', 'get').mockImplementation(() => 129);

        changeInput(inputEl, longText);
        limitEl = container.querySelector('.s-textarea-limit');
        expect(inputEl.style.height).not.toBe('20px');
        expect(limitEl).toBeInTheDocument();
      }
    );
  });

  it('点击 Clean icon, 焦点应该聚焦在 TextArea', () => {
    const iconCls = '.s-textarea-clear-icon';
    const onChange = vi.fn();

    createTextArea({ defaultValue: 'before', onChange, clearIcon: true }, (container, _, inputEl) => {
      const clearIconEl = container.querySelector(iconCls);
      expect(clearIconEl).toBeInTheDocument();

      expect(inputEl.value).toBe('before');

      if (clearIconEl) fireEvent.click(clearIconEl);
      expect(inputEl.value).toBe('');
      expect(inputEl).toHaveFocus();
    });
  });

  it('点击 Clean icon 应清空 TextArea value', () => {
    const iconCls = '.s-textarea-clear-icon';
    const onChange = vi.fn();

    createTextArea({ defaultValue: 'before', onChange, clearIcon: true }, (container, _, inputEl) => {
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

  it('只按下 Clean icon 不应清空 TextArea value', () => {
    const iconCls = '.s-textarea-clear-icon';
    const onChange = vi.fn();

    createTextArea({ defaultValue: 'before', onChange, clearIcon: true }, (container, _, inputEl) => {
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
    const iconCls = '.s-textarea-clear-icon';

    createTextArea({ disabled: true, clearIcon: true }, (container, _, inputEl) => {
      const clearIconEl = container.querySelector(iconCls);
      expect(clearIconEl).not.toBeInTheDocument();
    });
  });
});
