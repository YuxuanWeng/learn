import { useRef } from 'react';
import { createContainer } from 'unstated-next';

export const TransferContainer = createContainer(() => {
  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);

  return { leftRef, rightRef };
});

export const TransferProvider = TransferContainer.Provider;
export const useTransferState = TransferContainer.useContainer;
