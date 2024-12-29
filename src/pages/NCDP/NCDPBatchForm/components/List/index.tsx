import { useNCDPBatchForm } from '../../providers/FormProvider';
import { Header } from './Header';
import { Item } from './Item';

export const List = () => {
  const { isEdit, isBatch, defaultIssuerDateType, formList, updateFormList } = useNCDPBatchForm();

  return (
    <div className="flex flex-col flex-1 mt-3 bg-gray-800 border border-solid border-gray-600 rounded-lg">
      <Header />

      <div className="component-dashed-x h-px mx-3" />

      <div className="flex flex-col flex-1 gap-2 max-h-[368px] py-2 overflow-y-overlay">
        {formList.map((item, idx) => (
          <Item
            key={item.key}
            index={idx}
            showIndex={isBatch}
            showDelete={!isEdit}
            defaultIssuerDateType={defaultIssuerDateType}
            value={item}
            onUpdate={updateFormList}
          />
        ))}
      </div>
    </div>
  );
};
