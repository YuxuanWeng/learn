import cx from 'classnames';
import { IconAttentionFilled } from '@fepkg/icon-park-react';
import { DealQuote } from '@fepkg/services/types/common';
import { SpotPrice } from '@/components/IDCBoard/Price';

interface IProps {
  deal: Partial<DealQuote>;
}

export default function DealCheckConfirm({ deal }: IProps) {
  return (
    <>
      <header className={cx('flex items-center justify-center', 'mt-[-40px] mx-3', 'h-[66px]')}>
        <SpotPrice
          quote={deal}
          className="justify-center"
        />
      </header>

      <div className="component-dashed-x mb-4" />

      <label className="flex justify-center items-center text-gray-200 mt-4 mb-[-8px]">
        <IconAttentionFilled className="pointer-events-none mr-2 text-orange-100" />
        请确认价格！
      </label>
    </>
  );
}
