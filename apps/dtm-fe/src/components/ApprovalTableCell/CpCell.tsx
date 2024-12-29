import { Tooltip } from '@fepkg/components/Tooltip';
import { IconPayfor } from '@fepkg/icon-park-react';

type Props = {
  cpContent: string;
  flagPayForInst?: boolean;
};

export const CpCell = ({ cpContent, flagPayForInst }: Props) => {
  return (
    <Tooltip
      truncate
      content={cpContent}
    >
      <div className="truncate-clip flex items-center gap-x-2">
        {flagPayForInst && <IconPayfor className="rounded bg-danger-100 text-gray-000" />}
        <span>{cpContent}</span>
      </div>
    </Tooltip>
  );
};
