import cx from 'classnames';
import { alignLeftCls } from '@fepkg/business/components/QuoteTableCell/constants';
import { transformPriceContent } from '@fepkg/business/utils/price';
import { SERVER_NIL } from '@fepkg/common/constants';
import { Tooltip } from '@fepkg/components/Tooltip';
import { IconCornerMark } from '@fepkg/icon-park-react';
import { Direction } from '@fepkg/services/types/enum';
import { isUndefined } from 'lodash-es';

type DirectionStyleRecord = {
  label: string;
  bgCls: string;
  disabledBgCls: string;
};

const directionStyleMap = new Map<Direction, DirectionStyleRecord>([
  [Direction.DirectionGvn, { label: 'GVN', bgCls: 'bg-orange-100', disabledBgCls: 'bg-orange-400' }],
  [Direction.DirectionTkn, { label: 'TKN', bgCls: 'bg-secondary-100', disabledBgCls: 'bg-secondary-400' }],
  [Direction.DirectionTrd, { label: 'TRD', bgCls: 'bg-purple-100', disabledBgCls: 'bg-purple-400' }]
]);

export const DirectionTag = ({ direction, disabled }: { direction: Direction; disabled?: boolean }) => {
  const directionStyle = directionStyleMap.get(direction);
  return (
    <div
      className={cx(
        'flex-center w-12 h-5 rounded-lg font-bold text-xs',
        disabled ? directionStyle?.disabledBgCls : directionStyle?.bgCls,
        disabled ? 'text-gray-300' : 'text-gray-000'
      )}
    >
      {directionStyle?.label}
    </div>
  );
};

type PXCellPriceProps = {
  /** 成交价格 */
  price?: number;
  /** 是否为内部报价 */
  internal?: boolean;
  /** 是否有返点标记 */
  rebate?: boolean;
  /** 返点值 */
  returnPoint?: number;
  /** N.D */
  nothingDone?: boolean;
  className?: string;
};

type PXCellProps = PXCellPriceProps & {
  /** 备注内容 */
  comment: string;
  /** 成交方向 */
  direction: Direction;
  /** 该债券在基本报价中有我或我的团队报价 */
  withActiveQuote?: boolean;
  /** 默认背景色 */
  placeholderCls?: string;
};

export const PXCellPrice = ({
  price = 0,
  internal,
  rebate,
  returnPoint = SERVER_NIL,
  nothingDone,
  className
}: PXCellPriceProps) => {
  const isUndefinedPrice = isUndefined(price);

  const hasPrice = !isUndefinedPrice && price >= 0;

  /** 是否展示平价反（点亮了返点，但没有返点及价格） */
  const showFlatRateReturn =
    rebate &&
    (returnPoint === SERVER_NIL || returnPoint === 0) &&
    (isUndefinedPrice || (!isUndefinedPrice && (price === SERVER_NIL || price === 0)));

  if (showFlatRateReturn) {
    return (
      <div
        className={cx(
          'absolute right-0 pr-3',
          className,
          'flex items-center min-w-[54px] h-full text-md font-heavy whitespace-nowrap',
          nothingDone && '!text-gray-300',
          internal ? 'text-primary-100' : 'text-orange-050'
        )}
      >
        平价返
      </div>
    );
  }

  const priceContent = hasPrice ? transformPriceContent(price) : '--';
  const returnPointContent = returnPoint > SERVER_NIL ? transformPriceContent(returnPoint) : '--';

  return (
    <div
      className={cx(
        'absolute right-0 pr-3 h-full whitespace-nowrap flex flex-col justify-center',
        className,
        nothingDone && '!text-gray-300',
        internal ? 'text-primary-100' : 'text-orange-050'
      )}
    >
      <div
        className={cx(
          'self-end font-heavy text-right',
          rebate ? 'min-w-[12px] text-sm leading-3.5' : 'min-w-[14px] text-md leading-4'
        )}
      >
        {priceContent}
      </div>
      {rebate && (
        <div className="self-end min-w-[12px] h-3 text-xs/3 font-medium flex justify-end">
          <span className="mr-0.5">F</span>
          {returnPointContent}
        </div>
      )}
    </div>
  );
};

export const PXCell = ({
  comment,
  direction,
  withActiveQuote,
  className,
  placeholderCls = 'bg-placeholder',
  ...resetProps
}: PXCellProps) => {
  /** 是否展示右上角角标 */
  const showTriangleBadge = comment;

  return (
    <Tooltip
      placement="top-end"
      content={comment}
      destroyOnClose
    >
      <div className={cx(alignLeftCls, 'relative overflow-hidden', withActiveQuote && 'bg-danger-500')}>
        <DirectionTag
          direction={direction}
          disabled={resetProps.nothingDone}
        />

        <PXCellPrice
          {...resetProps}
          className={cx(withActiveQuote ? 'bg-danger-500' : placeholderCls, className)}
        />

        {/* 右上角角标 */}
        {showTriangleBadge && (
          <IconCornerMark
            className="absolute top-0.5 right-0 text-orange-100"
            size={12}
          />
        )}
      </div>
    </Tooltip>
  );
};
