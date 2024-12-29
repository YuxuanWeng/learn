import { forwardRef, useMemo } from 'react';
import cx from 'classnames';
import { Renderer } from './Renderer';
import { CityText } from './Renderer/CityText';
import { InstText } from './Renderer/InstText';
import { ApprovalDetailRenderProps } from './types';
import { copy, transform2RenderValue } from './utils';

export const ApprovalDetailRender = forwardRef<HTMLDivElement, ApprovalDetailRenderProps>(
  ({ target, snapshot }: ApprovalDetailRenderProps, ref) => {
    const { display, statusImage, diffKeys } = useMemo(
      () => transform2RenderValue(target, snapshot),
      [snapshot, target]
    );

    return (
      <div
        ref={ref}
        className="approval-detail-renderer tracking-[-0.36px] border-collapse"
      >
        <header className="flex items-center gap-4 h-10 px-2 text-xs">
          <div className="flex-1 text-md/4 font-bold text-gray-800">
            <span
              className="cursor-pointer"
              onClick={() => copy(display.productType)}
            >
              {display.productType}
            </span>
          </div>
          <div className="flex gap-2  font-medium text-xs text-gray-400">
            <span className="w-16"> Trade Date</span>
            <span
              className={cx(
                diffKeys.has('tradeDate') && 'bg-danger-100',
                'w-[118px] text-[14px] leading-4 font-bold text-gray-800 cursor-pointer'
              )}
              onClick={() => copy(display.tradeDate)}
            >
              {display.tradeDate}
            </span>
          </div>
        </header>

        <div className="component-dashed-x-100 h-px" />

        <Renderer.Row
          className="grid items-center gap-2 h-10 px-[7px] text-sm font-bold text-gray-800"
          style={{ gridTemplateColumns: '64px 118px 72px 118px 72px 118px' }}
        >
          <Renderer.Code label="订单号">{display.orderNo}</Renderer.Code>

          <Renderer.Code
            label="过桥码"
            labelCls="pl-2"
            diff={diffKeys.has('bridgeCode')}
          >
            {display.bridgeCode}
          </Renderer.Code>

          <Renderer.Code
            label="内码"
            labelCls="pl-2"
            diff={diffKeys.has('internalCode')}
          >
            {display.internalCode}
          </Renderer.Code>
        </Renderer.Row>

        <Renderer.Row
          className="grid"
          style={{ gridTemplateColumns: '124px 73px 112px 124px 73px 112px' }}
        >
          <Renderer.Item
            label={
              <InstText
                nc={display.bidInstNc}
                pf={display.bidFlagPayfor}
              >
                BUYER
              </InstText>
            }
            labelCls="gap-1"
            diff={diffKeys.has('bidInstName')}
          >
            {display.bidInstName}
          </Renderer.Item>
          <Renderer.Item
            label={
              <CityText
                mode={display.bidTradeMode}
                diff={diffKeys.has('bidTradeMode')}
              />
            }
            labelCls="gap-2"
          >
            {display.bidInstCity}
          </Renderer.Item>
          <Renderer.Item
            label="Trader"
            diff={diffKeys.has('bidTrader')}
          >
            {display.bidTrader}
          </Renderer.Item>

          <Renderer.Item
            label={
              <InstText
                nc={display.ofrInstNc}
                pf={display.ofrFlagPayfor}
              >
                SELLER
              </InstText>
            }
            labelCls="gap-1"
            diff={diffKeys.has('ofrInstName')}
          >
            {display.ofrInstName}
          </Renderer.Item>
          <Renderer.Item
            label={
              <CityText
                mode={display.ofrTradeMode}
                diff={diffKeys.has('ofrTradeMode')}
              />
            }
            labelCls="gap-2"
            diff={diffKeys.has('ofrInstCity')}
          >
            {display.ofrInstCity}
          </Renderer.Item>
          <Renderer.Item
            label="Trader"
            diff={diffKeys.has('ofrTrader')}
          >
            {display.ofrTrader}
          </Renderer.Item>
        </Renderer.Row>

        <Renderer.Row
          className="grid"
          style={{ gridTemplateColumns: '124px 73px 112px 124px 73px 112px' }}
        >
          <Renderer.Item
            label={<InstText nc={display.bidPayforInstNc}>BUYER Payfor</InstText>}
            labelCls="gap-1"
            size="sm"
            diff={diffKeys.has('bidPayforInstName')}
          >
            {display.bidPayforInstName}
          </Renderer.Item>
          <Renderer.Item
            label={<CityText />}
            labelCls="gap-2"
            size="sm"
            diff={diffKeys.has('bidPayforInstCity')}
          >
            {display.bidPayforInstCity}
          </Renderer.Item>
          <Renderer.Item
            label="Trader"
            size="sm"
            diff={diffKeys.has('bidPayforTrader')}
          >
            {display.bidPayforTrader}
          </Renderer.Item>

          <Renderer.Item
            label={<InstText nc={display.ofrPayforInstNc}>SELLER Payfor</InstText>}
            labelCls="gap-1"
            size="sm"
            diff={diffKeys.has('ofrPayforInstName')}
          >
            {display.ofrPayforInstName}
          </Renderer.Item>
          <Renderer.Item
            label={<CityText />}
            labelCls="gap-2"
            size="sm"
            diff={diffKeys.has('ofrPayforInstCity')}
          >
            {display.ofrPayforInstCity}
          </Renderer.Item>
          <Renderer.Item
            label="Trader"
            size="sm"
            diff={diffKeys.has('ofrPayforTrader')}
          >
            {display.ofrPayforTrader}
          </Renderer.Item>
        </Renderer.Row>

        <Renderer.Row
          className="grid"
          style={{ gridTemplateColumns: '124px 112px 160px 110px 112px' }}
        >
          <Renderer.Item
            label="Currency"
            diff={diffKeys.has('currency')}
          >
            {display.currency}
          </Renderer.Item>
          <Renderer.Item
            label="Face Amount"
            diff={diffKeys.has('volume')}
          >
            {display.volume}
          </Renderer.Item>
          <Renderer.Item
            label="Yield"
            diff={diffKeys.has('yield')}
          >
            {display.yield}
          </Renderer.Item>
          <Renderer.Item
            label="Full Price"
            diff={diffKeys.has('fullPrice')}
          >
            {display.fullPrice}
          </Renderer.Item>
          <Renderer.Item
            label="Net Price"
            diff={diffKeys.has('clearPrice')}
          >
            {display.clearPrice}
          </Renderer.Item>
        </Renderer.Row>

        <Renderer.Row
          className="grid"
          style={{ gridTemplateColumns: '124px 112px 160px 110px 112px' }}
        >
          <Renderer.Item
            label="Exercise Type"
            diff={diffKeys.has('exerciseType')}
          >
            {display.exerciseType}
          </Renderer.Item>
          <Renderer.Item
            label="Settlement Date"
            diff={diffKeys.has('settlementDate')}
          >
            {display.settlementDate}
          </Renderer.Item>
          <Renderer.Item
            label="Settlement Amount"
            diff={diffKeys.has('settlementAmount')}
          >
            {display.settlementAmount}
          </Renderer.Item>
          <Renderer.Item
            label="Option Date"
            diff={diffKeys.has('optionDate')}
          >
            {display.optionDate}
          </Renderer.Item>
          <Renderer.Item
            label="Maturity Date"
            diff={diffKeys.has('maturityDate')}
          >
            {display.maturityDate}
          </Renderer.Item>
        </Renderer.Row>

        <Renderer.Row
          className="grid"
          style={{ gridTemplateColumns: '236px 270px 112px' }}
        >
          <Renderer.Item
            label="Bond Code"
            diff={diffKeys.has('bondCode')}
          >
            {display.bondCode}
          </Renderer.Item>
          <Renderer.Item
            label="Bond Name"
            diff={diffKeys.has('bondName')}
          >
            {display.bondName}
          </Renderer.Item>
          <Renderer.Item
            label="Delivery Type"
            diff={diffKeys.has('settlementMode')}
          >
            {display.settlementMode}
          </Renderer.Item>
        </Renderer.Row>

        <Renderer.Row className="grid grid-cols-4 bg-[#fee9d2]">
          <Renderer.Item
            label="Buyer‘s Brokerage"
            childrenCls={typeof display.bidBrokerage !== 'string' ? 'flex flex-col items-start gap-3' : ''}
            diff={diffKeys.has('bidBrokerage')}
            content={typeof display.bidBrokerage === 'string' ? display.bidBrokerage : undefined}
          >
            {/* 机构（B） bidBrokerageComment */}
            <Renderer.Item diff={diffKeys.has('bidBrokerageComment')}>{display.bidBrokerageComment}</Renderer.Item>

            {display.bidBrokerage}
          </Renderer.Item>

          <Renderer.Item
            label="Party A"
            diff={diffKeys.has('bidInstSpecial')}
          >
            {display.bidInstSpecial}
          </Renderer.Item>

          <Renderer.Item
            label="Seller‘s Brokerage"
            childrenCls={typeof display.ofrBrokerage !== 'string' ? 'flex flex-col items-start gap-3' : ''}
            diff={diffKeys.has('ofrBrokerage')}
            content={typeof display.ofrBrokerage === 'string' ? display.ofrBrokerage : undefined}
          >
            {/* 机构（O） ofrBrokerageComment */}
            <Renderer.Item diff={diffKeys.has('ofrBrokerageComment')}>{display.ofrBrokerageComment}</Renderer.Item>

            {display.ofrBrokerage}
          </Renderer.Item>
          <Renderer.Item
            label="Party B"
            diff={diffKeys.has('ofrInstSpecial')}
          >
            {display.ofrInstSpecial}
          </Renderer.Item>
        </Renderer.Row>

        <Renderer.Row className="grid grid-cols-2 bg-[#fee9d2]">
          <Renderer.Item
            label="Common"
            diff={diffKeys.has('otherDetail')}
          >
            {display.otherDetail}
          </Renderer.Item>
          <Renderer.Item
            label="Info for Back Office"
            diff={diffKeys.has('backendMessage')}
          >
            {display.backendMessage}
          </Renderer.Item>
        </Renderer.Row>

        <Renderer.Row
          className="grid grid-cols-4 bg-[#fee9d2]"
          dashed
        >
          <Renderer.Item
            label="Broker Party A"
            align="horizontal"
            className="!min-h-[40px]"
          />
          <Renderer.Item
            label="Percent"
            align="horizontal"
            className="!min-h-[40px]"
          />
          <Renderer.Item
            label="Broker Party B"
            align="horizontal"
            className="!min-h-[40px]"
          />
          <Renderer.Item
            label="Percent"
            align="horizontal"
            className="!min-h-[40px]"
          />
        </Renderer.Row>

        <Renderer.Row
          className="grid grid-cols-4 bg-[#fee9d2]"
          dashed
        >
          <Renderer.Item
            align="horizontal"
            diff={diffKeys.has('bidBrokerAName')}
          >
            {display.bidBrokerAName}
          </Renderer.Item>
          <Renderer.Item
            align="horizontal"
            diff={diffKeys.has('bidBrokerAPercent')}
          >
            {display.bidBrokerAPercent}
          </Renderer.Item>
          <Renderer.Item
            align="horizontal"
            diff={diffKeys.has('ofrBrokerAName')}
          >
            {display.ofrBrokerAName}
          </Renderer.Item>
          <Renderer.Item
            align="horizontal"
            diff={diffKeys.has('ofrBrokerAPercent')}
          >
            {display.ofrBrokerAPercent}
          </Renderer.Item>
        </Renderer.Row>

        {!!(display.bidBrokerBName || display.ofrBrokerBName) && (
          <Renderer.Row
            className="grid grid-cols-4 bg-[#fee9d2]"
            dashed
          >
            <Renderer.Item
              align="horizontal"
              diff={diffKeys.has('bidBrokerBName')}
            >
              {display.bidBrokerBName}
            </Renderer.Item>
            <Renderer.Item
              align="horizontal"
              diff={diffKeys.has('bidBrokerBPercent')}
            >
              {display.bidBrokerBPercent}
            </Renderer.Item>
            <Renderer.Item
              align="horizontal"
              diff={diffKeys.has('ofrBrokerBName')}
            >
              {display.ofrBrokerBName}
            </Renderer.Item>
            <Renderer.Item
              align="horizontal"
              diff={diffKeys.has('ofrBrokerBPercent')}
            >
              {display.ofrBrokerBPercent}
            </Renderer.Item>
          </Renderer.Row>
        )}

        {!!(display.bidBrokerCName || display.ofrBrokerCName) && (
          <Renderer.Row
            className="grid grid-cols-4 bg-[#fee9d2]"
            dashed
          >
            <Renderer.Item
              align="horizontal"
              diff={diffKeys.has('bidBrokerCName')}
            >
              {display.bidBrokerCName}
            </Renderer.Item>
            <Renderer.Item
              align="horizontal"
              diff={diffKeys.has('bidBrokerCPercent')}
            >
              {display.bidBrokerCPercent}
            </Renderer.Item>
            <Renderer.Item
              align="horizontal"
              diff={diffKeys.has('ofrBrokerCName')}
            >
              {display.ofrBrokerCName}
            </Renderer.Item>
            <Renderer.Item
              align="horizontal"
              diff={diffKeys.has('ofrBrokerCPercent')}
            >
              {display.ofrBrokerCPercent}
            </Renderer.Item>
          </Renderer.Row>
        )}

        {!!(display.bidBrokerDName || display.ofrBrokerDName) && (
          <Renderer.Row
            className="grid grid-cols-4 bg-[#fee9d2]"
            dashed
          >
            <Renderer.Item
              align="horizontal"
              diff={diffKeys.has('bidBrokerDName')}
            >
              {display.bidBrokerDName}
            </Renderer.Item>
            <Renderer.Item
              align="horizontal"
              diff={diffKeys.has('bidBrokerDPercent')}
            >
              {display.bidBrokerDPercent}
            </Renderer.Item>
            <Renderer.Item
              align="horizontal"
              diff={diffKeys.has('ofrBrokerDName')}
            >
              {display.ofrBrokerDName}
            </Renderer.Item>
            <Renderer.Item
              align="horizontal"
              diff={diffKeys.has('ofrBrokerDPercent')}
            >
              {display.ofrBrokerDPercent}
            </Renderer.Item>
          </Renderer.Row>
        )}

        <img
          className="absolute -top-12 left-1/2 w-24 -ml-12"
          src={statusImage}
          alt="Receipt Deal Status"
        />
      </div>
    );
  }
);
