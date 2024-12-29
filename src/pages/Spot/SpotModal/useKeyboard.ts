import { KeyboardEvent, useCallback } from 'react';
import { trackPoint } from '@/common/utils/logger/point';

interface IParams {
  handleSubmit?: () => Promise<void>;
}

export default function useKeyboard({ handleSubmit }: IParams) {
  const onDialogKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      switch (e.key) {
        case 'Enter':
          e.stopPropagation();
          trackPoint('keyboard-enter');
          handleSubmit?.();
          break;
        default:
          break;
      }
    },
    [handleSubmit]
  );

  return {
    onDialogKeyDown
  };
}
