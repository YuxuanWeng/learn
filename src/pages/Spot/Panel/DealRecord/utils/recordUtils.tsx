import { ReactNode } from 'react';
import { getNextTradedDate } from '@fepkg/business/hooks/useDealDateMutation';
import { Button } from '@fepkg/components/Button';
import {
  IconCheckCircleFilled,
  IconHelpFilled,
  IconMinusCircleFilled,
  IconPartialConfirmation,
  IconTimeFilled
} from '@fepkg/icon-park-react';
import { Counterparty, LiquidationSpeed } from '@fepkg/services/types/common';
import { BondDealStatus, LiquidationSpeedTag } from '@fepkg/services/types/enum';
import moment from 'moment';
import { uniqLiquidationList } from '@packages/utils/liq-speed';
import { miscStorage } from '@/localdb/miscStorage';

type IconProps = {
  /** 确认按钮 */
  onConfirm?: () => void;
  spotInfo?: Counterparty;
  beSpotInfo?: Counterparty;
};

type ColorIconResult = {
  node: ReactNode;
  beSpotNode: ReactNode;
  needHighLightBeSpotName?: boolean;
};

const confirmIcon = <IconCheckCircleFilled className="text-primary-100" />;
const partConfirmIcon = <IconPartialConfirmation className="text-purple-100" />;
const refuseIcon = <IconMinusCircleFilled className="text-danger-100" />;
const toBeConfirmIcon = <IconTimeFilled className="text-orange-100" />;
const askingIcon = <IconHelpFilled className="text-yellow-100" />;

// 该状态下(被)点价方icon状态一致
const commonNode = {
  [BondDealStatus.DealConfirmed]: confirmIcon,
  [BondDealStatus.DealPartConfirmed]: partConfirmIcon,
  [BondDealStatus.DealRefuse]: refuseIcon,
  [BondDealStatus.DealConfirming]: toBeConfirmIcon,
  [BondDealStatus.DealAsking]: askingIcon
};

/**
 * 输入点价方和被点价方的信息，通过判断我是否为点价方，返回点价方和被点价方姓名背景色和状态icon
 */
export const getColorIcon = ({ spotInfo, beSpotInfo, onConfirm }: IconProps) => {
  const { userInfo } = miscStorage;
  // 点价方确认状态
  const confirm_status = spotInfo?.confirm_status ?? BondDealStatus.DealConfirmed;
  // 被点价方确认状态
  const be_confirm_status = beSpotInfo?.confirm_status ?? BondDealStatus.DealConfirmed;
  /** 我是点价方并且不是被点价方 */
  const isMyPrice =
    userInfo?.user_id === spotInfo?.broker?.user_id && userInfo?.user_id !== beSpotInfo?.broker?.user_id;
  /** 我是被点价方并且不是点价方 */
  const notMyPrice =
    userInfo?.user_id !== spotInfo?.broker?.user_id && userInfo?.user_id === beSpotInfo?.broker?.user_id;
  /** 双方都是我 */
  const allMyPrice =
    userInfo?.user_id === spotInfo?.broker?.user_id && userInfo?.user_id === beSpotInfo?.broker?.user_id;
  /** 双方都不是我 */
  const noMyPrice =
    userInfo?.user_id !== spotInfo?.broker?.user_id && userInfo?.user_id !== beSpotInfo?.broker?.user_id;

  // 我方状态姓名对应的图标
  const myNode = {
    ...commonNode,
    [BondDealStatus.DealConfirming]: (
      <Button
        className="h-6 px-2"
        type="orange"
        ghost
        onClick={onConfirm}
      >
        确认
      </Button>
    ) // 我方待确认，状态icon为快捷确认按钮
  };

  let result: ColorIconResult = {
    node: null,
    beSpotNode: null
  };

  const hideSpotterIcon = [
    BondDealStatus.DealConfirming,
    BondDealStatus.DealRefuse,
    BondDealStatus.DealAsking
  ].includes(be_confirm_status);

  // 如果双方都是我
  if (allMyPrice)
    result = {
      // 我点价，对方待确认我不用展示展示icon，这种情况下对方一定是部分确认
      node: hideSpotterIcon ? null : myNode[confirm_status],
      // 我是待确认时，不需要展示快速确认按钮，这里的状态可以用对手方的代替
      beSpotNode: commonNode[be_confirm_status],
      needHighLightBeSpotName:
        be_confirm_status === BondDealStatus.DealConfirming || be_confirm_status === BondDealStatus.DealAsking
    };
  // 我是点价方
  if (isMyPrice)
    result = {
      // 我点价，对方待确认我不用展示展示icon，这种情况下对方一定是部分确认
      node: hideSpotterIcon ? null : myNode[confirm_status],
      beSpotNode: commonNode[be_confirm_status]
    };
  // 点价方和被点价方都不是我
  if (noMyPrice)
    result = {
      node: hideSpotterIcon ? null : commonNode[confirm_status],
      beSpotNode: commonNode[be_confirm_status]
    };
  // 我是被点价方
  if (notMyPrice)
    result = {
      // 我被点价，待我确认，对方不用展示icon
      node: hideSpotterIcon ? null : commonNode[confirm_status],
      beSpotNode: commonNode[be_confirm_status],
      needHighLightBeSpotName:
        be_confirm_status === BondDealStatus.DealConfirming || be_confirm_status === BondDealStatus.DealAsking
    };
  return result;
};
