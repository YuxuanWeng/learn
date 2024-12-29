import { Body } from './Body';
import { Head } from './Head';

export const BrokerContainer = () => {
  return (
    <div className="bg-gray-700 flex flex-col flex-1  px-3">
      <Head />
      <Body />
    </div>
  );
};
