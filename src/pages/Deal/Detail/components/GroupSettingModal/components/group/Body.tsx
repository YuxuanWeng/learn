import { Item } from '../../../HoverItem';
import { useGroupConfig } from '../../provider';

export const Body = () => {
  const { groups, selected, setSelected, deleteGroup } = useGroupConfig();

  return groups.map(v => {
    const key = v.group_combination_id;
    return (
      <Item
        className="mb-2 last-of-type:mb-0"
        showWarn
        key={key}
        value={key}
        selected={v.group_combination_id === selected}
        name={v.group_combination_name}
        onClick={setSelected}
        onDelete={deleteGroup}
      />
    );
  });
};
