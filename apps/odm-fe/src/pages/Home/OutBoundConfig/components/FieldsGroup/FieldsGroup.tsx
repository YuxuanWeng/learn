import { Caption } from '@fepkg/components/Caption';
import { Switch } from '@fepkg/components/Switch';
import { ColumnFieldMap } from '@/common/constants/column-fields-map';
import { FieldsItem } from './FieldsItem';
import { FieldsGroupProps } from './types';

export const FieldsGroup = (props: FieldsGroupProps) => {
  const { title, anchorId, data = [], captionProps, switchEnabled, switchProps, ...rest } = props;

  return (
    <div
      className="w-full border-0 border-b border-solid border-b-gray-600 px-4 pb-7 mb-4 last-of-type:mb-0 last-of-type:border-0 last-of-type:pb-0"
      id={anchorId}
    >
      <div className="flex w-full items-center justify-between h-12">
        <Caption {...captionProps}>{title}</Caption>
        {switchEnabled && (
          <div className="flex-center gap-3 py-1 px-3 rounded-lg bg-gray-700 mx-6">
            <span className="text-gray-200 font-medium text-sm">行情推送开关：</span>
            <Switch {...switchProps} />
          </div>
        )}
      </div>
      <div className="grid grid-cols-4 gap-x-6 gap-y-4 px-6">
        {data.map(i => {
          const item = ColumnFieldMap[i];
          return (
            <FieldsItem
              key={item.id}
              item={item}
              {...rest}
            />
          );
        })}
      </div>
    </div>
  );
};
