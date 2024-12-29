import { useContext, useEffect, useMemo } from 'react';
import { useLocalStorage } from '@fepkg/business/hooks/useLocalStorage';
import { usePrevious } from '@dnd-kit/utilities';
import { LSKeys, getLSKeyWithoutProductType } from '@/common/constants/ls-keys';
import { DialogContext } from '@/layouts/Dialog/Layout';
import { SharedCards } from '../types';
import { ParseContainer } from './ParseContainer';

const IQuoteFloatCard = () => {
  const context = useContext<{ roomId: string }>(DialogContext);

  const roomId = context?.roomId;

  const key = getLSKeyWithoutProductType(LSKeys.IQuoteRawCards);

  const [data] = useLocalStorage<SharedCards>(key, []);

  const currentRoom = useMemo(() => {
    return data.find(r => r.room_id === roomId);
  }, [data, roomId]);

  const prevRoom = usePrevious(currentRoom);

  useEffect(() => {
    if (currentRoom == null && prevRoom != null) {
      window.Main.close();
    }
  }, [currentRoom, prevRoom]);

  if (currentRoom == null || roomId == null) {
    return <div />;
  }

  return (
    <ParseContainer
      isFloating
      room={currentRoom}
    />
  );
};

export default IQuoteFloatCard;
