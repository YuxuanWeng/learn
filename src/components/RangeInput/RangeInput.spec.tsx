import { describe, it } from 'vitest';
import { FC, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RangeInput, { DateRangeInput, RangeInputValue } from '.';

const Test: FC = () => {
  const [values, setValues] = useState<RangeInputValue>(['', '']);

  return (
    <RangeInput
      value={values}
      onChange={setValues}
      centerElement={<div>1551</div>}
      suffix="1234"
    />
  );
};

const Test2: FC = () => {
  const [values, setValues] = useState<RangeInputValue>(['', '']);

  return (
    <DateRangeInput
      value={values}
      onChange={setValues}
    />
  );
};

describe('test RangeInput', () => {
  it('should render centerElement or suffix', () => {
    render(<Test />);
    expect(screen.queryByText('1234')).toBeInTheDocument();
    expect(screen.queryByText('1551')).toBeInTheDocument();
  });

  it('should clear', async () => {
    const { container } = render(<Test />);

    const input = container.querySelector('input');

    await userEvent.type(input!, '123');

    expect(input!.value).toBe('123');

    await userEvent.click(container.querySelector('button')!);

    expect(input!.value).toBe('');
  });

  it('should check RegExp', async () => {
    const { container } = render(<Test />);

    const originInputs = container.querySelectorAll('input');

    for (const input of originInputs) {
      await userEvent.type(input, '1234');

      expect(input!.value).toBe('1234');

      await userEvent.type(input, 'asdf');

      expect(input!.value).toBe('1234');
    }

    const { container: container2 } = render(<Test2 />);
    const dateInputs = container2.querySelectorAll('input');

    for (const input of dateInputs) {
      await userEvent.type(input, '1234y');

      expect(input!.value).toBe('1234y');

      await userEvent.type(input, 'asdf');

      expect(input!.value).toBe('1234y');
    }
  });
});
