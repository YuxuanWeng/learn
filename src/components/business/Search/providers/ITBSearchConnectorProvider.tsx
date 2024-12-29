import { transform2InstOpt, useInstSearch } from '@fepkg/business/components/Search/InstSearch';
import { TraderWithPref, transform2TraderOpt, useTraderSearch } from '@fepkg/business/components/Search/TraderSearch';
import { SearchOption } from '@fepkg/components/Search';
import { InstitutionTiny, User } from '@fepkg/services/types/common';
import { ProductType } from '@fepkg/services/types/enum';
import { useQueryClient } from '@tanstack/react-query';
import { useMemoizedFn } from 'ahooks';
import { createContainer } from 'unstated-next';
import { useInstTraderListQuery } from '@/common/services/hooks/useInstTraderListQuery';
import { getDefaultBroker } from '@/pages/Quote/SingleQuote/utils';
import { isBroker, transform2BrokerOpt, useBrokerSearch } from '../BrokerSearch';
import { useTraderPreference } from '../TraderSearch';

type InitialState = {
  /** 产品类型 */
  productType: ProductType;
  /** 默认 */
  defaultBroker?: User;
  /** Trader 选择清空后是否重置 Broker */
  resetBrokerAfterTraderClearing?: boolean;
};

/** 机构、交易员、经纪人选择器联动——————这个逻辑或许会在下一个版本中替换成CPBSearchConnectorContainer */
export const ITBSearchConnectorContainer = createContainer((initialState?: InitialState) => {
  const queryClient = useQueryClient();

  const { updateInstSearchState } = useInstSearch();
  const { traderSearchRef, traderSearchState, updateTraderSearchState } = useTraderSearch();
  const { brokerSearchRef, brokerSearchState, updateBrokerSearchState } = useBrokerSearch();
  const traderPreference = useTraderPreference();

  const resetBrokerAfterTraderClearing = initialState?.resetBrokerAfterTraderClearing ?? true;
  const defaultBroker = initialState?.defaultBroker ?? getDefaultBroker();

  const selectBroker = (original?: TraderWithPref) => {
    // 选中该交易员的白名单列表的首选项
    // 交易员如有该业务产品下绑定的经纪人首选项（CRM中可设置经纪人首选项），则优先在经纪人输入框中联动带出此经纪人首选项，
    // 若无首选项，则取绑定经纪人中有该业务产品且非停用状态的任意一位；如果该交易员无绑定经纪人则展示当前操作人
    const [first] = original?.broker_list?.filter(isBroker) ?? [];
    const selected = first ?? defaultBroker;
    updateBrokerSearchState(draft => {
      draft.keyword = '';
      draft.selected = transform2BrokerOpt(selected);
    });

    return selected;
  };

  const resetBroker = () => {
    if (resetBrokerAfterTraderClearing) {
      updateBrokerSearchState(draft => {
        draft.keyword = '';
        draft.selected = transform2BrokerOpt(defaultBroker);
      });
    }
  };

  const updateTraderSelectedPreference = (
    opt?: SearchOption<TraderWithPref> | null,
    parsingList?: TraderWithPref[],
    traderInst?: InstitutionTiny
  ) => {
    const target = opt?.original;
    if (!target) return;

    let preferenceKey = '';
    // 如果没有识别结果，且没有机构，则表示用户是使用模糊搜索获得 Trader 并选择
    if (!parsingList?.length && !traderInst) {
      // 模糊搜索存储的 preference，key 为 ${keyword}，value 为 ${trader_id}_${tag}
      const lastKeyword = traderSearchState.keyword;
      if (!lastKeyword) return;
      preferenceKey = lastKeyword;
    } else {
      // 其他情况下存储的 preference，key 为 ${name_zh}，value 为 ${trader_id}_${tag}
      preferenceKey = target.name_zh ?? '';
    }

    const preferenceValue = target.trader_id;
    traderPreference?.updatePreference(preferenceKey, preferenceValue);
  };

  const handleInstChange = async (
    opt?: SearchOption<InstitutionTiny> | null,
    onChange?: (inst?: InstitutionTiny, trader?: TraderWithPref, broker?: User) => void
  ) => {
    updateInstSearchState(draft => {
      draft.selected = opt ?? null;
    });

    // 如果有选项
    if (opt) {
      // 需要选中该机构下的第一个交易员
      const inst = opt.original;
      const { list = [] } = await queryClient.ensureQueryData({
        queryKey: useInstTraderListQuery.getKey({ inst_id: inst.inst_id, product_type: initialState?.productType }),
        queryFn: useInstTraderListQuery.queryFn,
        staleTime: 5 * 1000,
        cacheTime: 5 * 1000
      });

      const [first] = list;
      const selectedTrader = transform2TraderOpt(first);
      updateTraderSearchState(draft => {
        draft.inst = inst;
        draft.selected = selectedTrader;
      });

      // 选中该交易员的白名单列表的首选项
      const selectedBroker = selectBroker(selectedTrader?.original);

      onChange?.(opt?.original, selectedTrader?.original, selectedBroker);

      // 选中后选中 TraderSearch，包在 requestIdleCallback 是因为 select 的数据状态可能会被上面更新，
      // 直接 select 会选中状态更新前的内容，导致更新后无法再继续更新
      requestIdleCallback(() => {
        traderSearchRef.current?.select();
      });
    } else {
      // 否则把 TraderSearch 内容也一并清除
      updateTraderSearchState(draft => {
        draft.selected = null;
        draft.inst = void 0;
      });

      // 经纪人变为默认经纪人展示
      resetBroker();

      onChange?.(void 0, void 0, resetBrokerAfterTraderClearing ? defaultBroker : brokerSearchState.selected?.original);
    }
  };

  const handleTraderChange = (
    opt?: SearchOption<TraderWithPref> | null,
    parsingList?: TraderWithPref[],
    onChange?: (inst?: InstitutionTiny, trader?: TraderWithPref, broker?: User) => void
  ) => {
    updateTraderSearchState(draft => {
      draft.selected = opt ?? null;
      // 如果有识别列表
      if (parsingList) {
        // 设置识别列表
        draft.parsingList = parsingList;
        // 设置 keyword
        draft.keyword = opt?.original.name_zh ?? '';
        // 清空交易员机构
        draft.inst = void 0;
      }
    });

    if (opt) {
      // 选中该交易员的机构
      updateInstSearchState(draft => {
        draft.selected = transform2InstOpt(opt.original?.inst_info);
      });

      // 选中该交易员的白名单列表的首选项
      const selectedBroker = selectBroker(opt.original);

      const { inst_info } = opt.original;
      // 当机构名为 AAA 或 FFF 时，不更新交易员首选项便好设置
      if (!(inst_info?.full_name_zh === 'AAA' || inst_info?.full_name_zh === 'FFF')) {
        // 更新交易员首选项便好设置
        updateTraderSelectedPreference(opt, parsingList);
      }

      onChange?.(opt.original?.inst_info, opt.original, selectedBroker);

      // 选中后选中 BrokerSearch，包在 requestIdleCallback 是因为 select 的数据状态可能会被上面更新，
      // 直接 select 会选中状态更新前的内容，导致更新后无法再继续更新
      if (!parsingList) {
        requestIdleCallback(() => {
          brokerSearchRef.current?.select();
        });
      }
    } else {
      // 清除交易员后，机构内容同步清除
      updateInstSearchState(draft => {
        draft.keyword = '';
        draft.selected = null;
      });
      updateTraderSearchState(draft => {
        draft.inst = void 0;
        // 清空识别列表
        draft.parsingList = [];
      });

      // 经纪人变为默认经纪人展示
      resetBroker();

      onChange?.(void 0, void 0, resetBrokerAfterTraderClearing ? defaultBroker : brokerSearchState.selected?.original);
    }
  };

  const handleBrokerChange = (opt?: SearchOption<User> | null) => {
    updateBrokerSearchState(draft => {
      draft.selected = opt ?? null;
    });
  };

  const clearInstSearchState = useMemoizedFn(() => {
    updateInstSearchState(draft => {
      draft.keyword = '';
      draft.selected = null;
    });
  });

  const clearTraderSearchState = useMemoizedFn(() => {
    updateTraderSearchState(draft => {
      draft.keyword = '';
      draft.inst = void 0;
      draft.parsingList = [];
      draft.selected = null;
    });
  });

  const clearBrokerSearchState = useMemoizedFn(() => {
    updateBrokerSearchState(draft => {
      draft.keyword = '';
      draft.selected = transform2BrokerOpt(defaultBroker);
    });
  });

  return {
    handleInstChange,
    handleTraderChange,
    handleBrokerChange,
    clearInstSearchState,
    clearTraderSearchState,
    clearBrokerSearchState
  };
});

export const ITBSearchConnectorProvider = ITBSearchConnectorContainer.Provider;
export const useITBSearchConnector = ITBSearchConnectorContainer.useContainer;
