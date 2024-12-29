import { describe, expect, it, vi } from 'vitest';
import { Ref } from 'react';
import { Button } from '@fepkg/components/Button';
import { Input } from '@fepkg/components/Input';
import { IconEdit } from '@fepkg/icon-park-react';
import { render } from '@testing-library/react';
import { Combination } from './Combination';
import { CombinationProps } from './types';

type TypeCb = (el: Element) => void;

const createCombination = (props: CombinationProps, cb?: TypeCb) => {
  const { container } = render(<Combination {...props} />);

  const el = container.querySelector('.s-combination');
  if (el) {
    cb?.(el);
  } else {
    throw Error('都没有 Combination，测个 🔨🔨');
  }
};

describe('包裹组件', () => {
  it('基础用法', () => {
    const props: CombinationProps = { prefixNode: <Input />, suffixNode: <Button.Icon icon={<IconEdit />} /> };
    const fn: TypeCb = el => {
      expect(el.childElementCount).toBe(2);
    };
    createCombination(props, fn);
  });

  it('包裹组件的子组件支持传入文本', () => {
    const props: CombinationProps = { prefixNode: <Input />, suffixNode: '厘' };
    const fn: TypeCb = el => {
      expect(el.querySelector('.s-combination-text')).toBeTruthy();
    };
    createCombination(props, fn);
  });

  it('支持禁用', () => {
    const props: CombinationProps = { disabled: true, prefixNode: <Input />, suffixNode: <Button.Icon /> };
    const fn: TypeCb = el => {
      const firstNode = el.querySelector('input');
      const lastNode = el.querySelector('button');

      expect(firstNode).toHaveAttribute('disabled');
      expect(lastNode).toHaveAttribute('disabled');
    };
    createCombination(props, fn);
  });
});
