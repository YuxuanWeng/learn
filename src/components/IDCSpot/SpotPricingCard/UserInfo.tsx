import { HTMLProps } from 'react';
import cx from 'classnames';
import { getCP } from '@fepkg/business/utils/get-name';
import { Tooltip } from '@fepkg/components/Tooltip';
import { Counterparty } from '@fepkg/services/types/common';
import { useProductParams } from '@/layouts/Home/hooks';
import { sendMsgToTraderByFE } from './IMMsgLine';

interface IUser {
  tradeInfo?: Counterparty;
  isSelf: boolean;
  isNoVolume?: boolean;
  isAlignRight?: boolean;
}
type IDom = Omit<HTMLProps<HTMLDivElement>, keyof IUser>;

export default function UserInfo({
  tradeInfo,
  isSelf,
  isNoVolume = false,
  isAlignRight = false,
  ...rest
}: IUser & IDom) {
  const { productType } = useProductParams();
  const cp = getCP({ trader: tradeInfo?.trader, inst: tradeInfo?.inst, productType });

  return (
    <div
      {...rest}
      className={cx(
        'overflow-hidden',
        rest?.className,
        isAlignRight && 'flex flex-col items-end text-right',
        isNoVolume && 'flex'
      )}
    >
      {cp && tradeInfo?.trader?.trader_id ? (
        <Tooltip
          truncate
          content={<div className="max-w-[100vw] whitespace-pre-wrap">{cp}</div>}
        >
          <div
            onDoubleClick={() => {
              if (tradeInfo?.trader?.trader_id != null && isSelf) {
                sendMsgToTraderByFE(tradeInfo.trader.trader_id);
              }
            }}
            className={cx('text-white pt-2 text-sm truncate', isNoVolume ? 'flex-1' : 'w-[158px]')}
          >
            {cp}
          </div>
        </Tooltip>
      ) : (
        <p className={cx('text-gray-200 pt-2 text-sm', isNoVolume && 'flex-1')}>机构待定</p>
      )}
      <Tooltip
        truncate
        content={tradeInfo?.broker?.name_cn}
      >
        <div
          className={cx(
            isSelf && 'border border-solid border-primary-100 px-2 inline-block text-primary-100 rounded-lg',
            'mt-1 text-sm h-6 max-w-[120px] truncate',
            isNoVolume && 'mt-1.5'
          )}
        >
          {tradeInfo?.broker?.name_cn}
        </div>
      </Tooltip>
    </div>
  );
}
