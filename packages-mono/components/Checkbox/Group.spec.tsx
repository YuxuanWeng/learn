import { describe, expect, it, vi } from 'vitest';
import { useEffect, useState } from 'react';
import { RenderResult, fireEvent, render } from '@testing-library/react';
import { Checkbox } from './Checkbox';
import { CheckboxGroup } from './Group';
import { CheckboxGroupProps } from './types';

const createGroup = (props?: CheckboxGroupProps, cb?: (res: RenderResult) => void) => {
  const res = render(
    <CheckboxGroup {...props}>
      <Checkbox value="apple">apple</Checkbox>
      <Checkbox value="banana">banana</Checkbox>
      <Checkbox value="orange">orange</Checkbox>
    </CheckboxGroup>
  );
  const el = res.container.querySelector('div');
  if (el) {
    cb?.(res);
  } else {
    throw Error('都没有 CheckboxGroup，测个 🔨🔨');
  }
};

const createGroupByOpts = (props?: CheckboxGroupProps, cb?: (res: RenderResult) => void) => {
  const options = [
    { label: 'apple', value: 'apple' },
    { label: 'banana', value: 'banana' },
    { label: 'orange', value: 'orange' }
  ];

  const res = render(
    <CheckboxGroup
      options={options}
      {...props}
    />
  );
  const el = res.container.querySelector('div');
  if (el) {
    cb?.(res);
  } else {
    throw Error('都没有 CheckboxGroup，测个 🔨🔨');
  }
};

describe('CheckboxGroup', () => {
  it('基本使用', () => {
    createGroup({}, ({ container }) => {
      const checkboxes = container.querySelectorAll('input');
      expect(checkboxes.length).toBe(3);

      const [appleInputEl] = checkboxes;
      expect(appleInputEl.checked).toBe(false);

      fireEvent.click(appleInputEl);
      expect(appleInputEl.checked).toBe(true);

      fireEvent.click(appleInputEl);
      expect(appleInputEl.checked).toBe(false);
    });

    createGroupByOpts({}, ({ container }) => {
      const checkboxes = container.querySelectorAll('input');
      expect(checkboxes.length).toBe(3);

      const [appleInputEl] = checkboxes;
      expect(appleInputEl.checked).toBe(false);

      fireEvent.click(appleInputEl);
      expect(appleInputEl.checked).toBe(true);

      fireEvent.click(appleInputEl);
      expect(appleInputEl.checked).toBe(false);
    });

    const onChange = vi.fn();

    createGroupByOpts({ onChange }, ({ container }) => {
      const checkboxes = container.querySelectorAll('input');

      const [appleInputEl, bananaInputEl, orangeInputEl] = checkboxes;
      fireEvent.click(appleInputEl);
      expect(onChange.mock.lastCall[0]).toEqual(['apple']);

      fireEvent.click(bananaInputEl);
      expect(onChange.mock.lastCall[0]).toEqual(['apple', 'banana']);

      fireEvent.click(orangeInputEl);
      expect(onChange.mock.lastCall[0]).toEqual(['apple', 'banana', 'orange']);

      fireEvent.click(bananaInputEl);
      expect(onChange.mock.lastCall[0]).toEqual(['apple', 'orange']);
    });
  });

  it('受控模式', () => {
    createGroup({ value: ['banana'] }, ({ container }) => {
      const checkboxes = container.querySelectorAll('input');
      const [appleInputEl, bananaInputEl] = checkboxes;

      expect(bananaInputEl).toBeChecked();

      fireEvent.click(appleInputEl);
      expect(appleInputEl).not.toBeChecked();
    });
  });

  it('第一个选项初始值为 true, 在点击之后 checked 状态应该切换为 false', () => {
    const onChange = vi.fn();

    createGroup({ defaultValue: ['apple'], onChange }, ({ container }) => {
      const checkboxes = container.querySelectorAll('input');
      const [appleInputEl] = checkboxes;

      fireEvent.click(appleInputEl);
      expect(appleInputEl.checked).toBe(false);
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    createGroupByOpts({ defaultValue: ['apple'], onChange }, ({ container }) => {
      const checkboxes = container.querySelectorAll('input');
      const [appleInputEl] = checkboxes;

      fireEvent.click(appleInputEl);
      expect(appleInputEl.checked).toBe(false);
      expect(onChange).toHaveBeenCalledTimes(2);
    });
  });

  it('Checkbox 和 CheckboxGroup 在点击之后都应响应 onChange 事件', () => {
    const onGroupChange = vi.fn();
    const onCheckboxChange = vi.fn();

    const { container } = render(
      <CheckboxGroup onChange={onGroupChange}>
        <Checkbox
          value="apple"
          onChange={onCheckboxChange}
        >
          apple
        </Checkbox>
        <Checkbox
          value="banana"
          onChange={onCheckboxChange}
        >
          banana
        </Checkbox>
        <Checkbox
          value="orange"
          onChange={onCheckboxChange}
        >
          orange
        </Checkbox>
      </CheckboxGroup>
    );

    const checkboxes = container.querySelectorAll('input');
    const [appleInputEl] = checkboxes;

    fireEvent.click(appleInputEl);
    expect(appleInputEl.checked).toBe(true);
    expect(onGroupChange).toBeCalledTimes(1);
    expect(onCheckboxChange).toBeCalledTimes(1);
  });

  it('当为 disabled 状态时，点击不应切换 Checkbox', () => {
    const onChange = vi.fn();
    createGroup({ disabled: true, onChange }, ({ container }) => {
      const checkboxes = container.querySelectorAll('input');
      const [appleInputEl, bananaInputEl] = checkboxes;

      fireEvent.click(appleInputEl);
      expect(onChange).not.toHaveBeenCalled();

      fireEvent.click(bananaInputEl);
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  it('当不为 disabled 状态，但子 Checkbox 处于 disabled 状态时，点击不应该切换该 Checkbox', () => {
    const options = [
      { label: 'apple', value: 'apple' },
      { label: 'banana', value: 'banana', disabled: true }
    ];
    const onChange = vi.fn();
    createGroupByOpts({ options, onChange }, ({ container }) => {
      const checkboxes = container.querySelectorAll('input');
      const [appleInputEl, bananaInputEl] = checkboxes;

      fireEvent.click(appleInputEl);
      expect(appleInputEl).toBeChecked();
      expect(onChange.mock.lastCall[0]).toEqual(['apple']);

      fireEvent.click(bananaInputEl);
      expect(bananaInputEl).not.toBeChecked();
      expect(onChange).toHaveBeenCalledOnce();
    });
  });

  it('所有 Checkbox 都拥有同一 name 属性', () => {
    const groupName = 'group';
    createGroup({ name: groupName }, ({ container }) => {
      container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]').forEach(el => {
        expect(el.name).toBe(groupName);
      });
    });
  });

  it('所有 Checkbox 的 value 为 boolean 类型', () => {
    const options = [
      { label: 'true', value: true },
      { label: 'false', value: false }
    ];
    createGroupByOpts({ options, value: [true, false] }, ({ container }) => {
      expect(container.querySelectorAll('label.checked').length).toBe(2);
    });
  });

  it('所有 Checkbox 的 value 为 string 类型', () => {
    const options = ['apple', 'banana'];
    createGroupByOpts({ options, value: options }, ({ container }) => {
      expect(container.querySelectorAll('label.checked').length).toBe(2);
    });
  });

  it('聚焦 Checkbox 时应触发 CheckboxGroup 的相应事件', () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();

    createGroup({ onFocus, onBlur }, ({ container }) => {
      const checkboxes = container.querySelectorAll('input');
      const [appleInputEl] = checkboxes;

      fireEvent.focus(appleInputEl);
      expect(onFocus).toHaveBeenCalledOnce();

      fireEvent.blur(appleInputEl);
      expect(onBlur).toHaveBeenCalledOnce();
    });
  });

  it('当 CheckboxGroup 没有获得 onChange 事件时，子 Checkbox 也应可单独处理 onChange 事件', () => {
    const onChange = vi.fn();
    const options = [{ label: 'apple', value: 'apple', onChange }];
    createGroupByOpts({ options }, ({ container }) => {
      const checkboxes = container.querySelectorAll('input');
      const [appleInputEl] = checkboxes;

      fireEvent.click(appleInputEl);
      expect(onChange.mock.lastCall[0]).toBe(true);
    });
  });

  it('当 CheckboxGroup 内有其他组件时，应可正常使用', () => {
    const { container } = render(
      <CheckboxGroup>
        <div className="flex-center gap-3 bg-white rounded">
          <input />
          <Checkbox value="apple">apple</Checkbox>
          <Checkbox value="banana">banana</Checkbox>
          <Checkbox value="orange">orange</Checkbox>
          <input />
        </div>
      </CheckboxGroup>
    );
    const checkboxes = container.querySelectorAll('input');
    const [, appleInputEl] = checkboxes;

    fireEvent.click(appleInputEl);
    expect(appleInputEl).toBeChecked();
  });

  it('当 options 有变化时，点击后 onChange 事件的回调参数也应变化', () => {
    const onChange = vi.fn();
    createGroupByOpts({ defaultValue: ['apple'], onChange }, ({ container, rerender }) => {
      rerender(
        <CheckboxGroup
          defaultValue={['apple']}
          onChange={onChange}
        >
          <Checkbox value="banana">banana</Checkbox>
          <Checkbox value="orange">orange</Checkbox>
        </CheckboxGroup>
      );

      const [checkEl] = container.querySelectorAll('input');
      fireEvent.click(checkEl);
      expect(onChange.mock.lastCall[0]).toEqual(['banana']);
    });
  });

  it('当子 Checkbox value 有变化时，点击后 onChange 事件的回调参数也应变化', () => {
    const onChange = vi.fn();
    const Demo = () => {
      const [v, setV] = useState('');

      useEffect(() => {
        setV('1');
      }, []);

      return (
        <div>
          <button onClick={() => setV('')} />
          <CheckboxGroup
            defaultValue={['length1']}
            onChange={onChange}
          >
            <Checkbox value={v ? `length${v}` : 'apple'}>apple</Checkbox>
          </CheckboxGroup>
        </div>
      );
    };
    const { container } = render(<Demo />);
    const checkboxes = container.querySelectorAll('input');
    const [buttonEl] = container.querySelectorAll('button');
    const [appleInputEl] = checkboxes;

    fireEvent.click(appleInputEl);
    expect(onChange.mock.lastCall[0]).toEqual([]);

    fireEvent.click(appleInputEl);
    expect(onChange.mock.lastCall[0]).toEqual(['length1']);

    fireEvent.click(buttonEl);
    fireEvent.click(appleInputEl);
    expect(onChange.mock.lastCall[0]).toEqual(['apple']);
  });

  it('当子 Checkbox 处于 skipGroup 状态时，点击后不应触发 CheckboxGroup onChange 事件', () => {
    const onChange = vi.fn();
    const { container } = render(
      <CheckboxGroup onChange={onChange}>
        <Checkbox value="apple" />
        <Checkbox
          value="banana"
          skipGroup
        />
      </CheckboxGroup>
    );
    const checkboxes = container.querySelectorAll('input');
    const [, bananaInputEl] = checkboxes;

    fireEvent.click(bananaInputEl);
    expect(onChange).not.toHaveBeenCalled();
  });
});
