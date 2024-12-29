import { Tooltip } from '@fepkg/components/Tooltip';
import { Side } from '@fepkg/services/types/bds-enum';
import { useEditBridge } from '../provider';

export const BaseInfo = ({ side }: { side?: Side }) => {
  const { formState } = useEditBridge();
  const bidBillerTag = (formState.bidBillerName ?? '') + (formState.bidBillerTag ?? '');
  const ofrBillerTag = (formState.ofrBillerName ?? '') + (formState.ofrBillerTag ?? '');
  const contactName = side === Side.SideBid ? formState.bidContactName : formState.ofrContactName;

  return (
    <div className="flex w-full h-11 items-center justify-around text-xs">
      <div className="flex flex-col gap-1 items-center w-[108px]">
        <Tooltip
          truncate
          content={contactName || '-'}
        >
          <span className="truncate w-full px-2 text-center text-gray-000 font-bold">{contactName || '-'}</span>
        </Tooltip>

        <span className="text-gray-300">联系人</span>
      </div>

      <div className="border-none w-[2px] bg-gray-600 h-6" />

      <div className="flex flex-col gap-1 items-center w-[108px]">
        <Tooltip
          truncate
          content={side === Side.SideBid ? formState.bidContact || '-' : formState.ofrContact || '-'}
        >
          <span className="truncate w-full px-2 text-center text-gray-000 font-bold">
            {side === Side.SideBid ? formState.bidContact || '-' : formState.ofrContact || '-'}
          </span>
        </Tooltip>
        <span className="text-gray-300">联系方式</span>
      </div>

      <div className="border-none w-[2px] bg-gray-600 h-6" />

      <div className="flex flex-col gap-1 items-center w-[108px]">
        <Tooltip
          truncate
          content={side === Side.SideBid ? bidBillerTag || '-' : ofrBillerTag || '-'}
        >
          <span className="text-gray-000 truncate w-full px-2 text-center font-bold">
            {side === Side.SideBid ? bidBillerTag || '-' : ofrBillerTag || '-'}
          </span>
        </Tooltip>
        <span className="text-gray-300">计费人</span>
      </div>
    </div>
  );
};
