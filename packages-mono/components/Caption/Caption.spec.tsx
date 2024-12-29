import { describe, expect, it } from 'vitest';
import { IconCheck } from '@fepkg/icon-park-react';
import { render } from '@testing-library/react';
import { Caption } from './Caption';

describe('Caption', () => {
  it('设置标题', () => {
    const label = '标题';
    const { getByText } = render(<Caption>{label}</Caption>);
    expect(getByText(label)).toBeInTheDocument();
  });

  it('设置 size', () => {
    const label = '标题';
    const size = 'xs';
    const { getByText } = render(<Caption size={size}>{label}</Caption>);
    expect(getByText(label)).toHaveClass('text-xs');
  });

  it('设置 type', () => {
    const type = 'orange';
    const typeClass = 'bg-orange-100';
    const ariaAttribute = `i[aria-valuetext="${type}"]`;

    const { container } = render(<Caption type={type} />);
    expect(container.querySelector(ariaAttribute)).toHaveClass(typeClass);
  });

  it('设置/不设置 icon', () => {
    const iconCls = '.s-icon-check';

    const { container, rerender } = render(<Caption icon={<IconCheck />} />);
    let iconEl = container.querySelector(iconCls);

    expect(iconEl).toBeInTheDocument();

    rerender(<Caption />);
    iconEl = container.querySelector(iconCls);

    expect(iconEl).not.toBeInTheDocument();
  });
});
