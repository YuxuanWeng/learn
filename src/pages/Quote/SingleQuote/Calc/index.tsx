import { KeyboardEvent, useRef } from 'react';
import { useBondSearch } from '@fepkg/business/components/Search/BondSearch';
import { getNextTradedDate, withToday } from '@fepkg/business/hooks/useDealDateMutation';
import { hasOption } from '@fepkg/business/utils/bond';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { message } from '@fepkg/components/Message';
import { Modal } from '@fepkg/components/Modal';
import { BondQuoteType, ExerciseType, ProductType, Side } from '@fepkg/services/types/enum';
import { cloneDeep, pick } from 'lodash-es';
import moment from 'moment';
import { checkListing, getDefaultLiqSpeedList, getDefaultTagsByProduct } from '@/common/utils/liq-speed';
import { CalcComponent, CalcType } from '@/components/business/Calc';
import { CalcBodyProvider, useCalcBody } from '@/components/business/Calc/Body';
import { CalcFooterProvider, useCalcFooter } from '@/components/business/Calc/Footer';
import { CalcHeadProvider, useCalcHead } from '@/components/business/Calc/Head/CalcHeadProvider';
import { CalcBodyYield, CalcFooterFlagValueYield } from '@/components/business/Calc/constants';
import { ExerciseProvider, useExercise } from '@/components/business/ExerciseGroup/provider';
import { transFormExerciseToEnum } from '@/components/business/ExerciseGroup/utils';
import {
  PriceGroupProvider,
  usePriceGroup,
  usePriceGroup as usePriceGroupFromCalc
} from '@/components/business/PriceGroup/PriceGroupProvider';
import { useQuoteOper } from '../QuoteOper/QuoteOperProvider';
import { useFocus } from '../providers/FocusProvider';
import { QuoteActionMode } from '../types';

type CalcProps = { productType: ProductType; actionMode?: QuoteActionMode };

const Inner = ({ actionMode, productType }: CalcProps) => {
  const { currentOpenCalcSide: side, closeCalcModal, updateCalc, handlePriceChange, updatePriceInfo } = useQuoteOper();
  const { priceInfo } = usePriceGroupFromCalc();

  const { setSettlementDate, bond } = useCalcHead();
  const { handleInnerDeliveryDateChange, calc } = useCalcBody();
  const { footerValue } = useCalcFooter();

  const { exerciseBoolean, isSelected } = useExercise();

  const { focus } = useFocus();

  const isFocusingFinished = useRef(false);

  const intention = (() => {
    if (side === Side.SideBid) return 'BID';
    if (side === Side.SideOfr) return 'OFR';
    return undefined;
  })();

  if (!side) return null;

  const handleCancel = () => {
    closeCalcModal();
    requestIdleCallback(() => {
      focus(side);
    });
  };

  const onSubmit = async () => {
    // unRefer时，判断选中日期的交易日是否早于当前日期，若早于当前日期，则将其重置为<默认>
    let liqSpeeds = cloneDeep(calc.liquidation_speed_list || []);
    const tradeDay = liqSpeeds.find(v => !!v.date);
    if (tradeDay && !!tradeDay.date && actionMode === QuoteActionMode.EDIT_UNREFER) {
      const traded = moment(getNextTradedDate(tradeDay.date));
      if (traded.isBefore(moment(), 'date')) {
        liqSpeeds = getDefaultLiqSpeedList(productType);
      }
    }
    const { liqSpeeds: noDefaultList, hasDefault } = getDefaultTagsByProduct(liqSpeeds, productType);
    const listingWarn = await checkListing(hasDefault, { liquidation_speed_list: noDefaultList }, bond, productType);
    if (listingWarn) {
      message.warning('交易日不可晚于或等于下市日！');
      return;
    }
    if (!side) return;

    const calcUpdateData: CalcType = {
      ...calc,
      ...footerValue?.flagValue,
      comment: footerValue?.comment,
      is_exercise: exerciseBoolean,
      exercise_manual: isSelected
    };

    /** 更新备注计算属性 */
    updateCalc(side, calcUpdateData);

    /** 处理联动 */
    handlePriceChange(side, priceInfo[side]?.quote_price);

    /** 更新价格 */
    updatePriceInfo(side, {
      quote_price: priceInfo[side]?.quote_price,
      quote_type: priceInfo[side]?.quote_type || BondQuoteType.Yield,
      return_point: priceInfo[side]?.return_point,
      flag_rebate: priceInfo[side]?.flag_rebate,
      flag_intention: priceInfo[side]?.flag_intention
    });

    handleCancel();
  };

  const handleInputKeyDown = (evt: KeyboardEvent<HTMLInputElement>) => {
    if (evt.key === KeyboardKeys.Enter) onSubmit();
    if (evt.key === KeyboardKeys.Escape) handleCancel();
  };

  return (
    <Modal
      visible
      confirmByEnter
      keyboard
      destroyOnClose
      width={480}
      draggable={false}
      footerProps={{ confirmBtnProps: { tabIndex: -1 }, cancelBtnProps: { tabIndex: -1 } }}
      title={
        <div className="flex justify-between items-center bg-gray-800 rounded-t-md ">
          <span>备注和计算</span>
        </div>
      }
      onConfirm={onSubmit}
      onCancel={handleCancel}
    >
      <div className="flex flex-col gap-2 py-2">
        <div className="px-3">
          <CalcComponent.Head
            size="small"
            side={side}
            outerClassName="!w-[288px] text-gray-000"
            disabled={[false, priceInfo[side]?.quote_type === BondQuoteType.CleanPrice]}
            intention={intention}
            onKeyDowns={{ onPriceKeyDown: handleInputKeyDown, onReturnPointKeyDown: handleInputKeyDown }}
          />
          <CalcComponent.Body
            settlementContainerCls="!gap-1"
            settlementBtnCls={['!min-w-[64px]', '!min-w-[56px]']}
            offsetCls="!ml-3"
            ref={node => {
              if (node && !isFocusingFinished.current) {
                node.focus();
                isFocusingFinished.current = true;
              }
            }}
            size="xs"
            onDeliveryDateChange={async v => {
              const deliveryDate = v.delivery_date || getNextTradedDate(Date.now(), withToday(productType));
              setSettlementDate(deliveryDate);
              handleInnerDeliveryDateChange(v);
            }}
          />
        </div>
        <div className="px-3">
          <CalcComponent.Footer
            className="!flex-row gap-2"
            inputCls="w-[208px]"
            checkboxCls="!gap-1 !px-0 !rounded-lg"
            flagType="button"
            onKeyDown={(evt: KeyboardEvent<HTMLInputElement>) => {
              if (evt.key === KeyboardKeys.Escape) handleCancel();
            }}
          />
        </div>
      </div>
    </Modal>
  );
};

const Wrapper = (props: CalcProps) => {
  const { bondSearchState } = useBondSearch();
  const bond = bondSearchState.selected?.original;
  const { currentOpenCalcSide: side, calc } = useQuoteOper();

  const { priceInfo } = usePriceGroup();
  if (!side) return null;

  const exerciseManual = !!calc[side]?.exercise_manual;

  const isExercise = transFormExerciseToEnum(calc[side]?.is_exercise ?? false);

  const { productType } = props;
  const quoteType = priceInfo[side]?.quote_type || BondQuoteType.Yield;

  const isHasOption = hasOption(bond);
  return (
    <ExerciseProvider
      {...{
        hasBond: !!bond,
        productType,
        quoteType,
        isHasOption,
        // 若初次不是手动选择了行权，则默认值为: 都不选中
        defaultValue: exerciseManual ? isExercise : ExerciseType.ExerciseTypeNone
      }}
    >
      <Inner {...props} />
    </ExerciseProvider>
  );
};

export const Calc = (props: CalcProps) => {
  const { currentOpenCalcSide: side, calc, priceInfo, quoteFlags } = useQuoteOper();
  const { bondSearchState } = useBondSearch();
  const bond = bondSearchState.selected?.original;
  if (!side) return null;

  const { productType } = props;
  const quoteType = priceInfo[side]?.quote_type || BondQuoteType.Yield;
  const isCleanPrice = quoteType === BondQuoteType.CleanPrice;

  const calcBodyDefault = pick(calc[side], CalcBodyYield);
  const calcFooterFlagValueDefault = pick(calc[side], CalcFooterFlagValueYield);

  return (
    <PriceGroupProvider
      initialState={{ defaultValue: { ...priceInfo[side], flag_intention: quoteFlags[side]?.flag_intention }, side }}
    >
      <CalcHeadProvider
        initialState={{
          bond,
          side,
          comment: calc[side]?.comment,
          isExercise: isCleanPrice ? false : calcBodyDefault.is_exercise,
          exerciseManual: isCleanPrice ? false : calcBodyDefault.exercise_manual
        }}
      >
        <CalcBodyProvider initialState={{ defaultValue: calcBodyDefault, productType, bond }}>
          <CalcFooterProvider
            initialState={{
              defaultValue: { comment: calc[side]?.comment ?? '', flagValue: calcFooterFlagValueDefault }
            }}
          >
            <Wrapper {...props} />
          </CalcFooterProvider>
        </CalcBodyProvider>
      </CalcHeadProvider>
    </PriceGroupProvider>
  );
};
