import { useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import { UpdatesBadge } from '@fepkg/business/components/DiffTable';
import { TraderWithPref } from '@fepkg/business/components/Search/TraderSearch';
import { SearchImperativeRef, SearchOption } from '@fepkg/components/Search';
import { Tooltip } from '@fepkg/components/Tooltip';
import { Counterparty } from '@fepkg/services/types/common';
import {
  InstTraderSearch,
  InstTraderSearchProvider,
  transform2InstTraderOpt,
  transform2Trader,
  useInstTraderSearch
} from '@/components/business/Search/InstTraderSearch';
import { useProductParams } from '@/layouts/Home/hooks';
import { BrokerSearchProvider } from '../business/Search/BrokerSearch';
import { TraderPreferenceProvider } from '../business/Search/TraderSearch';
import {
  CPBSearchConnectorProvider,
  useCPBSearchConnector
} from '../business/Search/providers/CPBSearchConnectorProvider';
import { useComposition } from './utils/useComposition';

type InstDisplayProps = {
  /** 是否可编辑 */
  editable?: boolean;
  /** 机构交易员信息 */
  instTrader?: Counterparty;
  /** 更新机构交易员回调 */
  onInstTraderChange?: (val?: string, onError?: VoidFunction) => void;
  isDark?: boolean;
  otherSideTraderId?: string;
  flagPayForInst: boolean;
};

/** 机构信息展示 */
const Inner = ({
  editable,
  instTrader,
  onInstTraderChange,
  isDark,
  otherSideTraderId,
  flagPayForInst
}: InstDisplayProps) => {
  const { productType } = useProductParams();
  const { instTraderSearchRef, instTraderSearchState, updateInstTraderSearchState } = useInstTraderSearch();
  const { handleInstTraderChange } = useCPBSearchConnector();
  const imperativeRef = useRef<SearchImperativeRef>(null);
  const [isModify, setIsModify] = useState(false);

  const handleReset = () => {
    if (!instTraderSearchState.selected) {
      updateInstTraderSearchState(draft => {
        draft.keyword = '';
        draft.selected = transform2InstTraderOpt(transform2Trader(instTrader), productType);
      });
      requestIdleCallback(() => imperativeRef.current?.clearInput());
    }
    setIsModify(false);
  };

  const handleChange = (opt?: SearchOption<TraderWithPref> | null) => {
    handleInstTraderChange(opt);
    // 选中选项后，只要不是清空就请求修改
    if (!opt) return;
    onInstTraderChange?.(opt?.value as string, handleReset);
    requestIdleCallback(() => instTraderSearchRef.current?.blur());
  };

  const selectedLabel = instTraderSearchState?.selected?.label;

  useEffect(() => {
    if (!editable) {
      setIsModify(false);
    }
  }, [editable]);

  const { hasCompostionRef, elementProps } = useComposition();

  // 修改状态或者机构待定时展示Search
  if (isModify) {
    return (
      <InstTraderSearch
        {...elementProps}
        strategy="fixed"
        hiddenTraderIDs={otherSideTraderId == null ? [] : [otherSideTraderId]}
        imperativeRef={imperativeRef}
        className={cx('!w-30', isDark && 'bg-gray-800')}
        limitWidth={false}
        dropdownCls="w-[200px]"
        label=""
        placeholder=""
        suffixIcon={instTraderSearchState.selected ? void 0 : null}
        onChange={handleChange}
        onBlur={() => handleReset()}
        onEnterPress={() => {
          if (hasCompostionRef) return;
          handleReset();
        }}
      />
    );
  }

  const noneEditElement = selectedLabel ? (
    <Tooltip
      truncate
      content={selectedLabel}
    >
      <div
        className="text-gray-000 font-semibold text-sm leading-6 ml-2 truncate"
        onDoubleClick={() =>
          editable &&
          setIsModify(() => {
            requestIdleCallback(() => {
              instTraderSearchRef.current?.focus();
              instTraderSearchRef.current?.select();
            });
            return true;
          })
        }
      >
        {selectedLabel}
      </div>
    </Tooltip>
  ) : (
    // 当text为空字符的时候，TextWithTooltip组件会返回null，但是这里需要一个空的div占位，保证布局不乱
    <div
      className="h-6 ml-2 w-30"
      onDoubleClick={() =>
        editable &&
        setIsModify(() => {
          requestIdleCallback(() => {
            instTraderSearchRef.current?.focus();
          });
          return true;
        })
      }
    >
      {' '}
    </div>
  );

  return (
    <>
      <div className="w-4 h-4">{flagPayForInst && <UpdatesBadge type="danger-payfor" />}</div>
      {noneEditElement}
    </>
  );
};

export const InstDisplay = (props: InstDisplayProps) => {
  const key = `${props?.instTrader?.inst?.inst_id}_${props?.instTrader?.trader?.trader_id}_${props?.instTrader?.trader?.trader_tag}`;
  const { productType } = useProductParams();

  return (
    <div className="flex-1 h-8 flex items-center overflow-hidden pr-2">
      <InstTraderSearchProvider
        key={key}
        initialState={{
          productType,
          defaultValue: transform2Trader(props?.instTrader)
        }}
      >
        {/* 为了支持机构交易员搜索框首选项高亮 */}
        <TraderPreferenceProvider>
          {/* 为了支持CPBSearchConnectorProvider */}
          <BrokerSearchProvider initialState={{ productType }}>
            {/* 为了支持切换首选项 */}
            <CPBSearchConnectorProvider initialState={{ productType }}>
              <Inner {...props} />
            </CPBSearchConnectorProvider>
          </BrokerSearchProvider>
        </TraderPreferenceProvider>
      </InstTraderSearchProvider>
    </div>
  );
};
