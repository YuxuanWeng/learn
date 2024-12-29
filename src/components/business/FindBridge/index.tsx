import { useEffect, useId, useMemo, useRef, useState } from 'react';
import cx from 'classnames';
import { BridgeChannelMap } from '@fepkg/business/constants/map';
import { getInstName } from '@fepkg/business/utils/get-name';
import { usePrevious } from '@fepkg/common/hooks';
import { Button } from '@fepkg/components/Button';
import {
  Content as PopoverContent,
  PopoverContext,
  PopoverProps,
  Trigger,
  usePopoverFloat
} from '@fepkg/components/Popover';
import { Select } from '@fepkg/components/Select';
import { Tooltip } from '@fepkg/components/Tooltip';
import { IconBridgeText, IconLeftArrow, IconRightArrow } from '@fepkg/icon-park-react';
import { InstitutionTiny } from '@fepkg/services/types/bdm-common';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { DefaultBridgeConfig } from '@fepkg/services/types/bds-common';
import { BridgeChannel, TradeDirection } from '@fepkg/services/types/bds-enum';
import { updateDefaultBridgeConfig } from '@/common/services/api/receipt-deal/update-default-bridge-config';
import { useProductParams } from '@/layouts/Home/hooks';
import { FindBridgeProps } from './type';

const defaultConfig = {
  bid_bridge_direction: TradeDirection.TradeDirectionBid2Ofr,
  ofr_bridge_direction: TradeDirection.TradeDirectionOfr2Bid
};

const getInstTrader = (inst?: InstitutionTiny, trader?: { name_zh?: string }, productType?: ProductType) => {
  const traderText = trader?.name_zh ? `(${trader.name_zh})` : '';
  return `${getInstName({ inst, productType }) || '机构待定'}${traderText}`;
};

const OPTIONS = [
  BridgeChannel.Talk,
  BridgeChannel.Request,
  BridgeChannel.BothSides,
  BridgeChannel.Xbond,
  BridgeChannel.Ideal,
  BridgeChannel.ChannelFixedIncome,
  BridgeChannel.Bidding,
  BridgeChannel.Bulk
].map(i => ({ value: i, label: BridgeChannelMap[i] }));

const Inner = ({
  floatingProps,
  floatingFocus = true,
  findBridgeConfig,
  bidInst,
  bidTrader,
  ofrInst,
  ofrTrader,
  onChangeSuccess,
  parentDealId,
  onChange,
  ...restProps
}: FindBridgeProps & { onChange: VoidFunction }) => {
  const containerId = useId();

  // 乐观更新使用的state
  const [innerConfig, setInnerConfig] = useState<DefaultBridgeConfig>({ ...defaultConfig });
  const { productType } = useProductParams();

  useEffect(() => {
    setInnerConfig({ ...defaultConfig, ...findBridgeConfig });
  }, [findBridgeConfig]);

  const updateInnerConfig = async (newVal: DefaultBridgeConfig) => {
    setInnerConfig(newVal);
    onChange();

    if (!parentDealId) return;

    await updateDefaultBridgeConfig({
      parent_deal_id: parentDealId,
      default_bridge_config: newVal
    });

    onChangeSuccess?.(newVal);
  };

  return (
    <PopoverContent
      floatingProps={{
        ...floatingProps,
        className: cx('s-popconfirm !p-2 !bg-gray-800 !border-gray-600', floatingProps?.className)
      }}
      floatingFocus={floatingFocus}
      {...restProps}
    >
      <div
        id={containerId}
        className="flex"
      >
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center gap-x-2">
            <Tooltip
              truncate
              content={getInstTrader(ofrInst, ofrTrader, productType)}
            >
              <div className="text-secondary-100 truncate max-w-[112px] ml-auto">
                {getInstTrader(ofrInst, ofrTrader, productType)}
              </div>
            </Tooltip>
            <Button.Icon
              className="bg-white/4 w-4 h-4 min-w-4 min-h-4 !rounded"
              icon={
                innerConfig.ofr_bridge_direction !== TradeDirection.TradeDirectionBid2Ofr ? (
                  <IconRightArrow />
                ) : (
                  <IconLeftArrow />
                )
              }
              onClick={() => {
                updateInnerConfig({
                  ...innerConfig,
                  ofr_bridge_direction:
                    innerConfig.ofr_bridge_direction === TradeDirection.TradeDirectionBid2Ofr
                      ? TradeDirection.TradeDirectionOfr2Bid
                      : TradeDirection.TradeDirectionBid2Ofr
                });
              }}
            />
            <div className="w-4 h-4 rounded bg-purple-100">
              <IconBridgeText className="text-white" />
            </div>
          </div>
          <Select
            floatingId={containerId}
            label="渠道"
            labelWidth={64}
            className="w-[158px] h-[22px] mt-2"
            dropdownCls="!z-hightest"
            value={innerConfig.ofr_bridge_channel}
            options={OPTIONS}
            onChange={val => {
              updateInnerConfig({ ...innerConfig, ofr_bridge_channel: val });
            }}
          />
        </div>
        <div className="component-dashed-y mx-2 w-px" />
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center gap-x-2">
            <div className="w-4 h-4 rounded bg-purple-100">
              <IconBridgeText className="text-white" />
            </div>
            <Button.Icon
              className="bg-white/4 w-4 h-4 min-w-4 min-h-4 !rounded"
              icon={
                innerConfig.bid_bridge_direction !== TradeDirection.TradeDirectionBid2Ofr ? (
                  <IconRightArrow />
                ) : (
                  <IconLeftArrow />
                )
              }
              onClick={() => {
                updateInnerConfig({
                  ...innerConfig,
                  bid_bridge_direction:
                    innerConfig.bid_bridge_direction === TradeDirection.TradeDirectionBid2Ofr
                      ? TradeDirection.TradeDirectionOfr2Bid
                      : TradeDirection.TradeDirectionBid2Ofr
                });
              }}
            />
            <Tooltip
              truncate
              content={getInstTrader(bidInst, bidTrader)}
            >
              <div className="text-orange-100 truncate max-w-[112px]">{getInstTrader(bidInst, bidTrader)}</div>
            </Tooltip>
          </div>
          <Select
            floatingId={containerId}
            label="渠道"
            labelWidth={64}
            className="w-[158px] h-[22px] mt-2"
            dropdownCls="!z-hightest"
            value={innerConfig.bid_bridge_channel}
            options={OPTIONS}
            onChange={val => {
              updateInnerConfig({ ...innerConfig, bid_bridge_channel: val });
            }}
          />
        </div>
      </div>
    </PopoverContent>
  );
};

export const FindBridge = (props: FindBridgeProps) => {
  const { renderChild } = props;

  const prevNeedFind = usePrevious(props.needFindBridge);

  const [manualOpen, setManualOpen] = useState<boolean>(false);

  const trigger = props.needFindBridge && !manualOpen ? 'hover' : 'manual';

  const hasManualClick = useRef(false);

  const open = useMemo(() => {
    if (!props.needFindBridge) return false;

    return manualOpen ? true : undefined;
  }, [manualOpen, props.needFindBridge]);

  const popoverProps: PopoverProps = {
    open,
    trigger,
    onOpenChange: val => {
      if (!val) {
        setManualOpen(false);
      }
    },
    arrow: false,
    placement: 'bottom-end',
    ...props
  };

  const popover = usePopoverFloat(popoverProps);

  // useEffect(() => {
  //   if (prevNeedFind == null || prevNeedFind === props.needFindBridge) return;

  //   setManualOpen((props.needFindBridge && hasManualClick.current) ?? false);

  //   hasManualClick.current = false;
  // }, [props.needFindBridge]);

  return (
    <PopoverContext.Provider value={popover}>
      <Trigger
        onClick={evt => {
          props.onPopupClick?.(evt);
          if (trigger !== 'manual') return;
          setManualOpen(true);
          // hasManualClick.current = true;
        }}
      >
        {renderChild(manualOpen)}
      </Trigger>

      <Inner
        {...{ ...props, ...popoverProps }}
        onChange={() => {
          setManualOpen(true);
        }}
      />
    </PopoverContext.Provider>
  );
};
