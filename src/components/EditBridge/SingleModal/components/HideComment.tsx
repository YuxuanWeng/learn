import { Side } from '@fepkg/services/types/bds-enum';
import { HideComment as CheckComment } from '../../Components';
import { useEditBridge } from '../provider';

export const HideComment = ({ side }: { side: Side }) => {
  const { formState, updateFormState } = useEditBridge();
  const filed = side === Side.SideBid ? 'bidHideComment' : 'ofrHideComment';
  return (
    <CheckComment
      isChecked={!!formState[filed]}
      onChange={val => updateFormState(filed, val)}
    />
  );
};
