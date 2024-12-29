/* eslint-disable no-nested-ternary */
import { HTMLProps, ReactNode, useLayoutEffect, useRef, useState, useTransition } from 'react';
import { Tooltip } from 'antd';

export interface TipProps {
  text?: ReactNode;
  maxWidth?: number | 'auto' | 'full';
  wordSpacing?: number;
  alwaysTooltip?: boolean;
  onClick?: () => void;
  forceRecalculateFlag?: number;
}
export type TipDom = Omit<HTMLProps<HTMLParagraphElement>, keyof TipProps>;

export default function TextWithTooltip({
  text,
  maxWidth = 'full',
  alwaysTooltip = false,
  onClick,
  wordSpacing,
  forceRecalculateFlag,
  ...rest
}: TipProps & TipDom) {
  const paraRef = useRef<HTMLParagraphElement>(null);
  const [useEllipsis, setUseEllipsis] = useState(alwaysTooltip);
  const [_, startTransition] = useTransition();

  useLayoutEffect(() => {
    if (alwaysTooltip) return;
    startTransition(() => {
      const { offsetWidth, scrollWidth } = paraRef.current || { offsetWidth: 0, scrollWidth: 0 };
      const isEllipsis = offsetWidth < scrollWidth;
      setUseEllipsis(isEllipsis);
    });
  }, [text, maxWidth, alwaysTooltip, forceRecalculateFlag]);

  const cls = [
    'inline-block',
    'overflow-hidden',
    useEllipsis ? 'text-ellipsis' : '',
    'whitespace-nowrap',
    'w-auto',
    onClick ? 'hover:text-primary-200 hover:cursor-pointer' : '',
    rest?.className
  ].join(' ');

  const mainJsx = (
    <div
      ref={paraRef}
      {...rest}
      className={cls}
      style={{
        maxWidth: maxWidth === 'full' ? '100%' : maxWidth,
        wordSpacing
      }}
      onClick={onClick}
    >
      {text}
    </div>
  );

  return text ? (
    useEllipsis ? (
      <Tooltip
        color="var(--color-gray-500)"
        title={<span className="heir:not-italic heir:text-white select-none">{text}</span>}
      >
        {mainJsx}
      </Tooltip>
    ) : (
      mainJsx
    )
  ) : null;
}
