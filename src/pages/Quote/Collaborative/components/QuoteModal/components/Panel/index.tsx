import { hasOption } from '@fepkg/business/utils/bond';
import { isNCD } from '@fepkg/business/utils/product';
import { Checkbox } from '@fepkg/components/Checkbox';
import { Dialog } from '@fepkg/components/Dialog';
import { Modal } from '@fepkg/components/Modal';
import { SearchOption } from '@fepkg/components/Search';
import { FiccBondBasic, QuoteParsing } from '@fepkg/services/types/common';
import { Side } from '@fepkg/services/types/enum';
import { useAtom } from 'jotai';
import { useFlowLogger } from '@/common/providers/FlowLoggerProvider';
import { CalcComponent } from '@/components/business/Calc';
import { useCalcFooter } from '@/components/business/Calc/Footer';
import { ExerciseGroup } from '@/components/business/ExerciseGroup';
import { getExerciseValue } from '@/components/business/ExerciseGroup/utils';
import { BondSearch, useBondSearch } from '@/components/business/Search/BondSearch';
import { useProductParams } from '@/layouts/Home/hooks';
import { quoteMdlOpenAtom } from '@/pages/Quote/Collaborative/atoms/modal';
import { BondBasic } from '@/pages/Quote/SingleQuote/BondBasic';
import QuoteOper from '@/pages/Quote/SingleQuote/QuoteOper';
import { Exchange } from '@/pages/Quote/SingleQuote/QuoteOper/Exchange';
import { useQuoteOper } from '@/pages/Quote/SingleQuote/QuoteOper/QuoteOperProvider';
import { InvertedDisplay } from '@/pages/Quote/SingleQuote/Reminder';
import { useFlagValue } from '@/pages/Quote/SingleQuote/providers/FlagProvider';
import { useFocus } from '@/pages/Quote/SingleQuote/providers/FocusProvider';
import { useParsingUpload } from '@/pages/Quote/SingleQuote/providers/ParsingUploadProvider';
import { useSubmit } from '../../hooks/useSubmit';

export const QuoteModalPanel = () => {
  const { productType } = useProductParams();

  const { insertParsingContent, clearParsingContent } = useParsingUpload();
  const { bondSearchState, updateBondSearchState } = useBondSearch();
  const { disabled, updateQuoteAfterParsing, updateQuoteFlags } = useQuoteOper();
  const { calcBodyMergedRefs, calcFooterMergedRefs, bondSearchCbRef, getPriceRef } = useFocus();
  const { trackPoint } = useFlowLogger();
  const { flagValue, updateFlagValue } = useFlagValue();
  const { setFooterValue } = useCalcFooter();

  const { handleConfirm } = useSubmit();

  const [open, setOpen] = useAtom(quoteMdlOpenAtom);

  const focusPriceInput = () => {
    const priceRef = disabled[Side.SideBid] ? getPriceRef(Side.SideOfr) : getPriceRef(Side.SideBid);
    priceRef.current?.select?.();
  };

  const handleBondChange = (opt?: SearchOption<FiccBondBasic> | null, parsings?: QuoteParsing[]) => {
    updateBondSearchState(draft => {
      draft.selected = opt ?? null;
    });

    if (parsings?.length) {
      const [first, second] = parsings;

      updateQuoteAfterParsing(first);
      if (second) updateQuoteAfterParsing(second);
    }

    if (opt && opt.original.code_market !== bondSearchState.selected?.original?.code_market) {
      // 聚焦到下一个价格输入框
      focusPriceInput();
    }

    setFooterValue(prev => ({
      ...prev,
      exercise: getExerciseValue(hasOption(opt?.original)),
      exerciseManual: false
    }));
  };

  const handleInternalChange = (val: boolean) => {
    if (val) {
      if (!disabled[Side.SideBid]) updateQuoteFlags(Side.SideBid, { flag_star: 1 });
      if (!disabled[Side.SideOfr]) updateQuoteFlags(Side.SideOfr, { flag_star: 1 });
    }

    updateFlagValue(draft => {
      draft.flag_internal = val;
    });
  };

  const handleCancel = () => {
    clearParsingContent();
    setOpen(false);
  };

  return (
    <Modal
      visible={open}
      width={720}
      title={<Dialog.Header>报价修改</Dialog.Header>}
      keyboard
      draggable={false}
      footerChildren={
        <Dialog.FooterItem>
          <Checkbox
            checked={flagValue?.flag_internal}
            onChange={handleInternalChange}
          >
            内部报价
          </Checkbox>
          <Checkbox
            checked={flagValue?.flag_urgent}
            onChange={val => {
              updateFlagValue(draft => {
                draft.flag_urgent = val;
              });
            }}
          >
            紧急
          </Checkbox>
          <Checkbox
            checked={flagValue?.flag_sustained_volume}
            onChange={val => {
              updateFlagValue(draft => {
                draft.flag_sustained_volume = val;
              });
            }}
          >
            续量
          </Checkbox>
        </Dialog.FooterItem>
      }
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    >
      <div className="relative flex flex-col px-3 py-2 gap-2">
        <InvertedDisplay
          productType={productType}
          bond={bondSearchState.selected?.original}
        />

        <div className="flex flex-col gap-2">
          <BondSearch
            className="bg-gray-800 h-7"
            ref={bondSearchCbRef}
            onChange={handleBondChange}
            onParsingSuccess={insertParsingContent}
            onBeforeParsing={params => trackPoint('parsing-prev-quote-draft-single-quote', params)}
            onBeforeSearch={params => trackPoint('fuzzy-search-bond-prev-quote-draft-single-quote', params)}
          />
          <BondBasic />
        </div>

        {/* TODO gap-2，临时调整为gap-1，待下个版本宽度问题解决后调整回来 */}
        <div className="flex items-center gap-1">
          <QuoteOper side={Side.SideBid} />
          <Exchange />
          <QuoteOper side={Side.SideOfr} />
        </div>

        <CalcComponent.Body ref={calcBodyMergedRefs} />
        <CalcComponent.Footer
          ref={calcFooterMergedRefs}
          // 如果是存单台，就不会有行权到期的选项，这不必给它留位置
          className={isNCD(productType) ? '!flex-row gap-3' : void 0}
        />
        <ExerciseGroup className="absolute left-3 bottom-2" />
      </div>
    </Modal>
  );
};
