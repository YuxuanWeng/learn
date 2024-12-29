import { fixFloatDecimal } from '@fepkg/common/utils';
import { Button } from '@fepkg/components/Button';
import { Checkbox } from '@fepkg/components/Checkbox';
import { Input } from '@fepkg/components/Input';
import { IconZhai, IconZheng } from '@fepkg/icon-park-react';
import { BondQuoteType, Side } from '@fepkg/services/types/enum';
import { HandleChangeCategory, HandleChangeValType, PriceGroup, usePriceGroup } from '@/components/business/PriceGroup';
import { useBatchQuoteOper } from '../../providers/BatchQuoteOperProvider';
import { OperItem } from './OperItem';
import { ValuationInfo } from './types';

const valuationBtnCls = 'w-7 h-7 !p-0';

export const INTENTION_VALUE = '意向';

/** 校验估值 */
const validateValuation = (val: number) => {
  if (val > 99.99) val = 99.99;
  else if (val < -99.99) val = -99.99;

  return fixFloatDecimal(val);
};

export const Price = () => {
  const { priceRef, valuationRef, valuationInfo, updateValuationInfo, resetValuationInfo } = useBatchQuoteOper();
  const { priceInfo, updatePriceInfo, handleInnerPriceChange, handleInnerChange } = usePriceGroup();

  const resetPriceInfo = (intention?: boolean) => {
    updatePriceInfo(Side.SideNone, {
      quote_type: BondQuoteType.Yield,
      quote_price: intention ? INTENTION_VALUE : '',
      return_point: void 0,
      flag_rebate: void 0,
      flag_intention: !!intention
    });
  };

  const handlePriceChange = (side: Side, price = '') => {
    handleInnerPriceChange(side, price, INTENTION_VALUE);
  };

  const handleChange = (val: HandleChangeValType) => {
    // 价格变化后，同时点灭估值按钮，清空 bp 输入框
    resetValuationInfo();

    if (val.category === HandleChangeCategory.Price) handlePriceChange(val.side, val.data.quote_price);
    handleInnerChange({ ...val, data: { ...val.data, intention: INTENTION_VALUE } });
  };

  const toggleIntention = (val: boolean) => {
    // 重置价格
    resetPriceInfo(val);
    // 同时点灭估值按钮，清空 bp 输入框
    resetValuationInfo();
  };

  const toggleValuation = (field: keyof Omit<ValuationInfo, 'value'>) => {
    // 估值变化后，需要重置价格
    resetPriceInfo();

    // 估值按钮只能同时点亮一个
    updateValuationInfo(draft => {
      if (field === 'val') {
        // 点亮/灭估值按钮时，需要清空价格输入框
        if (draft.val) draft.value = '';
        draft.val = !draft?.val;
        draft.csi = false;
      } else if (field === 'csi') {
        // 点亮/灭估值按钮时，需要清空价格输入框
        if (draft.csi) draft.value = '';
        draft.csi = !draft.csi;
        draft.val = false;
      }
    });
  };

  const updateValuation = (num: 5 | -5) => {
    // 估值变化后，需要重置价格
    resetPriceInfo();

    updateValuationInfo(draft => {
      let value = parseFloat(draft.value);
      if (Number.isNaN(value)) value = 0;

      draft.value = String(validateValuation(value + num));
      // 若即没有点亮「债」按钮，也没有点亮「证」按钮，改变估值后，需要点亮「债」按钮
      if (!draft.val && !draft.csi) draft.val = true;
    });
  };

  const handleValuationChange = (val: string) => {
    // 估值变化后，需要重置价格
    resetPriceInfo();

    const regex = /^-?(0|[1-9]\d?|99)?(\.\d{0,2})?$/;

    if (!val || regex.test(val)) {
      updateValuationInfo(draft => {
        draft.value = val;
        // 若即没有点亮「债」按钮，也没有点亮「证」按钮，改变估值后，需要点亮「债」按钮
        if (!draft.val && !draft.csi) draft.val = true;
      });
    } else if (!regex.test(val)) {
      //
    } else if (Number(val) > 99.99) {
      updateValuationInfo(draft => {
        draft.value = '99.99';
      });
    } else if (Number(val) < -99.99) {
      updateValuationInfo(draft => {
        draft.value = '-99.99';
      });
    }
  };

  return (
    <>
      <OperItem label="价格">
        <div className="flex items-center justify-center w-[76px] h-7 border border-solid border-gray-600 rounded-lg">
          <Checkbox
            checked={priceInfo[Side.SideNone]?.flag_intention}
            onChange={toggleIntention}
          >
            {INTENTION_VALUE}
          </Checkbox>
        </div>

        <div className="flex">
          <PriceGroup
            label=""
            outerClassName="!w-[250px]"
            side={Side.SideNone}
            placeholder="请输入"
            refs={{ priceRefs: priceRef }}
            intention={INTENTION_VALUE}
            size="middle"
            onChange={handleChange}
          />
        </div>
      </OperItem>

      <OperItem label="估值">
        <div className="flex items-center gap-2">
          <div className="h-7 w-[76px] rounded-lg border border-solid border-gray-600 flex-center gap-2">
            <Button.Icon
              bright
              ghost
              type="green"
              checked={!!valuationInfo?.val}
              icon={<IconZhai size="20" />}
              onClick={() => toggleValuation('val')}
            />
            <Button.Icon
              bright
              ghost
              type="green"
              checked={!!valuationInfo?.csi}
              icon={<IconZheng size="20" />}
              onClick={() => toggleValuation('csi')}
            />
          </div>

          <Input
            ref={valuationRef}
            placeholder="请输入"
            className="!w-[150px] bg-gray-800 h-7"
            padding={[1, 12]}
            clearIcon={null}
            value={valuationInfo.value}
            onChange={handleValuationChange}
          />

          <Button
            ghost
            className={valuationBtnCls}
            onClick={() => updateValuation(5)}
          >
            +5
          </Button>
          <Button
            ghost
            className={valuationBtnCls}
            onClick={() => updateValuation(-5)}
          >
            -5
          </Button>
        </div>
      </OperItem>
    </>
  );
};
