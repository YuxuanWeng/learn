import { memo, useMemo } from 'react';
import cx from 'classnames';
import { hasOption } from '@fepkg/business/utils/bond';
import { Tooltip } from '@fepkg/components/Tooltip';
import { IconCornerMark } from '@fepkg/icon-park-react';
import { FiccBondBasic, QuoteHandicap } from '@fepkg/services/types/common';
import { Side } from '@fepkg/services/types/enum';
import { isEqual, isNil } from 'lodash-es';
import { SideCellPrice, getSideFontCls } from '@/components/QuoteTableCell/SideCell';
import { miscStorage } from '@/localdb/miscStorage';
import { getOptimalVal, getTooTipMsgs, liquidationSpeedIsValid } from '../../../util';

type Props = {
  bidOptimalQuote?: QuoteHandicap[];
  ofrOptimalQuote?: QuoteHandicap[];
  bondInfo?: FiccBondBasic;
  bidHasQuote: boolean;
  ofrHasQuote: boolean;
};

/** 机构和交易员组件 */
const InstInfo = ({ quote }: { quote?: QuoteHandicap }) => {
  const cls = 'w-[200px] truncate px-4 text-orange-050 text-sm font-medium leading-8';
  if (isNil(quote)) {
    return <div className={cls}>--</div>;
  }
  const { inst_name, trader_name, trader_tag } = quote;
  let instTrader = inst_name;
  if (trader_name) instTrader += `(${trader_name ?? ''}${trader_tag ?? ''})`;
  return (
    <Tooltip
      truncate
      content={instTrader}
    >
      <div className={cls}>{instTrader}</div>
    </Tooltip>
  );
};

const PriceInfo = ({
  quoteList,
  bondInfo,
  quoteSide,
  brokerHasQuote,
  isOptimal
}: {
  quoteList: QuoteHandicap[];
  bondInfo: FiccBondBasic;
  quoteSide: Side;
  brokerHasQuote: boolean;
  isOptimal: boolean;
}) => {
  const quote = quoteList[0];
  const cls = useMemo(() => {
    //   - 当债券提醒卡片上的任意一个trader，即当前经纪人参与报价的交易员的报价为最优报价时，价格处展示红底；
    if (isOptimal) {
      return 'bg-danger-400';
    }
    //   - 当债券提醒卡片上的任意一个trader，即当前经纪人参与报价的交易员的报价非最优报价时，价格处展示红框；
    if (brokerHasQuote) {
      return 'border border-solid border-danger-200 border-[1.5px]';
    }
    return '';
  }, [isOptimal, brokerHasQuote]);
  if (isNil(quote)) {
    const fontCls = quoteSide === Side.SideBid ? 'text-orange-100' : 'text-secondary-100';
    return <div className={cx('w-[120px] px-4 leading-8 font-medium', fontCls)}>--</div>;
  }
  const {
    side,
    comment: quoteComment,
    liquidation_speed_list,
    exercise_manual,
    almost_done,
    flag_internal,
    flag_rebate,
    return_point,
    quote_type,
    price,
    flag_intention,
    flag_bilateral,
    flag_request,
    flag_stock_exchange,
    flag_indivisible
  } = quote;

  const comment = `${flag_bilateral ? '点双边' : ''}${flag_request ? '请求报价' : ''}${
    flag_stock_exchange ? '交易所' : ''
  }${flag_indivisible ? '整量' : ''}${quoteComment ?? ''}`;

  /** 是否显示右上角三角形 */
  const showTriangleBadge =
    comment || liquidationSpeedIsValid(liquidation_speed_list) || (hasOption(bondInfo) && exercise_manual);
  /** 字体的颜色 */
  const fontCls = getSideFontCls(side, almost_done, flag_internal);

  const toolTipMsgs = getTooTipMsgs(quoteList, bondInfo);
  const hasPrice = !isNil(price) && price > 0;

  return (
    <Tooltip
      content={toolTipMsgs}
      floatingProps={{ className: 'max-w-[700px] whitespace-break-spaces break-words' }}
    >
      <div className={cx(cls, fontCls, 'relative overflow-hidden w-[120px] px-4')}>
        <div
          className={cx(
            fontCls,
            'absolute  bg-placeholder',
            flag_rebate ? 'top-0 bottom-0' : 'top-0.5 bottom-0.5 !text-md [&_.price-content]:!text-md'
          )}
        >
          <SideCellPrice
            align="start"
            side={side}
            price={price}
            hasPrice={hasPrice}
            quote={quote}
            quoteType={quote_type}
            returnPoint={return_point}
            rebate={flag_rebate}
            intention={flag_intention}
            className="!text-md"
          />
        </div>
        {/* 右上角角标 */}
        {showTriangleBadge ? (
          <IconCornerMark className="flex absolute top-[0px] right-0.5 w-3 h-3 text-orange-100" />
        ) : null}
      </div>
    </Tooltip>
  );
};

const VolumeComp = ({ quote, isLast }: { quote: QuoteHandicap; isLast: boolean }) => {
  const { side, almost_done, flag_internal } = quote;
  const fontCls = getSideFontCls(side, almost_done, flag_internal);
  const optimalVolume = getOptimalVal(quote) + (isLast ? '+' : '');
  return <span className={cx(fontCls)}>{optimalVolume}</span>;
};

const OptimalVomComp = ({
  quoteList,
  className,
  bondInfo
}: {
  quoteList: QuoteHandicap[];
  className?: string;
  bondInfo: FiccBondBasic;
}) => {
  const toolTipMsgs = getTooTipMsgs(quoteList, bondInfo);
  const { length } = quoteList;
  return (
    <Tooltip
      content={toolTipMsgs}
      floatingProps={{ className: 'max-w-[700px] whitespace-break-spaces break-words' }}
    >
      <div className={cx('text-[13px] font-semibold truncate', className)}>
        {quoteList.map((quote, index) => (
          <VolumeComp
            quote={quote}
            isLast={index < length - 1}
            key={quote.quote_id}
          />
        ))}
      </div>
    </Tooltip>
  );
};

const VolumeInfo = ({
  bidQuoteList,
  ofrQuoteList,
  bondInfo
}: {
  bidQuoteList: QuoteHandicap[];
  ofrQuoteList: QuoteHandicap[];
  bondInfo: FiccBondBasic;
}) => {
  return (
    <div className="flex items-center h-8 max-w-[calc(100%_-_640px)]">
      {bidQuoteList.length > 0 ? (
        <OptimalVomComp
          quoteList={bidQuoteList}
          bondInfo={bondInfo}
          className="text-orange-100"
        />
      ) : (
        <div className="text-orange-100 whitespace-nowrap">--</div>
      )}
      <div className="bg-gray-300 w-0.5 h-3 mx-2 basis-auto" />
      {ofrQuoteList.length > 0 ? (
        <OptimalVomComp
          quoteList={ofrQuoteList}
          className="min-w-[60px] flex-1 text-secondary-100"
          bondInfo={bondInfo}
        />
      ) : (
        <div className="text-secondary-100 whitespace-nowrap">--</div>
      )}
    </div>
  );
};

/**
 * 最优报价机构，最优报价交易员，最优价取 数组的第一个元素的数据。这个数组返回结构的顺序和最优报价深度悬浮框的顺序是一致的
 * 最优量的逻辑很诡异：可能会有很多最优量。以数组第一个元素的数量为标准。如果下边有价格相等的，则数量相加
 */
const Inner = ({ bidOptimalQuote = [], ofrOptimalQuote = [], bondInfo, bidHasQuote, ofrHasQuote }: Props) => {
  const brokerId = miscStorage.userInfo?.user_id ?? '';
  const bidIsOptimal = useMemo(
    () => bidOptimalQuote.some(quote => quote.broker_id === brokerId),
    [bidOptimalQuote, brokerId]
  );
  const ofrIsOptimal = useMemo(
    () => ofrOptimalQuote.some(quote => quote.broker_id === brokerId),
    [brokerId, ofrOptimalQuote]
  );

  return (
    <div className="flex relative h-8 px-7 border-0 border-dashed border-b-[1px] border-gray-500">
      {bondInfo && (
        <div className="flex">
          <InstInfo quote={bidOptimalQuote[0]} />
          <PriceInfo
            quoteList={bidOptimalQuote}
            bondInfo={bondInfo}
            quoteSide={Side.SideBid}
            brokerHasQuote={bidHasQuote}
            isOptimal={bidIsOptimal}
          />
          <PriceInfo
            quoteList={ofrOptimalQuote}
            bondInfo={bondInfo}
            quoteSide={Side.SideOfr}
            brokerHasQuote={ofrHasQuote}
            isOptimal={ofrIsOptimal}
          />
          <InstInfo quote={ofrOptimalQuote[0]} />
        </div>
      )}

      {bondInfo && (
        <VolumeInfo
          bidQuoteList={bidOptimalQuote}
          ofrQuoteList={ofrOptimalQuote}
          bondInfo={bondInfo}
        />
      )}
    </div>
  );
};

export const OptimalInfo = memo(Inner, (prevProps, nextProps) => isEqual(prevProps, nextProps));
