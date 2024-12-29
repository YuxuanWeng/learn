import { getInstName } from '@fepkg/business/utils/get-name';
import { Placeholder } from '@fepkg/components/Placeholder';
import { useProductParams } from '@/layouts/Home/hooks';
import { Item } from '../HoverItem';
import { useAgency } from './provider';

const Options = () => {
  const { productType } = useProductParams();
  const { agencyOptions, selectId, instMapRef, deleteInst, handleSelectInstId } = useAgency();

  return (
    <div className="mt-2">
      {agencyOptions?.length ? (
        <div className="flex flex-col gap-2 h-[272px] overflow-y-overlay">
          {agencyOptions?.map(v => {
            const name = getInstName({
              inst: { short_name_zh: v.short_name, biz_short_name_list: v.product_short_name_set },
              productType
            });
            const selected = v.inst_id === selectId;
            return (
              <Item
                ref={node => {
                  if (node == null || instMapRef.current == null) return;
                  instMapRef.current[v.inst_id] = node;
                }}
                key={v.inst_id}
                value={v.inst_id}
                name={name}
                onClick={handleSelectInstId}
                onDelete={deleteInst}
                selected={selected}
              />
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col h-full justify-center">
          <Placeholder type="no-setting" />
        </div>
      )}
    </div>
  );
};

export default Options;
