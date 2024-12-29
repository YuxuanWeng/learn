import { Flags } from './Flags';
import { Price } from './Price';
import { SideTabs } from './SideTabs';
import { Volume } from './Volume';

export const BatchQuoteOper = ({ showFlags = true }) => {
  return (
    <div className="flex flex-col gap-3">
      <SideTabs />
      {showFlags && <Flags />}
      <Price />
      <Volume />
    </div>
  );
};
