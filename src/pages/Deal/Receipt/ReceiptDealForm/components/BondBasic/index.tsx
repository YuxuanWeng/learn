import { useMemo, useState } from 'react';
import cx from 'classnames';
import { getTodayByListedDate } from '@fepkg/business/hooks/useDealDateMutation';
import { formatDate } from '@fepkg/common/utils/date';
import { ShowTimeDatePickerV2 } from '@fepkg/components/DatePicker/ShowTimeDatePickerV2';
import { Input } from '@fepkg/components/Input';
import { SearchOption } from '@fepkg/components/Search';
import { TextBadge } from '@fepkg/components/Tags';
import { FiccBondBasic } from '@fepkg/services/types/common';
import { ExerciseType, Side, UserSettingFunction } from '@fepkg/services/types/enum';
import moment from 'moment';
import { useBondQuery } from '@/common/services/hooks/useBondQuery';
import { quoteSetting, useUserSetting } from '@/common/services/hooks/useSettings/useUserSetting';
import { getCouponRateCurrent, transformCouponType } from '@/common/utils/bond';
import { isNotIntentional, transform2ValContent } from '@/common/utils/quote-price';
import { QuoteSettingsType } from '@/components/Quote/types';
import { ReadOnly } from '@/components/ReadOnly';
import { ReadOnlyOption } from '@/components/ReadOnly/types';
import { BondSearch, useBondSearch } from '@/components/business/Search/BondSearch';
import { useReceiptDealFormParams } from '../../hooks/useParams';
import { useReceiptDealBridge } from '../../providers/BridgeProvider';
import { useReceiptDealDate } from '../../providers/DateProvider';
import { useFocus } from '../../providers/FocusProvider';
import { useReceiptDealForm } from '../../providers/FormProvider';
import { ReceiptDealFormMode } from '../../types';
import { getPopupContainer } from '../../utils';

export const BondBasic = () => {
  const { mode } = useReceiptDealFormParams();
  const { formDisabled, formState, formError, changeFormState, updateFormError } = useReceiptDealForm();
  const { sideMutation, bridgesMutation } = useReceiptDealDate();
  const { than1Bridge } = useReceiptDealBridge();
  const { bondSearchState, updateBondSearchState } = useBondSearch();
  const { getSetting } = useUserSetting<QuoteSettingsType>(quoteSetting);
  const { bondSearchCbRef, priceRef } = useFocus();

  const [pickerOpen, setPickerOpen] = useState(false);
  const bond = bondSearchState.selected?.original;
  const decimalDigit = Number(getSetting<number>(UserSettingFunction.UserSettingValuationDecimalDigit) || 4);

  const bondSearchDisabled = mode === ReceiptDealFormMode.Edit || formDisabled;

  const bondQuery = useBondQuery({ key_market_list: bond?.key_market ? [bond.key_market] : [] });
  const [detail] = bondQuery?.data?.bond_detail_list ?? [];
  const [related] = bondQuery?.data?.related_info_list ?? [];

  const options: ReadOnlyOption[] = useMemo(
    () => [
      { label: '代码', value: bond?.display_code },
      {
        label: '简称',
        value: bond?.short_name,
        suffix: !isNotIntentional(bond?.mkt_type) ? (
          <TextBadge
            className="min-w-[16px] !h-5 !w-5 text-xs !leading-3 text-center inline-block"
            text="N"
            type="BOND"
            title="未上市"
          />
        ) : undefined
      },
      { label: '剩余期限', value: bond?.time_to_maturity },
      { label: '估价', value: transform2ValContent(bond, decimalDigit) },
      { label: '票面利率', value: getCouponRateCurrent(bond) },
      { label: '评级', value: bond?.issuer_rating },
      { label: '利率方式', value: transformCouponType(detail?.coupon_type, related?.benchmark_rate) }
    ],
    [bond, decimalDigit, detail, related]
  );

  const handleBondChange = (opt?: SearchOption<FiccBondBasic> | null) => {
    updateBondSearchState(draft => {
      draft.selected = opt ?? null;
    });

    if (opt) {
      requestAnimationFrame(() => priceRef.current?.select());

      const [bidState, , resetBidState] = sideMutation[Side.SideBid];
      const [ofrState, , resetOfrState] = sideMutation[Side.SideOfr];
      const [firstState, , resetFirstState] = bridgesMutation[0];
      const [secondState, , resetSecondState] = bridgesMutation[1];

      const listedDate = opt?.original?.listed_date;
      const { today, unlisted } = getTodayByListedDate(listedDate);

      const params = { unlisted, today, tradedDate: listedDate };

      const tradedDates = [bidState.tradedDate, ofrState.tradedDate, firstState.tradedDate, secondState.tradedDate];
      /** 是否需要重置交易日的 flag 列表，顺序为 tradedDates 的顺序 */
      const flagResetTradedDates: boolean[] = [];

      // 若为未上市债券
      if (unlisted) {
        for (let i = 0, len = tradedDates.length; i < len; i++) {
          const tradedDate = tradedDates[i];
          // 若上市日在已选择的交易日之后，需要将交易日重置为上市日，否则使用原有交易日，只需重置 unlisted 与 today
          flagResetTradedDates[i] = moment(formatDate(listedDate)).isAfter(moment(tradedDate), 'day');
        }
      }

      resetBidState({ defaultValue: { ...params, ...(flagResetTradedDates[0] ? {} : bidState) } });
      resetOfrState({ defaultValue: { ...params, ...(flagResetTradedDates[1] ? {} : ofrState) } });
      resetFirstState({ defaultValue: { ...params, ...(flagResetTradedDates[2] ? {} : firstState) } });
      resetSecondState({ defaultValue: { ...params, ...(flagResetTradedDates[3] ? {} : secondState) } });
    }
  };

  return (
    <div className="flex w-full border border-solid border-gray-600 rounded-lg">
      <div
        className="flex flex-col gap-2 w-[312px] p-3"
        style={{ width: than1Bridge ? 342 : 292 }}
      >
        <BondSearch
          ref={bondSearchCbRef}
          className="h-7 bg-gray-800"
          disabled={bondSearchDisabled}
          ancestorScroll
          error={formError.bond}
          onInputChange={() => {
            changeFormState('exercise', ExerciseType.ExerciseTypeNone);
            updateFormError(draft => {
              draft.bond = false;
            });
          }}
          onChange={handleBondChange}
        />
        <Input
          className={cx('h-7', !formDisabled && '!bg-gray-800')}
          label="市场"
          value="二级"
          disabled
        />
        <ShowTimeDatePickerV2
          className="[&_.ant-picker]:h-7"
          prefix="成交时间"
          disabled={formDisabled}
          pickerOpen={pickerOpen}
          pickerProps={{ getPopupContainer }}
          pickerValue={formState.dealTime}
          onPickerChange={val => {
            if (!val) return;
            changeFormState('dealTime', val);
          }}
          // 这样做是为了避免在选择选项位置在成交时间选择器附近的 Bond 选项后
          // 把成交时间选择器打开的 antd 的 「幽默行为」
          // 原因是选择器的 focus 事件被莫名其妙的触发了
          onPickerOpenChange={val => {
            if (!val) setPickerOpen(false);
          }}
          onContainerClick={() => {
            if (formDisabled) return;
            setPickerOpen(true);
          }}
        />
      </div>

      <ReadOnly
        containerClassName="flex-1 gap-x-6 pl-[11px] py-3 !bg-gray-800 border-0 border-l border-solid border-gray-600"
        optionsClassName="pl-3 h-7"
        options={options}
        enableCopy
      />
    </div>
  );
};
