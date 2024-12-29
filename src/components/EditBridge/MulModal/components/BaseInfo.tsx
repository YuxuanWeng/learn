import { Tooltip } from '@fepkg/components/Tooltip';
import { useMulBridge } from '../provider';

export const BaseInfo = () => {
  const { currentBridgeInfo } = useMulBridge();

  const biller = (currentBridgeInfo?.ofrBillerName ?? '') + (currentBridgeInfo?.ofrBillerTag ?? '') || '--';
  const contactName = currentBridgeInfo?.ofrContactName || '--';
  const contact = currentBridgeInfo?.ofrContact || '-';

  return (
    <div className="flex w-full h-11 items-center justify-around text-xs">
      <div className="flex flex-col gap-1 items-center w-[108px]">
        <Tooltip
          truncate
          content={contactName}
        >
          <span className="truncate w-full px-2 text-center text-gray-000 font-bold">{contactName}</span>
        </Tooltip>

        <span className="text-gray-300">联系人</span>
      </div>

      <div className="border-none w-[2px] bg-gray-600 h-6" />

      <div className="flex flex-col gap-1 items-center w-[108px]">
        <Tooltip
          truncate
          content={contact}
        >
          <span className="truncate w-full px-2 text-center text-gray-000 font-bold">{contact}</span>
        </Tooltip>
        <span className="text-gray-300">联系方式</span>
      </div>

      <div className="border-none w-[2px] bg-gray-600 h-6" />

      <div className="flex flex-col gap-1 items-center w-[108px]">
        <Tooltip
          truncate
          content={biller}
        >
          <span className="text-gray-000 truncate w-full px-2 text-center font-bold">{biller}</span>
        </Tooltip>
        <span className="text-gray-300">计费人</span>
      </div>
    </div>
  );
};
