import { createContainer } from 'unstated-next';
import { QuoteBatchFormProps } from '../types';

const QuoteBatchFormContainer = createContainer((initialState?: QuoteBatchFormProps) => {
  return { ...initialState };
});

export const QuoteBatchFormProvider = QuoteBatchFormContainer.Provider;
export const useQuoteBatchForm = QuoteBatchFormContainer.useContainer;
