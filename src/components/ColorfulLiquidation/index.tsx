import cx from 'classnames';
import { Tooltip } from '@fepkg/components/Tooltip';
import { LiquidationSpeed } from '@fepkg/services/types/common';
import { isFRALiquidation, liquidationDateToTag } from '@packages/utils/liq-speed';
import { formatLiquidationSpeedListToString } from '@/common/utils/liq-speed';

type IParams = {
  liquidation_speed_list?: LiquidationSpeed[];

  /** 远期部分样式 */
  fra_className?: string;
  className?: string;
};

export default function ColorfulLiquidation({ liquidation_speed_list, fra_className = '', className = '' }: IParams) {
  if (!liquidation_speed_list) return null;

  if (!Array.isArray(liquidation_speed_list)) throw new Error('invalid liquidation_speed_list');

  const notFraLiquidations = liquidation_speed_list?.filter(item => !isFRALiquidation(item));
  const fraLiquidations = liquidation_speed_list?.filter(item => isFRALiquidation(item));

  const fraContent = formatLiquidationSpeedListToString(liquidationDateToTag(fraLiquidations), 'MM.DD');
  const notFraContent = notFraLiquidations.length
    ? formatLiquidationSpeedListToString(liquidationDateToTag(notFraLiquidations), 'MM.DD')
    : null;

  return (
    <div className={className}>
      {notFraLiquidations.length > 0 && (
        <Tooltip
          truncate
          content={notFraContent}
        >
          <span className={cx('truncate', fraLiquidations?.length ? 'max-w-[38px]' : 'max-w-[75px]')}>
            {notFraContent}
          </span>
        </Tooltip>
      )}
      {notFraLiquidations.length > 0 && fraLiquidations?.length > 0 && <span className="mr-0.5">,</span>}
      {fraLiquidations?.length > 0 && (
        <Tooltip
          truncate
          content={fraContent}
        >
          <span className={cx(fra_className, notFraLiquidations?.length ? 'max-w-[38px]' : 'w-full')}>
            {fraContent}
          </span>
        </Tooltip>
      )}
    </div>
  );
}
