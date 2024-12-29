import cx from 'classnames';
import { Tooltip } from '@fepkg/components/Tooltip';
import { IconPassSubmit, IconPrinter } from '@fepkg/icon-park-react';
import { ReceiptDealStatus } from '@fepkg/services/types/enum';
import { UrgeReceiptDealStatusSet, receiptDealStatusOptions } from './constants';

type ReceiptDealStatusCellProps = {
  status: ReceiptDealStatus;
  flagHistoryPass?: boolean;
  flagPrinted?: boolean;
  flagUrge?: boolean;
  urgeText?: string;
};
export const ReceiptDealStatusCell = ({
  status,
  flagHistoryPass,
  flagPrinted,
  flagUrge,
  urgeText = '请尽快提交'
}: ReceiptDealStatusCellProps) => {
  const option = receiptDealStatusOptions.find(o => o.value === status);
  const isUrge = flagUrge && UrgeReceiptDealStatusSet.has(status);

  return (
    <>
      {(flagPrinted || flagHistoryPass) && (
        <div className="absolute left-2.5 flex gap-x-2 text-green-100 z-40">
          {flagPrinted ? (
            <Tooltip content="已打印成交单">
              <IconPrinter className="hover:text-green-000" />
            </Tooltip>
          ) : (
            <div className="w-4" />
          )}
          {flagHistoryPass && (
            <Tooltip content="通过后回退成交单">
              <IconPassSubmit className="hover:text-green-000" />
            </Tooltip>
          )}
        </div>
      )}
      <Tooltip content={isUrge ? urgeText : void 0}>
        <div
          className={cx(
            option?.className,
            isUrge && 'bg-orange-700 rounded-lg h-6 w-22 flex items-center justify-center'
          )}
        >
          {option?.label}
        </div>
      </Tooltip>
    </>
  );
};
