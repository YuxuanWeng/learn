import { Item } from '../Item';
import { useGroupSetting } from '../providers';

export const Body = () => {
  const { groups, setSelectedGroupId, handleDeleteGroup, panelBrokerGroupId, selectedGroupId } = useGroupSetting();

  return groups.map(v => {
    const isSelected = v.id === (selectedGroupId ?? panelBrokerGroupId);
    return (
      <Item
        className="mb-2 last-of-type:mb-0"
        canDelete={groups.length > 1}
        key={v.id}
        id={v.id}
        value={v.name}
        isSelected={isSelected}
        onClick={setSelectedGroupId}
        onDelete={handleDeleteGroup}
      />
    );
  });
};
