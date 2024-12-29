import { useLayoutEffect } from 'react';
import { Button } from '@fepkg/components/Button';
import { IconCalendar } from '@fepkg/icon-park-react';
import { BrokerageType, Side } from '@fepkg/services/types/bds-enum';
import { useMemoizedFn } from 'ahooks';
import { useProductParams } from '@/layouts/Home/hooks';
import { FlagStyleMap } from '../../constants';
import { useReceiptDealFormParams } from '../../hooks/useParams';
import { useReceiptDealBridge } from '../../providers/BridgeProvider';
import { useReceiptDealDate } from '../../providers/DateProvider';
import { useReceiptDealForm } from '../../providers/FormProvider';
import { ITBProviderWrapper } from '../../providers/ITBWrapper';
import { useReceiptDealTrades } from '../../providers/TradesProvider';
import { ReceiptDealFormMode, ReceiptDealTradeFlag, SideType } from '../../types';
import { DealBridge } from './Bridge';
import { DealBridgesSettlementPopover } from './SettlementPopover';

export const DealBridges = () => {
  const { productType } = useProductParams();
  const { mode, defaultReceiptDeal } = useReceiptDealFormParams();
  const { realTradeStatus } = useReceiptDealForm();
  const { instRefs, bridgeDisabled, bridges, bridgeFlags, updateBridgeFlags, addBridge, than1Bridge, setPopoverOpen } =
    useReceiptDealBridge();
  const { trades, changeTradeState, updateBrokerageType } = useReceiptDealTrades();
  const { sideMutation } = useReceiptDealDate();

  const { flag_need_bridge } = defaultReceiptDeal ?? {};

  const bidFlagStyle = FlagStyleMap[bridgeFlags[Side.SideBid]];
  const ofrFlagStyle = FlagStyleMap[bridgeFlags[Side.SideOfr]];

  const handleBridgeAdd = useMemoizedFn(() => {
    // --- 重置交易交割日期信息 start ---
    const [bidDealDateState] = sideMutation[Side.SideBid];
    const [, , resetOfrDealDateState] = sideMutation[Side.SideOfr];
    // ofr 方交易日、交割日在点过桥时，需要填入 bid 方的值
    resetOfrDealDateState({
      productType,
      defaultValue: { tradedDate: bidDealDateState.tradedDate, deliveryDate: bidDealDateState.deliveryDate }
    });

    // --- end ---

    addBridge(0);
    requestIdleCallback(() => instRefs.current[0]?.focus());

    // 遍历双方
    for (const side of [Side.SideBid, Side.SideOfr] as const) {
      const otrSide = side === Side.SideBid ? Side.SideOfr : Side.SideBid;

      // 若原方向有「代」
      if (trades[side].flag === ReceiptDealTradeFlag.Payfor) {
        // 若另一方（需代付机构相连方向）为真实对手方，需点亮桥模块另一方上的「代」，另一方佣金置为「N」
        if (realTradeStatus[otrSide]) {
          updateBridgeFlags(draft => {
            draft[otrSide] = ReceiptDealTradeFlag.Payfor;
          });
          updateBrokerageType(otrSide, BrokerageType.BrokerageTypeN);
        }

        if (realTradeStatus[side]) {
          // 若该方向为真实对手方，点为「灭」，佣金置为「C」
          changeTradeState(side, 'flag', ReceiptDealTradeFlag.Real);
          updateBrokerageType(side, BrokerageType.BrokerageTypeC);
        } else {
          // 若该方向为非真实对手方，点为「桥」，佣金置为「B」
          changeTradeState(side, 'flag', ReceiptDealTradeFlag.Bridge);
          updateBrokerageType(side, BrokerageType.BrokerageTypeB);
        }
      }
    }
  });

  /** 桥标识与代标识切换 */
  const toggleFlag = (side: SideType) => {
    updateBridgeFlags(draft => {
      draft[side] =
        draft[side] === ReceiptDealTradeFlag.Payfor ? ReceiptDealTradeFlag.Bridge : ReceiptDealTradeFlag.Payfor;

      // 点亮「代」时，需要将对应方向上交易方的佣金信息置为「N」
      if (draft[side] === ReceiptDealTradeFlag.Payfor) {
        updateBrokerageType(side, BrokerageType.BrokerageTypeN);
      }
    });
  };

  // 进入时，若成交单为编辑且点亮加桥提醒时，需要默认加桥
  useLayoutEffect(() => {
    if (mode === ReceiptDealFormMode.Edit && flag_need_bridge) handleBridgeAdd();
  }, [flag_need_bridge, handleBridgeAdd, mode]);

  return (
    <div className="relative flex justify-center gap-4 py-3 px-[7px] h-[196px]">
      {bridges.length ? (
        <div className="flex gap-2">
          {realTradeStatus[Side.SideBid] ? (
            <Button.Icon
              className="w-7 h-7"
              {...bidFlagStyle}
              bright
              checked
              disabled={bridgeDisabled}
              onClick={() => toggleFlag(Side.SideBid)}
            />
          ) : (
            // 占位用
            <div className="w-7" />
          )}

          <div className="flex gap-4">
            {bridges.map((item, index) => (
              <ITBProviderWrapper key={item.key}>
                <DealBridge index={index} />
              </ITBProviderWrapper>
            ))}
          </div>

          {realTradeStatus[Side.SideOfr] ? (
            <Button.Icon
              className="w-7 h-7"
              {...ofrFlagStyle}
              bright
              checked
              disabled={bridgeDisabled}
              onClick={() => toggleFlag(Side.SideOfr)}
            />
          ) : (
            // 占位用
            <div className="w-7" />
          )}
        </div>
      ) : (
        <Button
          className="w-22 h-7 self-center"
          type="gray"
          plain="primary"
          disabled={bridgeDisabled}
          onClick={handleBridgeAdd}
        >
          过桥
        </Button>
      )}

      {than1Bridge && (
        <Button.Icon
          className="absolute right-2 bottom-3 w-7 h-7"
          icon={<IconCalendar />}
          onClick={() => setPopoverOpen(true)}
        />
      )}

      <DealBridgesSettlementPopover />
    </div>
  );
};
