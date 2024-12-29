import { useRef, useState } from 'react';
import { Side } from '@fepkg/services/types/bds-enum';
import { ReceiptDealBridgeOp } from '@fepkg/services/types/common';
import { useMemoizedFn } from 'ahooks';
import { DialogEvent } from 'app/types/IPCEvents';
import { createContainer } from 'unstated-next';
import { useImmer } from 'use-immer';
import { v4 } from 'uuid';
import { useReceiptDealFormParams } from '../hooks/useParams';
import { ReceiptDealFormMode, ReceiptDealFormWidth, ReceiptDealTradeFlag } from '../types';
import { useReceiptDealDate } from './DateProvider';
import { useReceiptDealForm } from './FormProvider';

export type ReceiptDealBridgeState = ReceiptDealBridgeOp & {
  key: string;
  instName: string;
  traderName: string;
  instError?: boolean;
  traderError?: boolean;
  brokerError?: boolean;
};

const toggleWindowWidth = (width: number) => {
  window.Main.invoke(DialogEvent.SetWindowSize, width);
};

/** 目前需支持的最大桥数量 */
export const MAX_BRIDGES_LENGTH = 3;
const EMPTY_BRIDGE: ReceiptDealBridgeState = {
  inst_id: '',
  trader_id: '',
  broker_id: '',
  key: v4(),
  instName: '',
  traderName: ''
};

export const ReceiptDealBridgeContainer = createContainer(() => {
  const { mode, defaultReceiptDeal } = useReceiptDealFormParams();
  const { formDisabled, realTradeStatus } = useReceiptDealForm();
  const { sideMutation, bridgesMutation } = useReceiptDealDate();

  const { order_no } = defaultReceiptDeal ?? {};

  let bridgeDisabled = false;
  // 如果不为 Join
  if (mode !== ReceiptDealFormMode.Join) bridgeDisabled = !!order_no || !!formDisabled;

  const defaultBridgeFlags = {
    [Side.SideBid]: realTradeStatus[Side.SideBid] ? ReceiptDealTradeFlag.Bridge : ReceiptDealTradeFlag.Real,
    [Side.SideOfr]: realTradeStatus[Side.SideOfr] ? ReceiptDealTradeFlag.Bridge : ReceiptDealTradeFlag.Real
  };

  /** 桥机构输入框 ref 列表 */
  const instRefs = useRef<HTMLInputElement[]>([]);

  // 左右两侧桥标识
  const [bridgeFlags, updateBridgeFlags] = useImmer(defaultBridgeFlags);
  const [bridges, updateBridges] = useImmer<ReceiptDealBridgeState[]>([]);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const [ofrDealDateState] = sideMutation[Side.SideOfr];
  const [firstDealDateState, , resetFirstBridgeDealDateState] = bridgesMutation[0];
  const [secondDealDateState, , resetSecondBridgeDealDateState] = bridgesMutation[1];

  /** 加桥 */
  const addBridge = useMemoizedFn((index: number) => {
    updateBridges(draft => {
      if (draft.length === MAX_BRIDGES_LENGTH) return;

      if (!draft.length) {
        draft[0] = EMPTY_BRIDGE;
        return;
      }

      // 如果加桥前桥数量为 1
      if (draft.length === 1) {
        resetFirstBridgeDealDateState({ defaultValue: { ...ofrDealDateState } });
        resetSecondBridgeDealDateState({ defaultValue: { ...ofrDealDateState } });
      }
      // 如果加桥前桥数量为 2
      else if (draft.length === 2) {
        // 若为桥 1 点加桥
        // 桥 2 与 桥 3 的信息需要为原来的桥 1 与 桥 2 的信息
        if (index === 0) resetSecondBridgeDealDateState({ defaultValue: { ...firstDealDateState } });
        // 若为桥 2 点加桥
        // 桥 2 与 桥 3 的信息需要为原来的桥 2 与 ofr 的信息
        else if (index === 1) resetSecondBridgeDealDateState({ defaultValue: { ...ofrDealDateState } });
      }

      // 进行加桥
      draft.splice(index + 1, 0, { ...EMPTY_BRIDGE, key: v4() });
      requestIdleCallback(() => instRefs.current[index + 1]?.focus());

      // 如果加桥后桥数量为 2
      if (draft.length === 2) {
        // 需要调整窗口宽度
        toggleWindowWidth(ReceiptDealFormWidth.DoubleBridge);
      }
    });
  });

  /** 删桥 */
  const deleteBridge = useMemoizedFn((index: number) => {
    updateBridges(draft => {
      if (draft.length <= 0) return;

      // 如果删桥前桥数量为 3
      if (draft.length === 3) {
        if (index === 0) {
          // 若为桥 1 点删桥
          resetFirstBridgeDealDateState({ defaultValue: { ...secondDealDateState } });
        } else if (index >= 1) {
          // 若为桥 1、2 点删桥
          // 桥 2 与 桥 3 的信息需要为原来的桥 1 与 桥 2 的信息
          resetSecondBridgeDealDateState({ defaultValue: { ...firstDealDateState } });
        }
      }
      // 如果删桥前桥数量为 2
      else if (draft.length === 2) {
        resetFirstBridgeDealDateState({ defaultValue: { ...ofrDealDateState } });
        resetSecondBridgeDealDateState({ defaultValue: { ...ofrDealDateState } });
      }

      // 进行删桥
      draft.splice(index, 1);

      // 如果删桥后桥数量为 1，需要调整窗口宽度
      if (draft.length === 1) {
        toggleWindowWidth(ReceiptDealFormWidth.Default);
      } else if (draft.length === 0) {
        // 如果删桥后桥数量为 0，需要重置桥标识
        updateBridgeFlags({ ...defaultBridgeFlags });
      }
    });
  });

  /** 更新桥信息 */
  const updateBridge = useMemoizedFn((index: number, bridge: Partial<ReceiptDealBridgeState>) => {
    updateBridges(draft => {
      draft[index] = { ...draft[index], ...bridge };
    });
  });

  /** 是否超过单桥 */
  const than1Bridge = bridges.length > 1;
  /** 是否超过双桥 */
  const than2Bridge = bridges.length > 2;
  /** 是否有桥 */
  const hasBridge = bridges.length !== 0;

  return {
    instRefs,

    bridgeDisabled,
    bridges,
    bridgeFlags,
    updateBridges,
    updateBridgeFlags,
    addBridge,
    deleteBridge,
    updateBridge,
    than1Bridge,
    than2Bridge,
    hasBridge,

    popoverOpen,
    setPopoverOpen
  };
});

export const ReceiptDealBridgeProvider = ReceiptDealBridgeContainer.Provider;
export const useReceiptDealBridge = ReceiptDealBridgeContainer.useContainer;
