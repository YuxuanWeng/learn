import { Item } from '@/pages/Deal/Detail/components/HoverItem';
import { usePanelGroupConfig } from './provider';

export const GroupBody = () => {
  const { groups, selected, setSelected, deleteGroup } = usePanelGroupConfig();

  return (
    <div className="flex flex-col gap-2 overflow-y-overlay mt-2 pr-3 mb-2">
      {groups.map(v => {
        const key = v.groupId;
        return (
          <Item
            showWarn
            key={key}
            value={key}
            selected={v.groupId === selected}
            name={v.groupName}
            onClick={setSelected}
            onDelete={deleteGroup}
          />
        );
      })}
    </div>
  );
};
