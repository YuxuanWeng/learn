import { useState } from 'react';
import { createContainer } from 'unstated-next';
import { CommentInputValue } from '@/components/business/CommentInput';

type InitialState = {
  defaultValue: CommentInputValue;
};

const CalcFooterContainer = createContainer((initialState?: InitialState) => {
  const [footerValue, setFooterValue] = useState(initialState?.defaultValue ?? { comment: '' });
  return { footerValue, setFooterValue };
});

export const CalcFooterProvider = CalcFooterContainer.Provider;
export const useCalcFooter = CalcFooterContainer.useContainer;
