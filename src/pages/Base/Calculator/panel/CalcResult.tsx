import { useMemo } from 'react';
import { formatDate } from '@fepkg/common/utils/date';
import DescribeItem from '@/components/ReadOnly/DescribeItem';
import { useCalcState } from '@/pages/Base/Calculator/providers/CalcProvider';
import { formatResult, toPercent } from '@/pages/Base/Calculator/utils';

export const CalcResult = () => {
  const { panelState } = useCalcState();
  const { result } = panelState;

  const resultOptions = useMemo(() => {
    return [
      { label: '净价', value: formatResult(result?.clean_price) },
      { label: '计息天数', value: formatResult(result?.accrued_days, false) },
      { label: '全价', value: formatResult(result?.full_price) },
      { label: '应计利息', value: formatResult(result?.accrued_amount) },
      { label: '收益率(%)', value: formatResult(toPercent(result?.yield)) },
      { label: '兑付日', value: formatResult(formatDate(result?.maturity_date)) },
      { label: '利差(%)', value: formatResult(toPercent(result?.spread)) },
      { label: '行权日', value: formatResult(formatDate(result?.execution_date)) },
      { label: 'YTC/P(%)', value: formatResult(toPercent(result?.yield_to_execution)) },
      { label: '结算金额(万)', value: formatResult(result?.settlement_amount) },
      { label: '麦氏久期', value: formatResult(result?.macaulay_duration) },
      { label: 'PVBP', value: formatResult(result?.pvbp) },
      { label: '修正久期', value: formatResult(result?.modified_duration) },
      { label: '凸性', value: formatResult(result?.convexity) }
    ];
  }, [result]);

  return (
    <div className="bg-gray-800 p-4 border-0 border-l border-solid border-l-gray-600 rounded-lg">
      <div className="grid grid-cols-2 gap-x-2 gap-y-3">
        {resultOptions.slice(0, 10).map(({ label, value }) => (
          <DescribeItem
            className="h-7"
            key={label}
            label={label}
            value={value}
            labelWidth={96}
            enableCopy
          />
        ))}
      </div>
      <div className="h-2 mb-2 component-dashed-x" />
      <div className="grid grid-cols-2 gap-x-2 gap-y-3">
        {resultOptions.slice(10).map(({ label, value }) => (
          <DescribeItem
            className="h-7"
            key={label}
            label={label}
            value={value}
            labelWidth={96}
            enableCopy
          />
        ))}
      </div>
    </div>
  );
};
