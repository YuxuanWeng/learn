import { BatchModal } from './BatchModal';
import { BatchModalInitialState, EditModalProps } from './types';

export const Batch = (props: EditModalProps & BatchModalInitialState) => {
  return <BatchModal {...props} />;
};
