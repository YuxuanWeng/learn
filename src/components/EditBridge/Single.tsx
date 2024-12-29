import { MemoSingleModal } from './SingleModal';
import { EditModalProps, SingleModalInitialStateV2 } from './types';

export const Single = (props: EditModalProps & SingleModalInitialStateV2) => {
  return <MemoSingleModal {...props} />;
};
