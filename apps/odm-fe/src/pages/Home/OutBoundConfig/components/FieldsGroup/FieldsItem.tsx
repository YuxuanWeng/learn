import { Checkbox } from '@fepkg/components/Checkbox';
import { Tooltip } from '@fepkg/components/Tooltip';
import { FieldsItemProps } from './types';

export const FieldsItem = (props: FieldsItemProps) => {
  const { disabled, enabledFields = [], onFieldChange, configEnabled, item } = props;
  return (
    <div className="flex items-center justify-between py-2 px-3 h-14 rounded-lg border border-solid border-gray-600">
      <div className="flex flex-col gap-0.5 w-[calc(100%_-_14px)]">
        <Tooltip
          truncate
          content={item.name_cn}
        >
          <span className="font-medium text-gray-200 text-sm truncate">{item.name_cn}</span>
        </Tooltip>
        <Tooltip
          truncate
          content={item.name_en}
        >
          <span className="font-normal text-gray-300 text-xs truncate">{item.name_en}</span>
        </Tooltip>
      </div>
      {configEnabled && (
        <Checkbox
          checked={enabledFields?.includes(item.id)}
          onChange={val => onFieldChange?.(val, item.id)}
          disabled={disabled}
        />
      )}
    </div>
  );
};
