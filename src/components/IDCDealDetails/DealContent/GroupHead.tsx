import { useFilter } from '../SearchFilter/providers/FilterStateProvider';
import { DealContainerData } from '../type';
import { DealGroupHead } from './DealGroupHead';

type GroupHeadProps = { data: DealContainerData };

export const GroupHead = ({ data }: GroupHeadProps) => {
  const { getPreferenceValue, onChangePreference } = useFilter();

  return (
    <DealGroupHead
      data={data}
      showConfig={getPreferenceValue(data.groupId)}
      onChangePreference={(groupId, value) => onChangePreference(groupId, value)}
    />
  );
};
