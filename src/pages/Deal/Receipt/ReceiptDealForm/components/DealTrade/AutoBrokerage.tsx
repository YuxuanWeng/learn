import { Button } from '@fepkg/components/Button';
import { useReceiptDealTrades } from '../../providers/TradesProvider';

export const AutoBrokerage = () => {
  const { autoBrokeragePercentDisabled, autoBrokeragePercent } = useReceiptDealTrades();

  return (
    <div className="flex justify-center pt-3 border-0 border-t border-solid border-gray-600">
      <Button
        type="gray"
        plain="orange"
        className="w-22 h-7"
        disabled={autoBrokeragePercentDisabled}
        onClick={autoBrokeragePercent}
      >
        自动佣金
      </Button>
    </div>
  );
};
