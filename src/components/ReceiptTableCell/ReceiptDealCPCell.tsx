import cx from 'classnames';
import { IconBridgeText, IconPayfor } from '@fepkg/icon-park-react';

type ReceiptDealCPCellProp = {
  flagInBridgeInstList?: boolean;
  flagBridge?: boolean;
  content: string;
  disabledStyle?: boolean;
  flagPayForInst?: boolean;
};

const colorMap = {
  // 第一层为disable，第二层为flagInBridgeInstList
  // disabled = false
  0: { 0: 'bg-orange-100 text-gray-000', 1: 'bg-purple-100 text-gray-000' },

  // disabled = true
  1: { 0: 'bg-orange-400 text-gray-300', 1: 'bg-purple-400 text-gray-300' }
};

export const ReceiptDealCPCell = ({
  flagInBridgeInstList = false,
  flagBridge,
  content,
  disabledStyle = false,
  flagPayForInst
}: ReceiptDealCPCellProp) => {
  return (
    <>
      {flagBridge && !flagPayForInst && (
        <IconBridgeText
          className={cx('mr-2 rounded', colorMap[Number(disabledStyle)][Number(flagInBridgeInstList)])}
          size={16}
        />
      )}
      {flagPayForInst && (
        <IconPayfor
          className="mr-2 rounded bg-danger-100 text-gray-000"
          size={16}
        />
      )}

      <span>{content}</span>
    </>
  );
};
