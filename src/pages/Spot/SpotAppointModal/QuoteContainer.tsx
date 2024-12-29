import { Price } from './components/Price';
import { Total } from './components/Total';
import { Volume } from './components/Volume';

export const QuoteContainer = () => {
  return (
    <div className="flex flex-row border border-solid border-gray-600 rounded-lg select-none">
      <div className="flex flex-col">
        <Price />
        <div className="h-px border-none bg-gray-600" />
        <Total />
      </div>
      <Volume />
    </div>
  );
};
