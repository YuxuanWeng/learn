import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { Highlight } from './Highlight';

describe('Highlight', () => {
  it('匹配关键词并高亮文本内容', () => {
    const { getByText } = render(<Highlight keyword="highlight">Some text to highlight</Highlight>);
    const highlightedText = getByText('highlight');
    expect(highlightedText).toHaveClass('text-primary-100');
  });

  it('无匹配关键词', () => {
    const { getByText } = render(<Highlight keyword="高亮">Some text to highlight</Highlight>);
    const contentText = getByText('Some text to highlight');
    expect(contentText).toBeInTheDocument();
  });

  it('无文本内容', () => {
    const { getByText } = render(<Highlight keyword="highlight" />);
    const placeholderText = getByText('-');
    expect(placeholderText).toBeInTheDocument();
  });

  it('特殊关键词', () => {
    const { getByText } = render(
      <Highlight keyword="6.32Y    157876.IB    19云南14;3.41    --/2.87    --/6000(周四+0)    收费公路    估值:2.9561">
        157876.IB
      </Highlight>
    );
    const contentText = getByText('157876.IB');
    expect(contentText).toBeInTheDocument();
  });

  it('报错关键词', () => {
    const { getByText } = render(
      <Highlight keyword="16.16Y    104622.IB    19广东债32;3.91    2.111/--    1000(*,周四+0)/--    生态    估值:3.2879">
        104622
      </Highlight>
    );
    const contentText = getByText('104622');
    expect(contentText).toBeInTheDocument();
  });

  it('正则转义', () => {
    const { getByText } = render(<Highlight keyword="(a+)+">aaaaaaaaaaaaaaaaaaaaaaaaa</Highlight>);
    const contentText = getByText('aaaaaaaaaaaaaaaaaaaaaaaaa');
    expect(contentText).toBeInTheDocument();
  });
});
