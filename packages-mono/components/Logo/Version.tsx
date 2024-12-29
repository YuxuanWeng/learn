import { ReactNode } from 'react';

export const Version = ({ children }: { children: ReactNode }) => {
  return (
    <span className="self-end ml-2 text-sm text-gray-200">
      <span>v</span>
      <span className="ml-0.5">{children}</span>
    </span>
  );
};
