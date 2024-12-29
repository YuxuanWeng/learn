import { describe, expect, it, vi } from 'vitest';
import { useEffect, useState } from 'react';
import { RenderResult, fireEvent, render } from '@testing-library/react';
import { RadioGroup } from './Group';
import { Radio } from './Radio';
import { RadioGroupProps } from './types';

const createGroup = (props?: RadioGroupProps, cb?: (res: RenderResult) => void) => {
  const res = render(
    <RadioGroup {...props}>
      <Radio value="apple">apple</Radio>
      <Radio value="banana">banana</Radio>
      <Radio value="orange">orange</Radio>
    </RadioGroup>
  );
  const el = res.container.querySelector('div');
  if (el) {
    cb?.(res);
  } else {
    throw Error('都没有 RadioGroup，测个 🔨🔨');
  }
};

const createGroupByOpts = (props?: RadioGroupProps, cb?: (res: RenderResult) => void) => {
  const options = [
    { label: 'apple', value: 'apple' },
    { label: 'banana', value: 'banana' },
    { label: 'orange', value: 'orange' }
  ];

  const res = render(
    <RadioGroup
      options={options}
      {...props}
    />
  );
  const el = res.container.querySelector('div');
  if (el) {
    cb?.(res);
  } else {
    throw Error('都没有 RadioGroup，测个 🔨🔨');
  }
};

const createGroupFns = [createGroup, createGroupByOpts];

describe('RadioGroup', () => {
  it('基本使用', () => {
    createGroup({}, ({ container }) => {
      const radios = container.querySelectorAll('input');
      expect(radios.length).toBe(3);

      const [appleInputEl] = radios;
      expect(appleInputEl.checked).toBe(false);

      fireEvent.click(appleInputEl);
      expect(appleInputEl.checked).toBe(true);

      fireEvent.click(appleInputEl);
      expect(appleInputEl.checked).toBe(true);
    });

    const onChange = vi.fn();

    createGroupByOpts({ type: 'button', onChange }, ({ container }) => {
      const radios = container.querySelectorAll('input');

      const [appleInputEl, bananaInputEl, orangeInputEl] = radios;
      fireEvent.click(appleInputEl);
      expect(onChange.mock.lastCall[0]).toEqual(['apple']);

      fireEvent.click(bananaInputEl);
      expect(onChange.mock.lastCall[0]).toEqual(['banana']);

      fireEvent.click(orangeInputEl);
      expect(onChange.mock.lastCall[0]).toEqual(['orange']);

      fireEvent.click(bananaInputEl);
      expect(onChange.mock.lastCall[0]).toEqual(['banana']);
    });
  });

  it('受控模式', () => {
    createGroup({ value: ['banana'] }, ({ container }) => {
      const radios = container.querySelectorAll('input');
      const [appleInputEl, bananaInputEl] = radios;

      expect(bananaInputEl).toBeChecked();

      fireEvent.click(appleInputEl);
      expect(appleInputEl).not.toBeChecked();
    });
  });

  it('第一个选项初始值为 true, 在点击之后 checked 状态应该仍然为 true', () => {
    const onChange = vi.fn();

    createGroup({ defaultValue: ['apple'], onChange }, ({ container }) => {
      const radios = container.querySelectorAll('input');
      const [appleInputEl] = radios;

      fireEvent.click(appleInputEl);
      expect(appleInputEl.checked).toBe(true);
      expect(onChange).not.toHaveBeenCalled();
    });

    createGroupByOpts({ defaultValue: ['apple'], onChange }, ({ container }) => {
      const radios = container.querySelectorAll('input');
      const [appleInputEl] = radios;

      fireEvent.click(appleInputEl);
      expect(appleInputEl.checked).toBe(true);
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  it('当为 ctrl 状态时，第一个选项初始值为 true, 在点击之后 checked 状态应该切换为 false', () => {
    const onChange = vi.fn();

    createGroup({ ctrl: true, defaultValue: ['apple'], onChange }, ({ container }) => {
      const radios = container.querySelectorAll('input');
      const [appleInputEl] = radios;
      expect(appleInputEl).toBeChecked();

      fireEvent(appleInputEl, new MouseEvent('click', { metaKey: true }));
      expect(appleInputEl).not.toBeChecked();
    });

    createGroupByOpts({ ctrl: true, defaultValue: ['apple'], onChange }, ({ container }) => {
      const radios = container.querySelectorAll('input');
      const [appleInputEl] = radios;
      expect(appleInputEl).toBeChecked();

      fireEvent(appleInputEl, new MouseEvent('click', { metaKey: true }));
      expect(appleInputEl).not.toBeChecked();
    });
  });

  it('当为 otherCancel 状态时，点击应正确切换 Radio', () => {
    const onChange = vi.fn();
    createGroupFns.forEach(fn => {
      fn({ ctrl: true, otherCancel: true, defaultValue: ['apple', 'banana'], onChange }, ({ container }) => {
        const radios = container.querySelectorAll('input');
        const [appleInputEl, bananaInputEl] = radios;
        expect(appleInputEl).toBeChecked();

        fireEvent.click(appleInputEl);
        expect(appleInputEl).toBeChecked();
        expect(bananaInputEl).not.toBeChecked();

        fireEvent(bananaInputEl, new MouseEvent('click', { metaKey: true }));
        expect(appleInputEl).toBeChecked();
        expect(bananaInputEl).toBeChecked();
      });
    });
  });

  it('Radio 和 RadioGroup 在点击之后都应响应 onChange 事件', () => {
    const onGroupChange = vi.fn();
    const onCheckboxChange = vi.fn();

    const { container } = render(
      <RadioGroup onChange={onGroupChange}>
        <Radio
          value="apple"
          onChange={onCheckboxChange}
        >
          apple
        </Radio>
        <Radio
          value="banana"
          onChange={onCheckboxChange}
        >
          banana
        </Radio>
        <Radio
          value="orange"
          onChange={onCheckboxChange}
        >
          orange
        </Radio>
      </RadioGroup>
    );

    const radios = container.querySelectorAll('input');
    const [appleInputEl] = radios;

    fireEvent.click(appleInputEl);
    expect(appleInputEl.checked).toBe(true);
    expect(onGroupChange).toBeCalledTimes(1);
    expect(onCheckboxChange).toBeCalledTimes(1);
  });

  it('当为 disabled 状态时，点击不应切换 Radio', () => {
    const onChange = vi.fn();
    createGroup({ disabled: true, onChange }, ({ container }) => {
      const radios = container.querySelectorAll('input');
      const [appleInputEl, bananaInputEl] = radios;

      fireEvent.click(appleInputEl);
      expect(onChange).not.toHaveBeenCalled();

      fireEvent.click(bananaInputEl);
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  it('当不为 disabled 状态，但子 Radio 处于 disabled 状态时，点击不应该切换该 Radio', () => {
    const options = [
      { label: 'apple', value: 'apple' },
      { label: 'banana', value: 'banana', disabled: true }
    ];
    const onChange = vi.fn();
    createGroupByOpts({ options, onChange }, ({ container }) => {
      const radios = container.querySelectorAll('input');
      const [appleInputEl, bananaInputEl] = radios;

      fireEvent.click(appleInputEl);
      expect(appleInputEl).toBeChecked();
      expect(onChange.mock.lastCall[0]).toEqual(['apple']);

      fireEvent.click(bananaInputEl);
      expect(bananaInputEl).not.toBeChecked();
      expect(onChange).toHaveBeenCalledOnce();
    });
  });

  it('所有 Radio 都拥有同一 name 属性', () => {
    const groupName = 'group';
    createGroup({ name: groupName }, ({ container }) => {
      container.querySelectorAll<HTMLInputElement>('input[type="radio"]').forEach(el => {
        expect(el.name).toBe(groupName);
      });
    });
  });

  it('所有 Radio 的 value 为 boolean 类型', () => {
    const options = [
      { label: 'true', value: true },
      { label: 'false', value: false }
    ];
    createGroupByOpts({ options, value: [true, false] }, ({ container }) => {
      expect(container.querySelectorAll('label.checked').length).toBe(2);
    });
  });

  it('所有 Radio 的 value 为 string 类型', () => {
    const options = ['apple', 'banana'];
    createGroupByOpts({ options, value: options }, ({ container }) => {
      expect(container.querySelectorAll('label.checked').length).toBe(2);
    });
  });

  it('聚焦 Radio 时应触发 RadioGroup 的相应事件', () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();

    createGroup({ onFocus, onBlur }, ({ container }) => {
      const radios = container.querySelectorAll('input');
      const [appleInputEl] = radios;

      fireEvent.focus(appleInputEl);
      expect(onFocus).toHaveBeenCalledOnce();

      fireEvent.blur(appleInputEl);
      expect(onBlur).toHaveBeenCalledOnce();
    });
  });

  it('当 RadioGroup 没有获得 onChange 事件时，子 Radio 也应可单独处理 onChange 事件', () => {
    const onChange = vi.fn();
    const options = [{ label: 'apple', value: 'apple', onChange }];
    createGroupByOpts({ options }, ({ container }) => {
      const radios = container.querySelectorAll('input');
      const [appleInputEl] = radios;

      fireEvent.click(appleInputEl);
      expect(onChange.mock.lastCall[0]).toBe(true);
    });
  });

  it('当 RadioGroup 内有其他组件时，应可正常使用', () => {
    const { container } = render(
      <RadioGroup>
        <div className="flex-center gap-3 bg-white rounded">
          <input />
          <Radio value="apple">apple</Radio>
          <Radio value="banana">banana</Radio>
          <Radio value="orange">orange</Radio>
          <input />
        </div>
      </RadioGroup>
    );
    const radios = container.querySelectorAll('input');
    const [, appleInputEl] = radios;

    fireEvent.click(appleInputEl);
    expect(appleInputEl).toBeChecked();
  });

  it('当为 ctrl 状态时，当 options 有变化时，点击后 onChange 事件的回调参数也应变化', () => {
    const onChange = vi.fn();
    createGroupByOpts({ defaultValue: ['apple'], onChange }, ({ container, rerender }) => {
      rerender(
        <RadioGroup
          ctrl
          defaultValue={['apple']}
          onChange={onChange}
        >
          <Radio value="banana">banana</Radio>
          <Radio value="orange">orange</Radio>
        </RadioGroup>
      );

      const [checkEl] = container.querySelectorAll('input');
      fireEvent.click(checkEl);
      expect(onChange.mock.lastCall[0]).toEqual(['banana']);
    });
  });

  it('当为 ctrl 状态时，当子 Radio value 有变化时，点击后 onChange 事件的回调参数也应变化', () => {
    const onChange = vi.fn();
    const Demo = () => {
      const [v, setV] = useState('');

      useEffect(() => {
        setV('1');
      }, []);

      return (
        <div>
          <button onClick={() => setV('')} />
          <RadioGroup
            ctrl
            defaultValue={['length1']}
            onChange={onChange}
          >
            <Radio value={v ? `length${v}` : 'apple'}>apple</Radio>
          </RadioGroup>
        </div>
      );
    };
    const { container } = render(<Demo />);
    const radios = container.querySelectorAll('input');
    const [buttonEl] = container.querySelectorAll('button');
    const [appleInputEl] = radios;

    fireEvent(appleInputEl, new MouseEvent('click', { metaKey: true }));
    expect(appleInputEl).not.toBeChecked();

    fireEvent.click(appleInputEl);

    fireEvent.click(buttonEl);
    fireEvent(appleInputEl, new MouseEvent('click', { metaKey: true }));
    expect(appleInputEl).toBeChecked();
  });
});
