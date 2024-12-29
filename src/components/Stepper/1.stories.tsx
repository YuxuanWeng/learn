import { useState } from 'react';
import { expect } from '@storybook/jest';
import { userEvent, within } from '@storybook/testing-library';
import Stepper from '.';

export default {
  title: '业务组件/步进器',
  parameters: {
    docs: {
      description: {
        component: `
        `
      }
    }
  },
  decorators: []
};

export const Stepper1 = () => {
  const [num, setNum] = useState(9);
  return (
    <>
      <span>n:{num}</span>
      <Stepper
        className="w-20"
        value={num}
        min={0}
        step={2}
        onChange={n => setNum(n)}
      />
    </>
  );
};
Stepper1.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  const btns = canvasElement.querySelectorAll('button');
  const minus = btns[0];
  const add = btns[1];

  await userEvent.click(add);
  expect(canvas.queryByText('n:11')).toBeTruthy();

  await userEvent.click(minus);
  await userEvent.click(minus);
  expect(canvas.queryByText('n:7')).toBeTruthy();

  await userEvent.click(minus);
  await userEvent.click(minus);
  await userEvent.click(minus);
  await userEvent.click(minus);
  expect(canvas.queryByText('n:0')).toBeTruthy();
};
