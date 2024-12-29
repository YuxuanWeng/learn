import { IconText } from '@fepkg/icon-park-react';
import { Options } from './Options';
import { QuotationGroupProps } from './types';

export const ConfigAside = (props: QuotationGroupProps) => {
  const { activeKey, options, onClick, onChange, anchorId } = props;

  return (
    <div
      className="px-2 flex-shrink-0 w-44 flex flex-col bg-gray-600 rounded-l-lg"
      onContextMenu={evt => {
        evt.preventDefault();
      }}
    >
      <div className="flex-center h-14 gap-1">
        <IconText
          theme="two-tone"
          size={20}
        />
        <span className="text-gray-000 text-md">推送字段</span>
      </div>
      <div className="component-dashed-x" />
      <Options
        anchorId={anchorId}
        data={options}
        activeKey={activeKey}
        onClick={onClick}
        onChange={onChange}
      />
    </div>
  );
};
