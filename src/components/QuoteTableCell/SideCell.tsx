import { useMemo } from 'react';
import cx from 'classnames';
import { basicCls } from '@fepkg/business/components/QuoteTableCell/constants';
import { SideMap } from '@fepkg/business/constants/map';
import { hasOption } from '@fepkg/business/utils/bond';
import { transformPriceContent } from '@fepkg/business/utils/price';
import { SERVER_NIL } from '@fepkg/common/constants';
import { Tooltip } from '@fepkg/components/Tooltip';
import {
  IconCornerMark,
  IconExchange,
  IconOco,
  IconPack,
  IconProvider,
  IconStar,
  IconStar2
} from '@fepkg/icon-park-react';
import { FiccBondBasic, LiquidationSpeed } from '@fepkg/services/types/common';
import { BondQuoteType, Side } from '@fepkg/services/types/enum';
import { isUndefined } from 'lodash-es';
import { formatLiquidationSpeedListToString } from '@/common/utils/liq-speed';

type SideCellPriceProps = {
  /** container className */
  className?: string;
  /** 对齐方式 */
  align?: 'start' | 'end';
  /** 方向 */
  side?: Side;
  /** 是否有价格 */
  hasPrice?: boolean;
  /** 价格（最优报价用） */
  price?: number;
  /** 报价（非最优报价用） */
  quote?: { yield?: number; clean_price?: number; full_price?: number; spread?: number; quote_price?: number };
  /** 报价类型（非最优报价用） */
  quoteType?: BondQuoteType;
  /** 返点值 */
  returnPoint?: number;
  /** 是否有返点标记 */
  rebate?: boolean;
  /** 是否为意向价 */
  intention?: boolean;
  /** 字重是否为 extrabold */
  extrabold?: boolean;
};

type SideCellProps = SideCellPriceProps & {
  /** 备注信息 */
  comment?: string;
  /** 是否有 Almost done 标记 */
  almostDone?: boolean;
  /** 是否为内部报价 */
  internal?: boolean;
  /** 单/双星标记，1 为单星，2 为双星 */
  star?: number;
  /** 是否有 oco 标记 */
  oco?: boolean;
  /** 是否有交换标记 */
  exchange?: boolean;
  /** 是否有打包标记 */
  packAge?: boolean;
  /** 结算方式列表 */
  liquidationSpeedList?: LiquidationSpeed[];
  /** 是否手动操作行权 */
  exerciseManual?: boolean;
  /** 债券信息 */
  bondInfo?: FiccBondBasic;
};

export const SideCellPrice = ({
  className,
  align = 'end',
  side,
  quote,
  quoteType,
  extrabold = true,
  returnPoint = -1,
  rebate,
  intention,
  price,
  ...restProps
}: SideCellPriceProps) => {
  const isUndefinedPrice = isUndefined(price);

  const hasPrice = restProps?.hasPrice ?? (!isUndefinedPrice && price >= 0);

  /* 单元格显示的几种情况
   * 1. 点亮BID/OFR ---> 显示 BID/OFR
   * 2. 不输入报价 & 点亮F ---> 显示 平价返
   * 3. 不输入报价 & 点亮F & & 输入返点值9.00  ---> 显示 -- ｜ F9.00
   * 4. 输入报价2.00 & 点亮F ---> 显示 2.00 ｜ F--
   * 5. 输入报价2.00 & 点亮F & 输入返点值9.00 ---> 显示 2.00 ｜ F9.00
   */

  const returnPointContent = returnPoint > SERVER_NIL ? transformPriceContent(returnPoint) : '--';

  /** 是否展示平价反 */
  const showFlatRateReturn =
    rebate &&
    (returnPoint === SERVER_NIL || returnPoint === 0) &&
    (isUndefinedPrice || (!isUndefinedPrice && (price === SERVER_NIL || price === 0)));

  // 意向价，与平价返互斥
  if (intention) {
    return (
      <div
        className={cx(
          'min-w-[34px] h-full flex flex-col justify-center items-center text-md my-auto',
          extrabold && 'font-heavy',
          className
        )}
      >
        {/* {side === Side.SideBid ?'BID' : 'OFR'} */}
        {SideMap[side || Side.SideBid].upperCase}
      </div>
    );
  }

  // 平价返
  if (showFlatRateReturn) {
    return (
      <div
        className={cx(
          'min-w-[54px] h-full flex flex-col justify-center items-center text-md my-auto',
          extrabold && 'font-heavy',
          className
        )}
      >
        平价返
      </div>
    );
  }

  // 非意向价
  const content = Number((price || 0).toFixed(4));
  const priceContent = hasPrice ? transformPriceContent(content) : '--';

  const alignCls = align === 'end' ? 'self-end' : 'self-start';

  return (
    <div className={cx('h-full flex flex-col justify-center items-center', className)}>
      <div
        className={cx(
          'price-content ',
          alignCls,
          'min-w-[14px]',
          rebate ? 'text-sm/3.5' : 'text-md/4',
          extrabold && 'font-heavy'
        )}
      >
        {priceContent}
      </div>
      {rebate && (
        <div className={cx(alignCls, 'min-w-[12px] h-3 text-xs/3 font-medium')}>
          <span className="mr-0.5">F</span>
          {returnPointContent}
        </div>
      )}
    </div>
  );
};

export const getSideFontCls = (side?: Side, disabled?: boolean, internal?: boolean, disabledCls = 'text-gray-300') => {
  if (disabled) return disabledCls;
  if (internal) return 'text-primary-100';
  if (side === Side.SideBid) return 'text-orange-100';
  if (side === Side.SideOfr) return 'text-secondary-100';
  return '';
};

export const SideCell = ({
  className,
  align,
  side,
  price,
  hasPrice,
  quote,
  quoteType,
  returnPoint,
  intention,
  comment,
  almostDone,
  internal,
  rebate,
  star,
  oco,
  exchange,
  packAge,
  liquidationSpeedList = [],
  extrabold = true,
  exerciseManual,
  bondInfo
}: SideCellProps) => {
  const fontCls = getSideFontCls(side, almostDone, internal);

  const liqSpeed = useMemo(() => formatLiquidationSpeedListToString(liquidationSpeedList), [liquidationSpeedList]);

  /** 是否展示右上角角标 */
  const showTriangleBadge = comment || liqSpeed || (hasOption(bondInfo) && exerciseManual);

  /** 是否展示右侧图标 */
  const showIcons = star === 1 || star === 2 || showTriangleBadge || oco || packAge || exchange;

  return (
    <IconProvider value={{ size: 12 }}>
      <Tooltip
        placement="top-end"
        content={comment}
        destroyOnClose
        floatingProps={{ className: '!z-hightest' }}
      >
        <div className={cx(basicCls, 'relative pl-0.5 overflow-hidden')}>
          <div
            className={cx(
              fontCls,
              'absolute right-0.5 pr-10 bg-placeholder',
              rebate ? 'top-0 bottom-0' : 'top-0.5 bottom-0.5'
            )}
          >
            <SideCellPrice
              className={className}
              align={align}
              side={side}
              price={price}
              hasPrice={hasPrice}
              quote={quote}
              quoteType={quoteType}
              returnPoint={returnPoint}
              rebate={rebate}
              intention={intention}
              extrabold={extrabold}
            />
          </div>

          {showIcons && (
            <div className="absolute right-0.5 top-auto bottom-auto grid grid-cols-2 grid-rows-2 gap-y-0.5 gap-x-1 w-7 h-[26px] text-gray-100 bg-placeholder">
              {(star === 1 || star === 2) &&
                (star === 1 ? <IconStar className="col-[1] row-[1]" /> : <IconStar2 className="col-[1] row-[1]" />)}

              {/* 简称、右上角角标 */}
              {showTriangleBadge ? <IconCornerMark className="col-[2] row-[1] text-orange-100" /> : null}

              {/* oco 和打包是互斥的 */}
              {(oco || packAge) &&
                (oco ? <IconOco className="col-[1] row-[2]" /> : <IconPack className="col-[1] row-[2]" />)}

              {exchange && <IconExchange className="col-[2] row-[2]" />}
            </div>
          )}
        </div>
      </Tooltip>
    </IconProvider>
  );
};
