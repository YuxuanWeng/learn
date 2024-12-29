import { ReactNode } from 'react';

type HeaderProps = {
  title: string;
  icon?: ReactNode;
};

export const Header = ({ title, icon }: HeaderProps) => {
  return (
    <div className="flex items-center basis-10 gap-1">
      {icon && <span className="flex-center p-1">{icon}</span>}
      <span className="ml-1 select-none text-gray-000 text-sm font-bold">{title}</span>
    </div>
  );
};
