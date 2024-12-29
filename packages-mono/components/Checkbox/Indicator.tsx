import type { SVGProps } from 'react';

const CheckedIndicator = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="12"
      height="10"
      viewBox="0 0 12 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M11.694 0C8.046 2.16107 5.4 4.88992 4.206 6.25724L1.29 4.04983L0 5.05214L5.034 10C5.898 7.85632 8.646 3.66744 12 0.689455L11.694 0Z"
        fill="currentColor"
      />
    </svg>
  );
};

const IndeterminateIndicator = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="10"
      height="2"
      viewBox="0 0 10 2"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 2H0V0H10V2Z"
        fill="currentColor"
      />
    </svg>
  );
};

const indicatorCls = 'text-gray-700';

export const IndicatorInner = ({ checked, indeterminate }: { checked?: boolean; indeterminate?: boolean }) => {
  if (indeterminate) return <IndeterminateIndicator className={indicatorCls} />;
  return <CheckedIndicator className={checked ? indicatorCls : 'invisible'} />;
};
