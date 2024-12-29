import cx from 'classnames';
import { DialogEvent } from 'app/types/IPCEvents';
import { useRoomCards } from '../providers/RoomCardsProvider';
import { RoomWithCards } from '../types';
import styles from './index.module.less';

type RoomProps = { value: RoomWithCards; onClick?: (roomId: string) => void };

const Room = ({ value, onClick }: RoomProps) => {
  const { visibleRoomIds } = useRoomCards();
  const { getRoomExpand } = useRoomCards();

  return (
    <div
      className={cx(
        'w-[78px] h-18 px-[5px] text-white flex-center flex-col flex-shrink-0 rounded-lg cursor-pointer',
        styles['trader-room']
      )}
      onClick={() => onClick?.(value.room_id)}
    >
      <div className="w-8 h-8 relative">
        {value.cards.length !== 0 && (
          <>
            <div className="absolute -top-1 -right-1.5 w-[14px] h-[14px] border border-solid border-white rounded bg-danger-100 text-white flex-center text-[8px] z-10">
              {value.cards.length}
            </div>
            {!(visibleRoomIds.has(value.room_id) && getRoomExpand(value.room_id)) && value.unread && (
              <div className="absolute -top-1 -right-1.5 w-[14px] h-[14px] border border-solid border-white rounded bg-danger-100 text-white flex-center text-[8px] animate-ping" />
            )}
          </>
        )}
        <img
          alt={value.trader_name}
          src={value.trader_avatar}
          className="w-8 h-8 rounded-full"
        />
      </div>
      <div className="mt-1 text-xs text-center truncate max-w-full text-gray-100">{value.trader_name}</div>
    </div>
  );
};

export const Rooms = () => {
  const { headerRooms, lastInitElement, displayRooms, setRoomExpand } = useRoomCards();

  if (!headerRooms?.length) {
    return <div />;
  }

  return (
    <>
      <div className="component-dashed-x-600 h-px" />
      <div className="relative h-18">
        <div
          className={cx(
            styles.horizontal_scroll,
            'flex flex-col items-center gap-x-2 overflow-y-overlay overflow-x-hidden w-18 mt-18',
            'absolute left-0 top-0 h-[100vw]'
          )}
        >
          {headerRooms?.map(r => (
            <Room
              value={r}
              onClick={() => {
                const targetIndex = displayRooms.findIndex(i => i.room_id === r.room_id);

                if (targetIndex !== -1) {
                  lastInitElement.current?.children[targetIndex].scrollIntoView();
                  setRoomExpand(r.room_id, true);
                } else {
                  window.Main.sendMessage(DialogEvent.IQuoteCardFocus, r.room_id);
                }
              }}
              key={r.room_id}
            />
          ))}
        </div>
      </div>
    </>
  );
};
