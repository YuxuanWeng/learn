import { NoneModal } from './NoneModal';
import { EditModalProps, NoneModalInitialState } from './types';

export const None = (props: EditModalProps & NoneModalInitialState) => {
  return <NoneModal {...props} />;
};
