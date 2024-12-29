import { describe, expect, it, vi } from 'vitest';
import { ReactNode, Ref, createRef } from 'react';
import { IconCheck } from '@fepkg/icon-park-react';
import { RenderResult, fireEvent, getByText, render, screen } from '@testing-library/react';
import { changeInput, clickEl } from '@packages/utils/testing';
import { Select } from './Select';
import { SelectProps } from './types';

const createSelect = (props?: SelectProps & { ref?: Ref<HTMLInputElement> }, cb?: (res: RenderResult) => void) => {
  const options = [
    { label: 'apple', value: 'apple' },
    { label: 'banana', value: 'banana' },
    { label: 'orange', value: 'orange' }
  ];

  const res = render(
    <Select
      options={options}
      {...props}
    />
  );
  const el = res.container.querySelector('label');

  if (el) {
    cb?.(res);
  } else {
    throw Error('都没有 Select，测个 🔨🔨');
  }
};

describe('Select', () => {
  it('基本使用', () => {
    createSelect({}, container => {
      expect(container).toBeTruthy();
    });
  });

  it('受控模式', () => {
    // 单选
    createSelect({ value: 'banana' }, ({ getByText }) => {
      expect(getByText('banana', { selector: '.s-select-display' })).toBeInTheDocument();
    });

    // 多选
    createSelect({ multiple: true, value: ['banana', 'apple'] }, ({ getByText }) => {
      expect(getByText('2', { selector: '.s-select-tags' })).toBeInTheDocument();
      expect(getByText('banana , apple', { selector: '.s-select-display' })).toBeInTheDocument();
    });
  });

  it('使用 ref 能正常聚/失焦 Select', () => {
    const ref = createRef<HTMLInputElement>();
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    createSelect({ ref, onFocus, onBlur }, ({ container }) => {
      const inputEl = container.querySelector('input');
      ref.current?.focus();
      expect(inputEl).toHaveFocus();

      ref.current?.blur();
      expect(inputEl).not.toHaveFocus();

      expect(onFocus).toHaveBeenCalled();
      expect(onBlur).toHaveBeenCalled();
    });
  });

  it('当为 disabled 状态，点击 Select 外层时不应聚焦 Select，不应该展示下拉框', () => {
    const ref = createRef<HTMLInputElement>();
    const onFocus = vi.fn();
    createSelect({ ref, disabled: true, onFocus }, ({ container }) => {
      const labelEl = container.querySelector('label') as HTMLElement;
      const inputEl = container.querySelector('input');

      clickEl(container);

      expect(labelEl).toHaveClass('s-select-disabled');
      expect(labelEl).not.toHaveClass('s-select-open');
      expect(inputEl).not.toHaveFocus();
      expect(onFocus).not.toHaveBeenCalled();
    });
  });

  it('点击 Select 时，下拉框展示，失焦后，下拉框隐藏', () => {
    createSelect({}, ({ baseElement, container }) => {
      const dropdownEl = baseElement.querySelector('.s-select-dropdown') as HTMLElement;
      expect(dropdownEl).toBeInTheDocument();

      const labelEl = container.querySelector('label') as HTMLElement;

      clickEl(labelEl);
      expect(labelEl).toHaveClass('s-select-open');

      clickEl(labelEl);
      expect(labelEl).not.toHaveClass('s-select-open');
    });
  });

  it('点击选项时，按是否为 search 模式正确展示/隐藏下拉框', () => {
    createSelect({ search: true }, ({ baseElement, container }) => {
      const dropdownEl = baseElement.querySelector('.s-select-dropdown') as HTMLElement;
      expect(dropdownEl).toBeInTheDocument();

      const labelEl = container.querySelector('label') as HTMLElement;
      const inputEl = container.querySelector('input') as HTMLElement;

      clickEl(labelEl);
      expect(labelEl).toHaveClass('s-select-open');

      clickEl(labelEl);
      expect(labelEl).toHaveClass('s-select-open');

      clickEl(inputEl);
      expect(labelEl).toHaveClass('s-select-open');

      clickEl(inputEl);
      expect(labelEl).toHaveClass('s-select-open');
    });
  });

  it('初始值为 banana，在选择之后 value 应变为 apple', () => {
    const onChange = vi.fn();

    createSelect({ defaultValue: 'banana', onChange }, async ({ container, getByText }) => {
      expect(getByText('banana', { selector: '.s-select-display' })).toBeInTheDocument();

      clickEl(container);

      const appleEl = getByText('apple', { selector: '.s-select-dropdown-option' });
      clickEl(appleEl);

      expect(getByText('apple', { selector: '.s-select-display' })).toBeInTheDocument();
      expect(onChange.mock.lastCall[0]).toEqual('apple');
    });
  });

  it('初始值为 [banana, apple]，在选择之后 value 应变为 [apple]', () => {
    const onChange = vi.fn();

    createSelect({ multiple: true, defaultValue: ['banana', 'apple'], onChange }, async ({ container, getByText }) => {
      expect(getByText('banana , apple', { selector: '.s-select-display' })).toBeInTheDocument();

      clickEl(container);

      const bananaEl = getByText('banana', { selector: '.s-select-dropdown-option .s-checkbox-inner' });
      clickEl(bananaEl);

      expect(getByText('apple', { selector: '.s-select-display' })).toBeInTheDocument();
      expect(onChange.mock.lastCall[0]).toEqual(['apple']);
    });
  });

  it('初始值为 [apple]，在选择之后 value 应变为 [apple, orange]', () => {
    const onChange = vi.fn();

    createSelect({ multiple: true, defaultValue: ['apple'], onChange }, async ({ container, getByText }) => {
      expect(getByText('apple', { selector: '.s-select-display' })).toBeInTheDocument();

      clickEl(container);

      const bananaEl = getByText('orange', { selector: '.s-select-dropdown-option .s-checkbox-inner' });
      clickEl(bananaEl);

      expect(getByText('apple , orange', { selector: '.s-select-display' })).toBeInTheDocument();
      expect(onChange.mock.lastCall[0]).toEqual(['apple', 'orange']);
    });
  });

  it('当为 search 模式时，能够输入内容并展示输入内容', () => {
    const onInputChange = vi.fn();

    createSelect({ search: true, defaultValue: 'apple', onInputChange }, ({ container, getByText }) => {
      expect(getByText('apple', { selector: '.s-select-display' })).toBeInTheDocument();

      const inputEl = container.querySelector('.s-select-input') as HTMLInputElement;
      changeInput(inputEl, 'after');

      expect(inputEl.value).toBe('after');
      expect(onInputChange).toHaveBeenCalled();
    });
  });

  it('当为 multiple 模式时，点击选项，能够选择/不选择选项', () => {
    const onChange = vi.fn();

    createSelect({ multiple: true, defaultValue: ['banana', 'apple'], onChange }, ({ container, getByText }) => {
      expect(getByText('banana , apple', { selector: '.s-select-display' })).toBeInTheDocument();

      clickEl(container);

      const bananaEl = getByText('banana', { selector: '.s-select-dropdown-option .s-checkbox-inner' });
      clickEl(bananaEl);
      expect(getByText('apple', { selector: '.s-select-display' })).toBeInTheDocument();
      expect(onChange.mock.lastCall[0]).toEqual(['apple']);

      clickEl(bananaEl);
      expect(getByText('apple , banana', { selector: '.s-select-display' })).toBeInTheDocument();
      expect(onChange.mock.lastCall[0]).toEqual(['apple', 'banana']);
    });
  });

  it('当为 multiple 模式时，设置 tags 控制是否展示已选项标签', () => {
    const defaultValue = ['banana'];
    const tagsCls = '.s-select-dropdown-selected';

    createSelect({ multiple: true, tags: false, defaultValue }, ({ baseElement }) => {
      expect(baseElement.querySelector(tagsCls)).not.toBeInTheDocument();
    });
  });

  it('当为 multiple 模式时，点击已选项标签 Clean icon 应取消选中已选项', () => {
    const defaultValue = ['banana'];
    const tagsCls = '.s-select-dropdown-selected';
    const onChange = vi.fn();

    createSelect({ multiple: true, defaultValue, onChange }, ({ baseElement, container }) => {
      expect(baseElement.querySelector(tagsCls)).toBeInTheDocument();

      clickEl(container);

      const iconEl = baseElement.querySelector('.s-select-dropdown-tag-close-icon') as HTMLElement;
      clickEl(iconEl);

      expect(onChange.mock.lastCall[0]).toEqual([]);
    });
  });

  it('当为 search 模式下，设置 selectedOptions', () => {
    const selectedOptions = [{ label: 'banana', value: 'banana' }];

    createSelect({ search: true, selectedOptions, defaultValue: 'banana' }, ({ getByText }) => {
      expect(getByText('banana', { selector: '.s-select-display' })).toBeInTheDocument();
    });
  });

  it('当为 search & multiple 模式下，设置 selectedOptions', () => {
    const selectedOptions = [{ label: 'banana', value: 'banana' }];
    const onChange = vi.fn();

    createSelect(
      { multiple: true, search: true, selectedOptions, defaultValue: ['banana'], onChange },
      ({ container, getByText }) => {
        expect(getByText('banana', { selector: '.s-select-display' })).toBeInTheDocument();

        clickEl(container);

        const appleEl = getByText('apple', { selector: '.s-select-dropdown-option .s-checkbox-inner' });
        clickEl(appleEl);

        expect(getByText('banana , apple', { selector: '.s-select-display' })).toBeInTheDocument();
        expect(onChange.mock.lastCall[0]).toEqual(['banana', 'apple']);
      }
    );
  });

  it('点击 Clean icon 应清空所选值与输入内容', () => {
    const onChange = vi.fn();

    // 单选
    createSelect({ search: true, defaultValue: 'banana', onChange }, ({ container, getByText }) => {
      expect(getByText('banana', { selector: '.s-select-display' })).toBeInTheDocument();

      const inputEl = container.querySelector('.s-select-input') as HTMLInputElement;
      changeInput(inputEl, 'after');

      expect(inputEl.value).toBe('after');

      const iconEl = container.querySelector('.s-select-clear-icon') as HTMLElement;
      clickEl(iconEl);

      expect(inputEl.value).toBe('');
      expect(onChange.mock.lastCall[0]).toEqual(null);
    });

    // 多选
    createSelect(
      { search: true, multiple: true, defaultValue: ['banana', 'apple'], onChange },
      ({ container, getByText }) => {
        expect(getByText('banana , apple', { selector: '.s-select-display' })).toBeInTheDocument();

        const inputEl = container.querySelector('.s-select-input') as HTMLInputElement;
        changeInput(inputEl, 'after');

        expect(inputEl.value).toBe('after');

        const iconEl = container.querySelector('.s-select-clear-icon') as HTMLElement;
        clickEl(iconEl);

        expect(inputEl.value).toBe('');
        expect(onChange.mock.lastCall[0]).toEqual([]);
      }
    );
  });

  it('当为 disabled 状态，不应展示 Clean icon', () => {
    createSelect({ disabled: true }, ({ container }) => {
      expect(container.querySelector('.s-select-clear-icon')).not.toBeInTheDocument();
    });
  });

  it('设置/不设置 Suffix icon', () => {
    const iconCls = '.s-select-suffix-icon';

    let suffixIcon: ReactNode | null = <IconCheck />;
    createSelect({ suffixIcon }, ({ container }) => {
      expect(container.querySelector(iconCls)).toBeInTheDocument();
    });

    suffixIcon = null;
    createSelect({ suffixIcon }, ({ container }) => {
      expect(container.querySelector(iconCls)).not.toBeInTheDocument();
    });
  });

  it('设置/不设置 Clean icon', () => {
    const iconCls = '.s-select-clear-icon';

    let clearIcon: ReactNode | null = <IconCheck />;
    createSelect({ clearIcon }, ({ container }) => {
      expect(container.querySelector(iconCls)).toBeInTheDocument();
    });

    clearIcon = null;
    createSelect({ clearIcon }, ({ container }) => {
      expect(container.querySelector(iconCls)).not.toBeInTheDocument();
    });
  });

  it('自定义 optionRender', () => {
    createSelect(
      { search: true, optionRender: opt => <span className="custom-label">{opt.label}</span> },
      ({ baseElement, container }) => {
        clickEl(container);

        const dropdownOptEls = baseElement.querySelectorAll('.s-select-dropdown-option .custom-label');
        expect(dropdownOptEls.length).toEqual(3);
        expect(dropdownOptEls.item(0).innerHTML).toEqual('apple');
      }
    );
  });

  it('当为 search 模式时，自定义 optionFilter', () => {
    createSelect({ search: true, optionFilter: opt => opt.value === 'orange' }, ({ baseElement, container }) => {
      const inputEl = container.querySelector('.s-select-input') as HTMLInputElement;

      changeInput(inputEl, 'apple');
      expect(inputEl.value).toBe('apple');

      const dropdownOptEls = baseElement.querySelectorAll('.s-select-dropdown-option');
      expect(dropdownOptEls.length).toEqual(1);
      expect(dropdownOptEls.item(0).innerHTML).toEqual('orange');
    });
  });
});
