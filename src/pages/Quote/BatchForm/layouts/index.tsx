import { Source } from '@/components/Quote/Dates';
import { CalcComponent } from '@/components/business/Calc';
import { BrokerSearch } from '@/components/business/Search/BrokerSearch';
import { InstTraderSearch } from '@/components/business/Search/InstTraderSearch';
import { useCPBSearchConnector } from '@/components/business/Search/providers/CPBSearchConnectorProvider';
import { BatchQuoteOper } from '../components/BatchQuoteOper';
import { useQuoteBatchForm } from '../providers/FormProvider';

export const QuoteBatchFormLayout = () => {
  const { showFlags, showCpb } = useQuoteBatchForm();
  const { handleInstTraderChange, handleBrokerChange } = useCPBSearchConnector();

  return (
    <div className="flex flex-col gap-3 p-3">
      <BatchQuoteOper showFlags={showFlags} />
      <CalcComponent.Body
        source={Source.Sidebar}
        size="xs"
        defaultChecked={false}
      />
      {/* 协同报价批量修改备注水平展示 */}
      <CalcComponent.Footer
        className="!flex-row gap-3"
        checkboxCls="w-[298px] gap-3 !rounded-lg"
      />

      {showCpb && (
        <>
          <div className="component-dashed-x h-px" />

          <div className="grid grid-cols-2 gap-3">
            <InstTraderSearch
              className="bg-gray-800 h-7"
              label="机构(交易员)"
              labelWidth={96}
              // 默认为false，这里手动设置为true，否则无法展示债券识别联动的选项
              showOptions
              // 需要返回带有经纪人的数据，否则无法联动经纪人选项
              searchParams={{ with_broker: true }}
              // 需要首选项高亮
              preferenceHighlight
              onChange={handleInstTraderChange}
            />

            <BrokerSearch
              className="bg-gray-800 h-7"
              onChange={handleBrokerChange}
            />
          </div>
        </>
      )}
    </div>
  );
};
