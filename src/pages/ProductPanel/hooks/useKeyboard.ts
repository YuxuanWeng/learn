import { useMemoizedFn } from 'ahooks';
import { useEventListener } from 'usehooks-ts';

type Props = {
  onEscDown?: (e: KeyboardEvent) => void;
  onTabDown?: (e: KeyboardEvent) => void;
  onFDown?: (e: KeyboardEvent) => void;
  onEnterDown?: ((e: KeyboardEvent) => Promise<void>) | (() => void);
};

export const useKeyboard = ({ onEscDown, onTabDown, onFDown, onEnterDown }: Props) => {
  const handleKeyDown = useMemoizedFn(async (e: KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        onEscDown?.(e);
        break;
      case 'Tab':
        onTabDown?.(e);
        break;
      case 'f':
        onFDown?.(e);
        break;
      case 'Enter':
        await onEnterDown?.(e);
        break;
      default:
        break;
    }
  });
  useEventListener('keydown', handleKeyDown);
};
