import { describe, expect, it, vi } from 'vitest';
import { Ref } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { changeInput } from '@packages/utils/testing';
import { Parsing } from '.';
import { ParsingProps } from './types';

const createVertical = (
  props?: ParsingProps & { ref?: Ref<HTMLTextAreaElement> },
  cb?: (container: HTMLElement, el: HTMLLabelElement, inputEl: HTMLTextAreaElement) => void
) => {
  const { container } = render(<Parsing.Vertical {...props} />);
  const el = container.querySelector('label');
  const inputEl = el?.querySelector('textarea');
  if (el && inputEl) {
    cb?.(container, el, inputEl);
  } else {
    throw Error('都没有 Parsing.Vertical，测个 🔨🔨');
  }
};

describe('Parsing.Vertical', () => {
  it('基本使用', () => {
    createVertical({}, container => {
      expect(container).toBeTruthy();
    });
  });

  it('受控模式', () => {
    const value = '内容文本';
    createVertical({ value }, (_, __, inputEl) => {
      expect(inputEl.value).toBe(value);

      changeInput(inputEl, '改变内容');
      expect(inputEl.value).toBe(value);
    });
  });

  it('初始值为 before，在输入之后 value 应改变为 after', () => {
    const onChange = vi.fn();
    createVertical({ defaultValue: 'before', onChange }, (_, __, inputEl) => {
      expect(inputEl.value).toBe('before');

      changeInput(inputEl, 'after');
      expect(inputEl.value).toBe('after');
      expect(onChange).toHaveBeenCalled();
    });
  });

  it('当为 error 状态，应展示错误提醒信息与相应背景颜色', () => {
    const errorText = '出错啦哥！';
    createVertical({ error: true, errorText }, (_, el) => {
      expect(screen.getByLabelText(errorText)).toBeInTheDocument();
      expect(el).toHaveClass('border-danger-200 focus-within:bg-danger-600');
    });
  });

  it('设置 controllers', () => {
    const ariaAttribute = 'div[aria-valuetext="controllers"]';
    // @ts-ignore
    createVertical({ controllers: ['nothing'] }, container => {
      const controllersEl = container.querySelector(ariaAttribute);
      expect(controllersEl).toBeInTheDocument();
    });

    createVertical({ controllers: [] }, container => {
      const controllersEl = container.querySelector(ariaAttribute);
      expect(controllersEl).not.toBeInTheDocument();
    });

    createVertical({ primaryBtnProps: { label: '主要按钮' }, secondaryBtnProps: { label: '辅助按钮' } }, () => {
      expect(screen.getByRole('button', { name: '主要按钮' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '辅助按钮' })).toBeInTheDocument();
    });
  });

  it('点击操作栏按钮按钮应响应事件', () => {
    const onPrimaryClick = vi.fn();
    const onSecondaryClick = vi.fn();

    createVertical({ value: 'before', onPrimaryClick, onSecondaryClick }, () => {
      const primaryBtnEl = screen.getByRole('button', { name: '开始识别' });
      const secondaryBtnEl = screen.getByRole('button', { name: '清空' });

      fireEvent.click(primaryBtnEl);
      fireEvent.click(secondaryBtnEl);

      expect(onPrimaryClick).toHaveBeenCalled();
      expect(onSecondaryClick).toHaveBeenCalled();
    });
  });

  it('当为 error 状态，点击 primary 按钮不应响应事件', () => {
    const onPrimaryClick = vi.fn();
    const onSecondaryClick = vi.fn();

    createVertical({ error: true, value: 'before', onPrimaryClick, onSecondaryClick }, () => {
      const primaryBtnEl = screen.getByRole('button', { name: '开始识别' });
      const secondaryBtnEl = screen.getByRole('button', { name: '清空' });

      fireEvent.click(primaryBtnEl);
      fireEvent.click(secondaryBtnEl);

      expect(onPrimaryClick).not.toHaveBeenCalled();
      expect(onSecondaryClick).toHaveBeenCalled();
    });
  });

  it('当为没有输入内容，点击操作栏按钮不应响应事件', () => {
    const onPrimaryClick = vi.fn();
    const onSecondaryClick = vi.fn();

    createVertical({ onPrimaryClick, onSecondaryClick }, () => {
      const primaryBtnEl = screen.getByRole('button', { name: '开始识别' });
      const secondaryBtnEl = screen.getByRole('button', { name: '清空' });

      fireEvent.click(primaryBtnEl);
      fireEvent.click(secondaryBtnEl);

      expect(onPrimaryClick).not.toHaveBeenCalled();
      expect(onSecondaryClick).not.toHaveBeenCalled();
    });
  });

  it('当为操作栏按钮为 disabled 状态，点击操作栏按钮按钮不应响应事件', () => {
    const onPrimaryClick = vi.fn();
    const onSecondaryClick = vi.fn();

    const disabled = true;
    createVertical(
      {
        value: 'before',
        primaryBtnProps: { disabled },
        secondaryBtnProps: { disabled },
        onPrimaryClick,
        onSecondaryClick
      },
      () => {
        const primaryBtnEl = screen.getByRole('button', { name: '开始识别' });
        const secondaryBtnEl = screen.getByRole('button', { name: '清空' });

        fireEvent.click(primaryBtnEl);
        fireEvent.click(secondaryBtnEl);

        expect(onPrimaryClick).not.toHaveBeenCalled();
        expect(onSecondaryClick).not.toHaveBeenCalled();
      }
    );
  });

  it('非受控模式下，点击辅助按钮应默认清空输入内容', () => {
    const onChange = vi.fn();
    const onSecondaryClick = vi.fn();

    createVertical({ onChange, onSecondaryClick }, (_, __, inputEl) => {
      changeInput(inputEl, 'before');
      expect(inputEl).toHaveValue('before');

      const secondaryBtnEl = screen.getByRole('button', { name: '清空' });
      fireEvent.click(secondaryBtnEl);

      expect(onSecondaryClick).toHaveBeenCalled();
      expect(onChange).toHaveBeenCalled();
      expect(inputEl).toHaveValue('');
    });
  });
});
