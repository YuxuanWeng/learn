/* eslint-disable no-nested-ternary */
import cx from 'classnames';
import { Counterparty } from '@fepkg/services/types/common';
import { DealType } from '@fepkg/services/types/enum';
import { DealTypeRender } from '@/components/IDCHistory/DealTypeRender';
import { miscStorage } from '@/localdb/miscStorage';
import UserInfo from './UserInfo';

interface IProps {
  isOffline?: boolean;
  dealType: DealType;
  isNoVolumn?: boolean;
  spotTradeInfo?: Counterparty;
  quoteTradeInfo?: Counterparty;
}

export default function UserLine({
  isOffline = false,
  dealType,
  isNoVolumn = false,
  spotTradeInfo,
  quoteTradeInfo
}: IProps) {
  return (
    <div className={cx('flex items-center')}>
      <UserInfo
        className="flex-1"
        isNoVolume={isNoVolumn}
        isSelf={spotTradeInfo?.broker?.user_id === miscStorage.userInfo?.user_id}
        tradeInfo={spotTradeInfo}
      />
      {!isNoVolumn && (
        <>
          <DealTypeRender type={isOffline ? undefined : dealType} />
          <UserInfo
            className="flex-1"
            isSelf={quoteTradeInfo?.broker?.user_id === miscStorage.userInfo?.user_id}
            tradeInfo={quoteTradeInfo}
            isAlignRight
          />
        </>
      )}
    </div>
  );
}
