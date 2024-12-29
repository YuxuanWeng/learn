import { useState } from 'react';
import cx from 'classnames';
import { InstSearch, useInstSearch } from '@fepkg/business/components/Search/InstSearch';
import { Checkbox } from '@fepkg/components/Checkbox';
import { Tooltip } from '@fepkg/components/Tooltip';
import { Institution } from '@fepkg/services/types/common';
import { TraderSearch } from '@/components/business/Search/TraderSearch';
import { useITBSearchConnector } from '@/components/business/Search/providers/ITBSearchConnectorProvider';
import { DEFAULT_PAY_FOR } from '../../constants';
import { useReceiptDealFormParams } from '../../hooks/useParams';
import { useReceiptDealForm } from '../../providers/FormProvider';
import { ITBProviderWrapper, ITBProviderWrapperProps } from '../../providers/ITBWrapper';
import { useReceiptDealTrades } from '../../providers/TradesProvider';
import { ReceiptDealFormMode, SideType } from '../../types';
import { NC } from './NC';

type PayforProps = {
  /** 方向 */
  side: SideType;
  /** 外部控制样式 */
  className?: string;
};

const Inner = ({ side, className }: PayforProps) => {
  const { formDisabled } = useReceiptDealForm();
  const { trades, updateTrades, traderInfoError, setTraderInfoError } = useReceiptDealTrades();

  const { handleInstChange, handleTraderChange } = useITBSearchConnector();
  const { instSearchState } = useInstSearch();

  const inst = instSearchState.selected?.original;
  const city = inst?.district_name ?? (inst as Institution)?.area?.name ?? '-';

  const tradeState = trades[side];

  return (
    <div className="flex flex-col gap-2 ">
      <InstSearch
        error={traderInfoError[side]?.payForInst}
        disabled={formDisabled}
        className="h-7 w-[224px] ml-9"
        placeholder="请选择"
        onChange={opt => {
          // TODO: 这里的类型是有问题，后面看看怎么统一类型(由交易员带出的机构和直接搜索出来的机构类型不一致)
          // setAgencyCity(side, opt?.original.district_name ?? (opt?.original as Institution)?.area?.name);
          if (opt) {
            setTraderInfoError(draft => {
              draft[side] = { payForInst: false };
            });
          }
          handleInstChange(opt, (i, t) => {
            updateTrades(draft => {
              draft[side].pay_for_info.pay_for_inst_id = i?.inst_id;
              draft[side].pay_for_info.pay_for_trader_id = t?.trader_id;
            });
          });
        }}
      />

      <div className="flex w-[224px] h-7 ml-9 px-3 text-sm/7 bg-gray-600 rounded-lg truncate">
        <div className="w-18 shrink-0 text-gray-200">城市</div>
        <Tooltip
          truncate
          content={city}
        >
          <div className="text-gray-000 truncate">{city}</div>
        </Tooltip>
      </div>

      <TraderSearch
        disabled={formDisabled}
        error={traderInfoError[side]?.payForTrader}
        className="h-7 w-[224px] ml-9"
        searchParams={{ need_area: true }}
        onChange={opt => {
          if (opt) {
            setTraderInfoError(draft => {
              draft[side] = { payForTrader: false };
            });
          }
          // TODO: 这里的类型是有问题，后面看看怎么统一类型(由机构带出的交易员和直接搜索出来的交易员类型不一致)
          // setAgencyCity(
          //   side,
          //   opt?.original.inst_info?.area?.name ?? (opt?.original.inst_info as InstitutionTiny)?.district_name
          // );
          handleTraderChange(opt, undefined, (i, t) => {
            updateTrades(draft => {
              draft[side].pay_for_info.pay_for_inst_id = i?.inst_id;
              draft[side].pay_for_info.pay_for_trader_id = t?.trader_id;
            });
          });
        }}
      />

      <NC
        error={traderInfoError[side]?.payForNc}
        disabled={formDisabled}
        inputValue={tradeState.pay_for_info?.pay_for_nc ?? ''}
        checked={!!tradeState.pay_for_info?.flag_pay_for_nc}
        onFlagClick={checked => {
          if (!checked) {
            setTraderInfoError(draft => {
              draft[side] = { payForNc: false };
            });
          }

          updateTrades(draft => {
            if (!checked) draft[side].pay_for_info.pay_for_nc = '';
            draft[side].pay_for_info.flag_pay_for_nc = checked;
          });
        }}
        onInputChange={val => {
          setTraderInfoError(draft => {
            draft[side] = { payForNc: !val };
          });
          updateTrades(draft => {
            draft[side].pay_for_info.pay_for_nc = val;
          });
        }}
      />
    </div>
  );
};

export const Payfor = (props: PayforProps) => {
  const { side, className } = props;

  const { mode } = useReceiptDealFormParams();
  const { formDisabled } = useReceiptDealForm();
  const { defaultTrades, trades, updateTrades, setTraderInfoError } = useReceiptDealTrades();

  const [itbDefaultValue, setItbDefaultValue] = useState<ITBProviderWrapperProps['defaultValue'] | undefined>(() => {
    const defaultTradePayfor = defaultTrades[side]?.pay_for_info;
    const { pay_for_inst, pay_for_trader } = defaultTradePayfor ?? {};
    return { inst: pay_for_inst, trader: pay_for_trader };
  });

  const handleFlagPayforChange = (val: boolean) => {
    if (formDisabled) return;

    setItbDefaultValue(undefined);

    updateTrades(draft => {
      draft[side].pay_for_info.flag_pay_for = val;

      if (!val) {
        draft[side].pay_for_info.flag_pay_for_nc = false;
        draft[side].pay_for_info.pay_for_nc = '';

        // 编辑情况下，如果取消勾选，则需要传默认值给后端，以重置数据库
        if (mode === ReceiptDealFormMode.Edit) draft[side].pay_for_info = DEFAULT_PAY_FOR;
      }
    });

    if (!val) {
      // 点灭代付信息nc标识后
      setTraderInfoError(draft => {
        draft[side] = { payForInst: false, payForTrader: false };
      });
    }
  };

  const tradeState = trades[side];

  return (
    <div className={cx('flex flex-col gap-2', className)}>
      <div className="flex items-center gap-2 h-8">
        <Checkbox
          disabled={formDisabled}
          checked={tradeState.pay_for_info.flag_pay_for}
          onChange={handleFlagPayforChange}
        >
          被代付信息
        </Checkbox>
      </div>

      {tradeState.pay_for_info.flag_pay_for && (
        <ITBProviderWrapper defaultValue={itbDefaultValue}>
          <Inner {...props} />
        </ITBProviderWrapper>
      )}
    </div>
  );
};
