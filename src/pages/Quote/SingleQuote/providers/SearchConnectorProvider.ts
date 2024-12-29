import { useBondSearch } from '@fepkg/business/components/Search/BondSearch';
import { TraderWithPref, transform2TraderOpt } from '@fepkg/business/components/Search/TraderSearch';
import { SearchOption } from '@fepkg/components/Search';
import { FiccBondBasic, QuoteParsing, Trader } from '@fepkg/services/types/common';
import { Side } from '@fepkg/services/types/enum';
import { createContainer } from 'unstated-next';
import { useTraderPreference } from '@/components/business/Search/TraderSearch';
import { useCPBSearchConnector } from '@/components/business/Search/providers/CPBSearchConnectorProvider';
import { useQuoteOper } from '../QuoteOper/QuoteOperProvider';
import { useFocus } from './FocusProvider';

export const SearchConnectorContainer = createContainer(() => {
  const { bondSearchState, updateBondSearchState } = useBondSearch();
  const { handleInstTraderChange, handleBrokerChange } = useCPBSearchConnector();
  const traderPreference = useTraderPreference();
  const { disabled, updateQuoteAfterParsing, clearOper } = useQuoteOper();
  const { getPriceRef } = useFocus();

  /** 在识别后获取识别出来的交易员 */
  const getTraderAfterParsing = (parsing: QuoteParsing, traderList?: Trader[]) => {
    // 如果为识别出来的，有交易员信息的，需要把识别信息的交易员也带上
    if (parsing && traderList?.length) {
      // 只取识别结果的首选项，并使用 target.name_zh 用于查找便好设置的 key
      const [first] = traderList;
      const traderWithPrefList = traderList as TraderWithPref[];

      let [target] = traderWithPrefList;
      // 识别结果下存储的 preference，key 为 ${name_zh}，value 为 ${trader_id}_${tag}
      const preferenceKey = first?.name_zh ?? '';

      if (preferenceKey && traderPreference?.preference?.has(preferenceKey)) {
        // 如果有该交易员信息有最近用于报价，需要优先选中
        const prefer = traderWithPrefList?.find(
          trader => traderPreference?.preference.get(preferenceKey) === trader.trader_id
        );

        if (prefer) target = prefer;
      }

      const selected = transform2TraderOpt(target);

      return { selected, parsingList: traderWithPrefList };
    }
    return { selected: null, parsingList: [] as TraderWithPref[] };
  };

  const focusPriceInput = () => {
    const priceRef = disabled[Side.SideBid] ? getPriceRef(Side.SideOfr) : getPriceRef(Side.SideBid);
    priceRef.current?.select?.();
  };

  const handleBondChange = (
    opt?: SearchOption<FiccBondBasic> | null,
    parsings?: QuoteParsing[],
    traderList?: Trader[]
  ) => {
    updateBondSearchState(draft => {
      draft.selected = opt ?? null;
    });

    if (parsings?.length) {
      const [first, second] = parsings;

      updateQuoteAfterParsing(first);
      if (second) updateQuoteAfterParsing(second);
      // 如果仅识别出单侧信息，清掉对侧QuoteOper的值
      else {
        const oppositeSide = first.side === Side.SideBid ? Side.SideOfr : Side.SideBid;
        clearOper(oppositeSide);
      }

      const { selected, parsingList } = getTraderAfterParsing(first, traderList);

      handleInstTraderChange(selected, undefined, parsingList);
    }

    if (opt && opt.original.code_market !== bondSearchState.selected?.original?.code_market) {
      // 聚焦到下一个价格输入框
      focusPriceInput();
    }
  };

  return { handleBondChange, handleInstTraderChange, handleBrokerChange };
});

export const SearchConnectorProvider = SearchConnectorContainer.Provider;
export const useSearchConnector = SearchConnectorContainer.useContainer;
