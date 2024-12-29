import { getInstName } from '@fepkg/business/utils/get-name';
import { Button } from '@fepkg/components/Button';
import { ButtonType } from '@fepkg/components/Button/types';
import { Tooltip } from '@fepkg/components/Tooltip';
import { IconLeft, IconRight } from '@fepkg/icon-park-react';
import { useProductParams } from '@/layouts/Home/hooks';
import { useMulBridge } from '../provider';

const baseButtonProps = {
  type: 'gray' as ButtonType,
  plain: true
};

export const SwitchBridge = () => {
  const { bridgeIndex, currentBridgeInfo, formState, prev, next } = useMulBridge();
  const { productType } = useProductParams();

  const bridgeDisplay = `${getInstName({ inst: currentBridgeInfo?.inst, productType }) || '--'}(${
    currentBridgeInfo?.trader?.name_zh || '--'
  })`;

  return (
    <div className="h-8 flex items-center justify-between w-[360px] bg-gray-750 px-2 rounded-lg border-solid border border-gray-600">
      <Button
        {...baseButtonProps}
        className="h-6 w-18 !px-[6.5px]"
        disabled={bridgeIndex === 0}
        icon={<IconLeft />}
        onClick={prev}
      >
        上一桥
      </Button>

      <Tooltip
        truncate
        content={bridgeDisplay}
      >
        <span className="max-w-[176px] truncate text-gray-000 font-bold">{bridgeDisplay}</span>
      </Tooltip>

      <Button
        {...baseButtonProps}
        disabled={bridgeIndex === (formState?.length ?? 0) - 2}
        className="h-6 w-18 !px-[6.5px] flex-row-reverse"
        icon={<IconRight />}
        onClick={next}
      >
        下一桥
      </Button>
    </div>
  );
};
