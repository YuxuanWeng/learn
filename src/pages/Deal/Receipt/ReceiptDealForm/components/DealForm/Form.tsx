import { Side } from '@fepkg/services/types/enum';
import { DirectionSwitch } from '@/components/DirectionSwitch';
import { useReceiptDealFormParams } from '../../hooks/useParams';
import { useReceiptDealForm } from '../../providers/FormProvider';
import { ReceiptDealFormMode } from '../../types';
import { BondBasic } from '../BondBasic';
import { DealBasic } from '../DealBasic';
import { DealBridges } from '../DealBridges';
import { DealComment } from '../DealComment';
import { DealPrice } from '../DealPrice';
import { DealTrade } from '../DealTrade';
import { AutoBrokerage } from '../DealTrade/AutoBrokerage';

enum GenerateDataSourceEnum {
  None = 0,
  SpotPricing = 1,
  ReceiptDeal = 2,
  Cloning = 3
} // 数据来源 1为点价，2为成交单录入，3为克隆
const DisabledDirectionList = new Set([GenerateDataSourceEnum.SpotPricing, GenerateDataSourceEnum.Cloning]);

export const DealForm = () => {
  const { defaultReceiptDeal, mode } = useReceiptDealFormParams();
  const { formDisabled, formState, changeFormState } = useReceiptDealForm();

  // 不为 Join 并且是点价或克隆生成的成交单，此时需要禁用切换方向
  const directionDisabled =
    (mode !== ReceiptDealFormMode.Join && DisabledDirectionList.has(defaultReceiptDeal?.generate_data_source ?? 0)) ||
    formDisabled;

  return (
    <>
      <DirectionSwitch
        disabled={directionDisabled}
        value={formState.direction}
        onChange={val => changeFormState('direction', val)}
      />
      <DealBasic />

      <div
        id="receipt-deal-form-scroll"
        className="relative flex flex-col gap-2 -mr-3 pr-3 overflow-y-overlay"
      >
        <BondBasic />
        <DealPrice />

        <div className="flex border border-solid border-gray-600 rounded-lg">
          <DealTrade side={Side.SideBid} />

          <div className="flex flex-col flex-1 w-0">
            <DealBridges />
            <AutoBrokerage />
          </div>

          <DealTrade side={Side.SideOfr} />
        </div>

        <DealComment />
      </div>
    </>
  );
};
