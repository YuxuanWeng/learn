import { IconExchange, IconOco, IconPack, IconStar, IconStar2, IconUrgentFilled } from '@fepkg/icon-park-react';
import { FlagsProps } from '../types';

export const Flags = (props?: FlagsProps) => {
  if (!props) return null;
  const { flagStockExchange, flagIndivisible, flagUrgent, flagStar, flagOco, flagExchange, flagPackage, className } =
    props;

  if (!flagStockExchange && !flagIndivisible && !flagUrgent && !flagStar && !flagOco && !flagExchange && !flagPackage)
    return <span>--</span>;

  return (
    <div className={className ?? 'bg-gray-700 px-2 h-6 rounded-lg flex items-center gap-2 text-xs text-gray-100'}>
      {flagStockExchange && <span>交易所</span>}
      {flagIndivisible && <span>整量</span>}
      {flagUrgent && <IconUrgentFilled />}
      {flagStar === 1 && <IconStar />}
      {flagStar === 2 && <IconStar2 />}
      {flagOco && <IconOco />}
      {flagPackage && <IconPack />}
      {flagExchange && <IconExchange />}
    </div>
  );
};
