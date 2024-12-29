import { Button } from '@fepkg/components/Button';
import { IconTransferLrSmall } from '@fepkg/icon-park-react';
import { useMemoizedFn } from 'ahooks';
import { useFlowLogger } from '@/common/providers/FlowLoggerProvider';
import { LOGGER_EXCHANGE_SIDE } from '../constants';
import { useQuoteOper } from './QuoteOperProvider';

export const Exchange = ({ disabled = false }: { disabled?: boolean }) => {
  const { exchange } = useQuoteOper();
  const { trackPoint } = useFlowLogger();

  const handleClick = useMemoizedFn(() => {
    if (disabled) return;
    trackPoint(LOGGER_EXCHANGE_SIDE);
    exchange();
  });

  return (
    <Button.Icon
      icon={<IconTransferLrSmall />}
      onKeyDown={e => {
        e.preventDefault();
      }}
      text
      enableThrottle
      disabled={disabled}
      className="cursor-pointer bg-transparent border-none"
      onClick={handleClick}
    />
  );
};
