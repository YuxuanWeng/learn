import { Caption } from '@fepkg/components/Caption';
import { Checkbox } from '@fepkg/components/Checkbox';
import { BaseExportTemplateOptions, BidExportTemplateOptions, OfrExportTemplateOptions } from '../constants';
import { useTemplateModal } from './TemplateModalProvider';

const optionsMap = [
  { key: 'base', order: 'order-2', options: BaseExportTemplateOptions },
  { key: 'bid', order: 'order-5', options: BidExportTemplateOptions },
  { key: 'ofr', order: 'order-8', options: OfrExportTemplateOptions }
];

export const Content = () => {
  const { mdlState, updateMdlState } = useTemplateModal();

  return (
    <div className="flex-1 flex flex-col gap-3 -mr-3 overflow-scroll">
      <Caption className="order-1">基本信息</Caption>

      {optionsMap.map(item => (
        <div
          key={item.key}
          className={`grid grid-cols-3 gap-x-3 gap-y-3 pl-6 ${item.order}`}
        >
          {item.options.map(opt => (
            <Checkbox
              className="!justify-start"
              disabled={!mdlState.editing}
              key={opt.value}
              value={opt.value}
              checked={mdlState.updated?.[opt.value]}
              onChange={val => {
                updateMdlState(draft => {
                  if (draft.updated) draft.updated[opt.value] = val;
                });
              }}
            >
              {opt.label}
            </Checkbox>
          ))}
        </div>
      ))}

      <div className="component-dashed-x h-px order-3" />

      <Caption
        type="orange"
        className="order-4"
      >
        Bid方信息
      </Caption>

      <div className="component-dashed-x h-px order-6" />

      <Caption
        type="secondary"
        className="order-7"
      >
        Ofr方信息
      </Caption>
    </div>
  );
};
