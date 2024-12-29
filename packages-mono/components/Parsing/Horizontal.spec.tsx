import { describe, expect, it, vi } from 'vitest';
import { Ref } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { changeInput } from '@packages/utils/testing';
import { Parsing } from '.';
import { ParsingProps } from './types';

const createHorizontal = (
  props?: ParsingProps & { ref?: Ref<HTMLTextAreaElement> },
  cb?: (container: HTMLElement, el: HTMLLabelElement, inputEl: HTMLTextAreaElement) => void
) => {
  const { container } = render(<Parsing.Horizontal {...props} />);
  const el = container.querySelector('label');
  const inputEl = el?.querySelector('textarea');
  if (el && inputEl) {
    cb?.(container, el, inputEl);
  } else {
    throw Error('都没有 Parsing.Horizontal，测个 🔨🔨');
  }
};

describe('Parsing.Horizontal', () => {
  it('基本使用', () => {
    createHorizontal({}, container => {
      expect(container).toBeTruthy();
    });
  });

  it('受控模式', () => {
    const value = '内容文本';
    createHorizontal({ value }, (_, __, inputEl) => {
      expect(inputEl.value).toBe(value);

      changeInput(inputEl, '改变内容');
      expect(inputEl.value).toBe(value);
    });
  });

  it('初始值为 before，在输入之后 value 应改变为 after', () => {
    const onChange = vi.fn();
    createHorizontal({ defaultValue: 'before', onChange }, (_, __, inputEl) => {
      expect(inputEl.value).toBe('before');

      changeInput(inputEl, 'after');
      expect(inputEl.value).toBe('after');
      expect(onChange).toHaveBeenCalled();
    });
  });

  it('设置 controllers', () => {
    const ariaAttribute = 'div[aria-valuetext="controllers"]';
    // @ts-ignore
    createHorizontal({ controllers: ['nothing'] }, container => {
      const controllersEl = container.querySelector(ariaAttribute);
      expect(controllersEl).toBeInTheDocument();
    });

    createHorizontal({ controllers: [] }, container => {
      const controllersEl = container.querySelector(ariaAttribute);
      expect(controllersEl).not.toBeInTheDocument();
    });

    createHorizontal({ primaryBtnProps: { label: '主要按钮' }, secondaryBtnProps: { label: '辅助按钮' } }, () => {
      expect(screen.getByRole('button', { name: '主要按钮' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '辅助按钮' })).toBeInTheDocument();
    });
  });

  it('点击操作栏按钮按钮应响应事件', () => {
    const onPrimaryClick = vi.fn();
    const onAuxiliaryClick = vi.fn();

    createHorizontal({ value: 'before', onPrimaryClick, onSecondaryClick: onAuxiliaryClick }, () => {
      const primaryBtnEl = screen.getByRole('button', { name: '开始识别' });
      const auxiliaryBtnEl = screen.getByRole('button', { name: '高级识别' });

      fireEvent.click(primaryBtnEl);
      fireEvent.click(auxiliaryBtnEl);

      expect(onPrimaryClick).toHaveBeenCalled();
      expect(onAuxiliaryClick).toHaveBeenCalled();
    });
  });

  it('当为没有输入内容，点击操作栏按钮不应响应事件', () => {
    const onPrimaryClick = vi.fn();
    const onAuxiliaryClick = vi.fn();

    createHorizontal({ onPrimaryClick, onSecondaryClick: onAuxiliaryClick }, () => {
      const primaryBtnEl = screen.getByRole('button', { name: '开始识别' });
      const auxiliaryBtnEl = screen.getByRole('button', { name: '高级识别' });

      fireEvent.click(primaryBtnEl);
      fireEvent.click(auxiliaryBtnEl);

      expect(onPrimaryClick).not.toHaveBeenCalled();
      expect(onAuxiliaryClick).not.toHaveBeenCalled();
    });
  });

  it('当为操作栏按钮为 disabled 状态，点击操作栏按钮按钮不应响应事件', () => {
    const onPrimaryClick = vi.fn();
    const onAuxiliaryClick = vi.fn();

    const disabled = true;
    createHorizontal(
      {
        value: 'before',
        primaryBtnProps: { disabled },
        secondaryBtnProps: { disabled },
        onPrimaryClick,
        onSecondaryClick: onAuxiliaryClick
      },
      () => {
        const primaryBtnEl = screen.getByRole('button', { name: '开始识别' });
        const auxiliaryBtnEl = screen.getByRole('button', { name: '高级识别' });

        fireEvent.click(primaryBtnEl);
        fireEvent.click(auxiliaryBtnEl);

        expect(onPrimaryClick).not.toHaveBeenCalled();
        expect(onAuxiliaryClick).not.toHaveBeenCalled();
      }
    );
  });
});
