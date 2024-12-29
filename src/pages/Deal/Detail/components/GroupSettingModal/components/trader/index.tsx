import { Body } from './Body';
import { Header } from './Header';

export const TraderContainer = () => {
  return (
    <div className="flex flex-col flex-auto px-3 w-[368px] select-none">
      <Header />
      <div className="component-dashed-x-600 w-full" />
      <Body />
    </div>
  );
};
