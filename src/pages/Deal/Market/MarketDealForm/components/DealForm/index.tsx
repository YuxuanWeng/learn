import { getTodayByListedDate } from '@fepkg/business/hooks/useDealDateMutation';
import { formatDate } from '@fepkg/common/utils/date';
import { ShowTimeDatePickerV2 } from '@fepkg/components/DatePicker/ShowTimeDatePickerV2';
import { Dialog } from '@fepkg/components/Dialog';
import { SearchOption } from '@fepkg/components/Search';
import { FiccBondBasic } from '@fepkg/services/types/common';
import { Direction, ProductType, Side } from '@fepkg/services/types/enum';
import moment, { Moment } from 'moment';
import { AlwaysOpenToolView } from '@/components/AlwaysOpenToolView';
import { DirectionSwitch } from '@/components/DirectionSwitch';
import { ExerciseGroup } from '@/components/business/ExerciseGroup';
import { usePriceGroup } from '@/components/business/PriceGroup';
import { BondSearch, useBondSearch } from '@/components/business/Search/BondSearch';
import { DialogLayout } from '@/layouts/Dialog';
import { useProductParams } from '@/layouts/Home/hooks';
import { MarketDealTrade } from '@/pages/Deal/Market/MarketDealForm/components/MarketDealTrade';
import { useMarketDealFormParams } from '../../hooks/useParams';
import { useFocus } from '../../providers/FocusProvider';
import { useMarketDealForm } from '../../providers/FormProvider';
import { BondBasic } from '../BondBasic';
import { DealComment } from '../DealComment';
import { DealPrice } from '../DealPrice';
import { FormFooter } from './Footer';

export const DealForm = () => {
  const { defaultBondReadOnly } = useMarketDealFormParams();
  const { formState, updateFormState, dealDateState, resetDealDateState } = useMarketDealForm();
  const { productType } = useProductParams();
  const { bondSearchCbRef } = useFocus();
  const { updateBondSearchState } = useBondSearch();
  const { getPriceRef } = usePriceGroup();

  const { priceRef } = getPriceRef(Side.SideNone);

  const handleDirectionChange = (val: Direction) => {
    updateFormState(draft => {
      draft.direction = val;
    });
  };

  const handleDealTimeChange = (val: Moment | null) => {
    if (!val) return;
    updateFormState(draft => {
      draft.dealTime = val;
    });
  };

  const handleBondChange = (opt?: SearchOption<FiccBondBasic> | null) => {
    updateBondSearchState(draft => {
      draft.selected = opt ?? null;
    });

    if (opt) {
      requestIdleCallback(() => priceRef.current?.select?.());

      const listedDate = opt?.original?.listed_date;
      const { today, unlisted } = getTodayByListedDate(listedDate);

      const params = { today, unlisted, tradedDate: listedDate };

      let flagResetTradedDate = false;

      // 若为未上市债券
      if (unlisted) {
        // 若上市日在已选择的交易日之后，需要将交易日重置为上市日，否则使用原有交易日，只需重置 unlisted 与 today
        flagResetTradedDate = moment(formatDate(listedDate)).isAfter(moment(dealDateState.tradedDate), 'day');
      }

      resetDealDateState({ defaultValue: { ...params, ...(flagResetTradedDate ? {} : dealDateState) } });
    }
  };

  return (
    <>
      <DialogLayout.Header>
        <Dialog.Header>市场成交录入</Dialog.Header>
      </DialogLayout.Header>

      <Dialog.Body className="relative flex flex-col gap-2 !py-2 !px-2.5">
        <DirectionSwitch
          value={formState.direction}
          onChange={handleDirectionChange}
        />

        <div className="grid grid-cols-2 gap-4">
          <BondSearch
            className="bg-gray-800 h-7"
            dropdownCls="!max-h-[244px]"
            ref={bondSearchCbRef}
            disabled={defaultBondReadOnly}
            onChange={handleBondChange}
          />
          <ShowTimeDatePickerV2
            pickerProps={{ className: 'h-7' }}
            prefix="成交时间"
            size="md"
            pickerValue={formState.dealTime}
            onPickerChange={handleDealTimeChange}
          />
        </div>

        <BondBasic
          labelWidth={73}
          containerClassName="gap-x-10"
        />
        <DealPrice />
        {productType === ProductType.NCD && (
          <div className="flex gap-x-4">
            <MarketDealTrade side={Side.SideBid} />
            <MarketDealTrade side={Side.SideOfr} />
          </div>
        )}

        <DealComment />

        {productType !== ProductType.NCD && <ExerciseGroup className="absolute lef-4 bottom-2" />}
      </Dialog.Body>

      <AlwaysOpenToolView alignRight />
      <FormFooter />
    </>
  );
};
