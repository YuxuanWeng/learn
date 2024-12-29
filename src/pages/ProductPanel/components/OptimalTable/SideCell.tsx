import cx from 'classnames';
import { basicCls } from '@fepkg/business/components/QuoteTableCell';
import { hasOption } from '@fepkg/business/utils/bond';
import { SERVER_NIL } from '@fepkg/common/constants';
import { NumberBadge } from '@fepkg/components/Tags';
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
import { QuoteLite } from '@fepkg/services/types/common';
import { LiquidationSpeedTag, Side, UserSettingFunction } from '@fepkg/services/types/enum';
import { pick } from 'lodash-es';
import { CommentFlagKeys } from '@/components/Quote/types';
import { SideCellPrice } from '@/components/QuoteTableCell';
import { useUserSettingJotai } from '@/layouts/HooksRender/components/SyncUserSettings';
import { isQuoteDisplayAmountObj } from '@/pages/Base/SystemSetting/components/QuoteSettings/components/QuoteDisplaySettings/OptimalQuoteDisplayAmount';
import { IUserSettingValue, QuoteDisplayAmount } from '@/pages/Base/SystemSetting/components/QuoteSettings/types';
import { OptimalTableColumn } from './types';

type SideCellProps = {
  /** 方向 */
  side: Side;
  /** 原始数据 */
  column: OptimalTableColumn;
};

const getQuoteDisplaySetting = (settings: IUserSettingValue | null, type: keyof QuoteDisplayAmount) => {
  const defaultSetting = type === 'external';
  // settings不存在则返回默认值
  if (!settings) {
    return defaultSetting;
  }
  const config = settings[UserSettingFunction.UserSettingOptimalQuoteDisplayAmount];
  if (!isQuoteDisplayAmountObj(config)) {
    return defaultSetting;
  }
  return config[type];
};

export const SideCell = ({ column, side }: SideCellProps) => {
  const userSettings = useUserSettingJotai();

  const { original, bidInfo, ofrInfo } = column;
  const { quote_id_ext_bid, quote_id_ext_ofr, bond_basic_info: bond_info } = original;

  let optimalQuote: QuoteLite | undefined;
  let extOptimalQuote: QuoteLite | undefined;
  let intOptimalQuote: QuoteLite | undefined;
  /** 用于判断展示 Icon 的那条最优报价信息 */
  let flagOptimalQuote: QuoteLite | undefined;

  let intShowOptimal = false;

  let intBatter = false;
  let bothEqual = false;

  let extPrice = 0;
  let intPrice = 0;

  let extVolNum = 0;
  let intVolNum = 0;

  let extReturnPoint = SERVER_NIL;
  let intReturnPoint = SERVER_NIL;

  let comment = '';

  let teamQuote = false;
  let teamOptimalQuote = false;

  if (side === Side.SideBid) {
    optimalQuote = bidInfo?.optimalQuote;
    extOptimalQuote = bidInfo?.extOptimalQuote;
    intOptimalQuote = bidInfo?.intOptimalQuote;
    intShowOptimal = bidInfo?.intShowOptimal;
    intBatter = bidInfo?.intBatter;
    bothEqual = bidInfo?.priceBothEqual;
    extPrice = bidInfo?.extPrice;
    intPrice = bidInfo?.intPrice;
    intVolNum = bidInfo?.intVolNum;
    extVolNum = bidInfo?.extVolNum;
    comment = bidInfo?.comment ?? '';
    teamQuote = bidInfo?.teamQuote;
    teamOptimalQuote = bidInfo?.teamOptimalQuote;
  } else if (side === Side.SideOfr) {
    optimalQuote = ofrInfo?.optimalQuote;
    extOptimalQuote = ofrInfo?.extOptimalQuote;
    intOptimalQuote = ofrInfo?.intOptimalQuote;
    intShowOptimal = ofrInfo?.intShowOptimal;
    intBatter = ofrInfo?.intBatter;
    bothEqual = ofrInfo?.priceBothEqual;
    extPrice = ofrInfo?.extPrice;
    intPrice = ofrInfo?.intPrice;
    intVolNum = ofrInfo?.intVolNum;
    extVolNum = ofrInfo?.extVolNum;
    comment = ofrInfo?.comment ?? '';
    teamQuote = ofrInfo?.teamQuote;
    teamOptimalQuote = ofrInfo?.teamOptimalQuote;
  }

  const extHasPrice = !!extOptimalQuote;
  const intHasPrice = !!intOptimalQuote;

  // 如果明盘显示最优，则选该方向最优的那条报价信息
  if (intShowOptimal) flagOptimalQuote = optimalQuote;
  // 否则判断根据明盘是否有价格，如果明盘有价格，选明盘最优报价信息，反之选暗盘最优报价信息
  else if (side === Side.SideBid) {
    flagOptimalQuote = quote_id_ext_bid !== '0' ? extOptimalQuote : intOptimalQuote;
  } else if (side === Side.SideOfr) {
    flagOptimalQuote = quote_id_ext_ofr !== '0' ? extOptimalQuote : intOptimalQuote;
  }

  // 判断是否存在选中的备注标签
  const hasCommentFlags = Object.values(pick(flagOptimalQuote, CommentFlagKeys)).some(v => !!v);

  extReturnPoint = extOptimalQuote?.return_point ?? SERVER_NIL;
  intReturnPoint = intOptimalQuote?.return_point ?? SERVER_NIL;

  let selectedCls = '';
  if (side === Side.SideBid) selectedCls = 'bid-side-cell';
  else selectedCls = 'ofr-side-cell';

  let extTextCls = 'text-primary-100';
  if (extOptimalQuote?.almost_done) {
    extTextCls = 'text-gray-300';
  } else if (extOptimalQuote?.flag_internal) {
    extTextCls = 'text-primary-100';
  } else if (side === Side.SideBid) {
    extTextCls = 'text-orange-100';
  } else {
    extTextCls = 'text-secondary-100';
  }

  let intTextCls = 'text-primary-100';
  if (intOptimalQuote?.almost_done) {
    intTextCls = 'text-gray-300';
  }

  const teamQuoteCls = cx(teamQuote && !teamOptimalQuote && 'border border-solid border-danger-100 border-[1.5px]');
  const teamOptimalQuoteCls = cx(teamOptimalQuote && '!bg-danger-500');

  /** 是否展示右上角角标 */
  const showTriangleBadge =
    flagOptimalQuote?.liquidation_speed_list?.filter(v => v.tag !== LiquidationSpeedTag.Default).length ||
    flagOptimalQuote?.comment ||
    (hasOption(bond_info) && flagOptimalQuote?.exercise_manual) ||
    hasCommentFlags;

  /** 是否展示右侧图标 */
  const showIcons =
    /* 明盘是否有报价 */
    !!extOptimalQuote &&
    (extOptimalQuote?.flag_star === 1 ||
      extOptimalQuote?.flag_star === 2 ||
      showTriangleBadge ||
      extOptimalQuote?.flag_oco ||
      extOptimalQuote?.flag_package ||
      extOptimalQuote?.flag_exchange);

  /** 是否展示暗盘-实时盘口数量标识 */
  const showInternalTextBadge = getQuoteDisplaySetting(userSettings, 'internal') && intVolNum > 1;

  /** 是否展示明盘-实时盘口数量标识 */
  const showExternalTextBadge = getQuoteDisplaySetting(userSettings, 'external') && extVolNum > 1;

  return (
    <IconProvider value={{ size: 12 }}>
      <Tooltip
        content={comment}
        placement="top-end"
        destroyOnClose
      >
        <div
          className={cx(basicCls, 'relative overflow-hidden !pl-0.5', selectedCls, teamQuoteCls, teamOptimalQuoteCls)}
        >
          {/* 信息展示 */}
          <div
            className={cx(
              'absolute right-0 pr-10 flex items-center gap-2 bg-placeholder',
              selectedCls,
              teamOptimalQuoteCls
            )}
          >
            {/* 暗盘信息 */}
            {showInternalTextBadge && (
              <NumberBadge
                className="w-4 bg-primary-100"
                num={intVolNum}
              />
            )}
            {(intBatter || bothEqual) && (
              <SideCellPrice
                side={side}
                className={intTextCls}
                hasPrice={intHasPrice}
                price={intPrice}
                returnPoint={intReturnPoint}
                rebate={intOptimalQuote?.flag_rebate}
                intention={intOptimalQuote?.flag_intention}
              />
            )}

            {/* 明盘信息 */}
            {showExternalTextBadge && (
              <NumberBadge
                className="w-4 !bg-danger-100 !text-gray-000"
                num={extVolNum}
              />
            )}

            <SideCellPrice
              side={side}
              hasPrice={extHasPrice}
              className={extTextCls}
              price={extPrice}
              returnPoint={extReturnPoint}
              rebate={extOptimalQuote?.flag_rebate}
              intention={extOptimalQuote?.flag_intention}
            />
          </div>
          {showIcons && (
            <div
              className={cx(
                'absolute right-0 top-auto bottom-auto grid grid-cols-2 grid-rows-2 gap-y-0.5 gap-x-1 w-7 h-[26px] mr-0.5 text-gray-100 bg-placeholder',
                selectedCls,
                teamOptimalQuoteCls
              )}
            >
              {(extOptimalQuote?.flag_star === 1 || extOptimalQuote?.flag_star === 2) &&
                (extOptimalQuote?.flag_star === 1 ? (
                  <IconStar className="col-[1] row-[1]" />
                ) : (
                  <IconStar2 className="col-[1] row-[1]" />
                ))}

              {/* 简称、右上角角标 */}
              {showTriangleBadge ? <IconCornerMark className="col-[2] row-[1] text-orange-100" /> : null}

              {/* oco 和打包是互斥的 */}
              {(extOptimalQuote?.flag_oco || extOptimalQuote?.flag_package) &&
                (extOptimalQuote?.flag_oco ? (
                  <IconOco className="col-[1] row-[2]" />
                ) : (
                  <IconPack className="col-[1] row-[2]" />
                ))}

              {extOptimalQuote?.flag_exchange && <IconExchange className="col-[2] row-[2] text-gray-100" />}
            </div>
          )}
        </div>
      </Tooltip>
    </IconProvider>
  );
};
