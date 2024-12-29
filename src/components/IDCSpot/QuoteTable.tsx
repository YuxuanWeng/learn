import { RefObject } from 'react';
import cx from 'classnames';
import { getCP } from '@fepkg/business/utils/get-name';
import { Tooltip } from '@fepkg/components/Tooltip';
import { DealQuote } from '@fepkg/services/types/common';
import { BondQuoteType } from '@fepkg/services/types/enum';
import { liquidationDateToTag } from '@packages/utils/liq-speed';
import { formatLiquidationSpeedListToString } from '@/common/utils/liq-speed';
import { isIDCQuoteSameType } from '@/components/IDCBoard/utils';
import { miscStorage } from '@/localdb/miscStorage';
import { sortSamePriceQuote } from '@/pages/Spot/SpotModal/useSettlements';
import UserName from './UserName';

interface IProps {
  validQuoteList: DealQuote[];
  optimal?: DealQuote;
  updatedIds: RefObject<DealQuote['quote_id'][]>;
}

const textCls = 'bg-primary-600 text-primary-100 text-xs rounded w-4 h-4 flex items-center justify-center';

const renderButtonIcon = (quote?: DealQuote) => {
  if (quote?.quote_type === BondQuoteType.CleanPrice) {
    return (
      <Tooltip content={<span>{quote?.quote_price?.toString()}</span>}>
        <span className={textCls}>净</span>
      </Tooltip>
    );
  }
  if (quote?.quote_type === BondQuoteType.Yield) {
    return (
      <Tooltip content={<span>{quote?.quote_price?.toString()}</span>}>
        <span className={textCls}>收</span>
      </Tooltip>
    );
  }
  return null;
};

export default function QuoteTable({ optimal, validQuoteList, updatedIds }: IProps) {
  return (
    <div className="flex flex-col rounded-lg bg-gray-800 text-sm text-gray-000 table-fixed w-full divide-y divide-x-0 divide-solid divide-gray-700">
      {validQuoteList.sort(sortSamePriceQuote).map(quote => {
        const liquidationSpeed =
          formatLiquidationSpeedListToString(liquidationDateToTag(quote.deal_liquidation_speed_list || []), 'MM.DD') ||
          '--';

        const cp = getCP({ inst: quote.inst_info, trader: quote.trader_info, productType: quote.product_type });

        return (
          <div
            className={cx(
              'flex h-8 items-center text-sm font-medium',
              !!updatedIds.current?.includes(quote?.quote_id) && 'bg-danger-500'
            )}
            key={quote.quote_id}
          >
            {/* 机构(交易员) */}
            <Tooltip
              truncate
              content={cp}
            >
              <span className="w-[168px] truncate pl-4">{cp}</span>
            </Tooltip>

            {/* 用户名 */}
            <div className="w-[120px] flex justify-center">
              <UserName
                isSelf={miscStorage.userInfo?.user_id === quote.broker_info?.broker_id}
                name={
                  quote.broker_info?.name_zh ? (
                    <Tooltip
                      truncate
                      content={quote.broker_info?.name_zh}
                    >
                      <span>{quote.broker_info?.name_zh}</span>
                    </Tooltip>
                  ) : (
                    '--'
                  )
                }
              />
            </div>

            {/* 报价量 */}
            <div className="w-[120px] pl-4 flex items-center gap-1">
              {quote.volume}
              {isIDCQuoteSameType<DealQuote>(optimal, quote) ? null : renderButtonIcon(quote)}
              {quote.flag_indivisible && (
                <div className="bg-gray-500 rounded w-4 h-4 flex items-center justify-center text-xs">
                  <span className="text-gray-100">整</span>
                </div>
              )}
            </div>

            {/* 结算方式 */}
            <Tooltip
              truncate
              content={liquidationSpeed}
            >
              <span className="w-[112px] pl-4 truncate">{liquidationSpeed}</span>
            </Tooltip>
          </div>
        );
      })}
    </div>
  );
}
