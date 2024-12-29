import { Tooltip } from '@fepkg/components/Tooltip';
import { TypeColumnFields } from '@/common/constants/column-fields-map';

type Props = {
  tag: TypeColumnFields;
};

const HeadCell = ({ tag }: Props) => {
  const { name_cn: desc, name_en: field } = tag;
  return (
    <div className="flex flex-col gap-x-[3px]">
      <Tooltip
        truncate
        content={desc}
      >
        <div className="text-sm font-medium text-gray-200 truncate">{desc}</div>
      </Tooltip>
      <Tooltip
        truncate
        content={field}
      >
        <div className="text-xs font-normal text-gray-300 truncate h-4">{field}</div>
      </Tooltip>
    </div>
  );
};
export default HeadCell;
