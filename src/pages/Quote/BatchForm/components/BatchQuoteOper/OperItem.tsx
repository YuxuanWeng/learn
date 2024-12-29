import { HTMLProps } from 'react';

export const OperItem = ({ label, children, ...restProps }: HTMLProps<HTMLDivElement>) => {
  return (
    <div
      className="flex items-center gap-2"
      {...restProps}
    >
      <div className="w-16 text-sm text-gray-200 select-none">{label}</div>
      {children}
    </div>
  );
};
