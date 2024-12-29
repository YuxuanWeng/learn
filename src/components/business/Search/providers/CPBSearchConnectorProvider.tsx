import { TraderWithPref } from '@fepkg/business/components/Search/TraderSearch';
import { SearchOption } from '@fepkg/components/Search';
import { InstitutionTiny, User } from '@fepkg/services/types/common';
import { ProductType } from '@fepkg/services/types/enum';
import { useMemoizedFn } from 'ahooks';
import { createContainer } from 'unstated-next';
import { getDefaultBroker } from '@/pages/Quote/SingleQuote/utils';
import { isBroker, transform2BrokerOpt, useBrokerSearch } from '../BrokerSearch';
import { useInstTraderSearch } from '../InstTraderSearch';
import { useTraderPreference } from '../TraderSearch';

type InitialState = {
  /** 产品类型 */
  productType: ProductType;
  /** 默认 */
  defaultBroker?: User;
  /** Trader 选择清空后是否重置 Broker */
  resetBrokerAfterTraderClearing?: boolean;
};

/** 机构交易员、经纪人选择器联动 */
export const CPBSearchConnectorContainer = createContainer((initialState?: InitialState) => {
  const { instTraderSearchState, updateInstTraderSearchState } = useInstTraderSearch();
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

  /** 重置经纪人 */
  const resetBroker = () => {
    if (resetBrokerAfterTraderClearing) {
      updateBrokerSearchState(draft => {
        draft.keyword = '';
        draft.selected = transform2BrokerOpt(defaultBroker);
      });
    }
  };

  /** 更新交易员首选项 */
  const updateInstTraderSelectedPreference = (
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
      const lastKeyword = instTraderSearchState.keyword;
      if (!lastKeyword) return;
      preferenceKey = lastKeyword;
    } else {
      // 其他情况下存储的 preference，key 为 ${name_zh}，value 为 ${trader_id}_${tag}
      preferenceKey = target.name_zh ?? '';
    }

    // value 为 trader_id
    const preferenceValue = target.trader_id;
    traderPreference?.updatePreference(preferenceKey, preferenceValue);
  };

  /** 切换机构交易员选项 */
  const handleInstTraderChange = useMemoizedFn(
    (
      opt?: SearchOption<TraderWithPref> | null,
      callback?: (inst?: InstitutionTiny, trader?: TraderWithPref, broker?: User) => void,
      parsingList?: TraderWithPref[]
    ) => {
      updateInstTraderSearchState(draft => {
        draft.selected = opt ?? null;
        // 如果有识别列表
        if (parsingList) {
          // 设置识别列表
          draft.parsingList = parsingList;
          // 设置 keyword
          draft.keyword = opt?.original.name_zh ?? '';
        }
      });

      if (opt) {
        // 选中该交易员的白名单列表的首选项
        const selectedBroker = selectBroker(opt.original);

        const { inst_info } = opt.original;
        // TODO 该逻辑来自于交易员搜索框，待确定是否需要保留
        // 当机构名为 AAA 或 FFF 时，不更新交易员首选项便好设置
        if (!(inst_info?.full_name_zh === 'AAA' || inst_info?.full_name_zh === 'FFF')) {
          // 更新交易员首选项便好设置
          updateInstTraderSelectedPreference(opt, parsingList);
        }

        callback?.(opt.original?.inst_info, opt.original, selectedBroker);

        // 选中机构交易员后，焦点切换到经纪人搜索框，并选中 BrokerSearch 的内容
        // 包在 requestIdleCallback 是因为 select 的数据状态可能会被上面更新，
        // 直接 select 会选中状态更新前的内容，导致更新后无法再继续更新
        if (!parsingList) {
          requestIdleCallback(() => {
            brokerSearchRef.current?.select();
          });
        }
      } else {
        // 清空选项后，经纪人变为默认经纪人展示
        resetBroker();
        updateInstTraderSearchState(draft => {
          // 清空识别列表
          draft.parsingList = [];
        });

        callback?.(
          void 0,
          void 0,
          resetBrokerAfterTraderClearing ? defaultBroker : brokerSearchState.selected?.original
        );
      }
    }
  );

  /** 切换经纪人选项 */
  const handleBrokerChange = useMemoizedFn((opt?: SearchOption<User> | null) => {
    updateBrokerSearchState(draft => {
      draft.selected = opt ?? null;
    });
  });

  return { handleInstTraderChange, handleBrokerChange };
});

export const CPBSearchConnectorProvider = CPBSearchConnectorContainer.Provider;
export const useCPBSearchConnector = CPBSearchConnectorContainer.useContainer;
