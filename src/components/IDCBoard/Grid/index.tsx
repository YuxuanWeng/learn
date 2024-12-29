import React, { HTMLProps } from 'react';
import cx from 'classnames';
import { hasOption } from '@fepkg/business/utils/bond';
import { getInstName } from '@fepkg/business/utils/get-name';
import { Tooltip } from '@fepkg/components/Tooltip';
import { IconExchange, IconOco, IconPack, IconStar, IconStar2, IconUrgentFilled } from '@fepkg/icon-park-react';
import { DealType, ProductType, Side } from '@fepkg/services/types/enum';
import { hasValidPrice } from '@/common/utils/quote-price';
import ColorfulLiquidation from '@/components/ColorfulLiquidation';
import { useHead } from '@/components/IDCBoard/Head/HeadProvider';
import { Exercise, Maturity } from '@/components/Quote/types';
import { miscStorage } from '@/localdb/miscStorage';
import { PriceIcon } from '../Price';
import { IGrid } from '../types';
import './style.less';

type IDom = Omit<HTMLProps<HTMLDivElement>, keyof IGrid>;

const IconWrapper = ({ icon }: { icon: React.ReactNode }) => {
  return <div className="bg-gray-000/4 rounded-sm w-4 h-4 flex items-center justify-center">{icon}</div>;
};

const BASE_TEXT_CLS = 'text-xs text-gray-100 font-normal';
const BASE_FLEX = 'flex justify-between w-full items-center';

const getVolumeColor = (flagInternal?: boolean, sideStr?: 'bid' | 'ofr') => {
  if (flagInternal) return 'text-primary-100';
  return sideStr === 'bid' ? 'text-orange-050' : 'text-secondary-050';
};

const IDCGrid = ({ isOptimal, bond, quote, showQuote = false, onDoubleClick, isEmpty, ...rest }: IGrid & IDom) => {
  const { accessCache, isSimplify, isDetailPage } = useHead();
  const heightStyle = isSimplify ? 'h-[78px]' : 'h-[114px]';
  if (!quote) return null;
  const sideStr = quote.side === Side.SideBid ? 'bid' : 'ofr';

  if (!hasValidPrice(quote)) {
    return (
      <div
        {...rest}
        className={cx('idc-grid', 'empty', sideStr, heightStyle, isSimplify && '!mb-1')}
        onDoubleClick={() => onDoubleClick?.(quote.side === Side.SideOfr ? DealType.TKN : DealType.GVN)}
      />
    );
  }

  const exerciseCmt = () => {
    if (isSimplify && quote.exercise_manual && hasOption(bond)) {
      return quote.is_exercise ? Exercise.label : Maturity.label;
    }
    return '';
  };

  const cmt = `${quote.flag_bilateral ? '点双边' : ''}${quote.flag_request ? '请求报价' : ''}${
    quote.comment
  }${exerciseCmt()}`;

  const isSelf = miscStorage.userInfo?.user_id === quote.broker_info?.broker_id;

  const bondShortName = getInstName({ inst: quote.inst_info, productType: quote.product_type });

  const traderNode = () => {
    return (
      <Tooltip
        truncate
        content={quote.trader_info?.name_zh}
      >
        <span className="truncate max-w-[75px] inline-block">{quote.trader_info?.name_zh}</span>
      </Tooltip>
    );
  };

  return (
    <div
      className={cx('flex flex-col', 'idc-grid', sideStr, heightStyle, !isSimplify ? 'p-1' : 'px-1 !mb-1')}
      onDoubleClick={() => {
        if (!accessCache.action) return;
        onDoubleClick?.(quote.side === Side.SideOfr ? DealType.TKN : DealType.GVN);
      }}
    >
      {/* 第一行，报价量/报价标签 */}
      <div className={cx(BASE_FLEX, 'h-6')}>
        <div className="flex max-w-[76px] items-center">
          <Tooltip
            truncate
            content={quote.volume}
          >
            <span
              className={cx(
                showQuote ? 'max-w-[60px]' : 'w-full',
                'truncate font-semibold text-md',
                getVolumeColor(quote.flag_internal, sideStr)
              )}
            >
              {quote.volume}
            </span>
          </Tooltip>

          {showQuote && (
            <div className="ml-1">
              <PriceIcon quote={quote} />
            </div>
          )}
        </div>

        <div className="flex h-4 gap-1 text-gray-100">
          {quote.flag_oco && <IconWrapper icon={<IconOco />} />}
          {quote.flag_exchange && <IconWrapper icon={<IconExchange />} />}
          {quote.flag_package && <IconWrapper icon={<IconPack />} />}
          {quote.flag_star === 1 && <IconWrapper icon={<IconStar />} />}
          {quote.flag_star === 2 && <IconWrapper icon={<IconStar2 />} />}
        </div>
      </div>

      {/* 第二行，结算方式/整量 */}
      <div className={cx(BASE_FLEX, ' h-4', !isSimplify && 'mt-[2px]')}>
        {/* 结算方式 */}
        <div>
          <ColorfulLiquidation
            liquidation_speed_list={quote.deal_liquidation_speed_list}
            fra_className={cx(
              !isDetailPage && !isSimplify && '!bg-danger-100 !px-1 !text-gray-000',
              'text-gray-100 truncate h-full rounded max-w-[76px]'
            )}
            className="max-w-[76px] flex items-center"
          />
        </div>
        {/* 整/紧急 */}
        <div className="flex h-4 gap-1">
          {quote.flag_indivisible && <IconWrapper icon={<span className="text-gray-100">整</span>} />}
          {quote.flag_urgent && <IconWrapper icon={<IconUrgentFilled className="text-orange-100" />} />}
        </div>
      </div>

      {/* 第三行，债券名/交易所/点双边 */}
      <div className={cx(BASE_FLEX, 'h-4', BASE_TEXT_CLS, !isSimplify && 'mt-2')}>
        {/* 债券名 */}
        <Tooltip
          truncate
          content={bondShortName}
        >
          <span className="truncate max-w-[76px] inline-block">{bondShortName}</span>
        </Tooltip>
        <div>{quote.flag_stock_exchange && '交易所'}</div>
      </div>

      {/* 完整模式第四行，trader/行权/到期 */}
      {!isSimplify && (
        <div className={cx(BASE_FLEX, 'h-4 mt-1', BASE_TEXT_CLS)}>
          {traderNode()}

          {quote.exercise_manual && hasOption(bond) && (
            <div>
              {quote.is_exercise === true && Exercise.label}
              {quote.is_exercise === false && Maturity.label}
            </div>
          )}
        </div>
      )}

      {/* 完整模式第五行，经纪人/文本备注 */}
      {!isSimplify && (
        <div className={cx(BASE_FLEX, 'h-4 mt-1', BASE_TEXT_CLS)}>
          <Tooltip
            truncate
            content={quote.broker_info?.name_zh}
          >
            <span
              className={cx(
                'h-4 box-content leading-4 max-w-[76px] truncate',
                isSelf &&
                  quote.broker_info?.name_zh &&
                  'px-1 rounded-lg border border-solid border-primary-100 !text-primary-100'
              )}
            >
              {quote.broker_info?.name_zh}
            </span>
          </Tooltip>

          <div className="text-right">
            <Tooltip
              truncate
              content={cmt}
            >
              <div className="truncate w-[56px]">{cmt}</div>
            </Tooltip>
          </div>
        </div>
      )}

      {/* 精简模式第四行，trader/文本备注(带着行权的部分信息) */}
      {isSimplify && (
        <div className={cx(BASE_FLEX, 'h-4', BASE_TEXT_CLS)}>
          {traderNode()}
          <div className="text-right">
            <Tooltip
              truncate
              content={cmt}
            >
              <div className="truncate w-[56px]">{cmt}</div>
            </Tooltip>
          </div>
        </div>
      )}
    </div>
  );
};

export default IDCGrid;
