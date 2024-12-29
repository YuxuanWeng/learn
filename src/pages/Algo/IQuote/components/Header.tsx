import cx from 'classnames';
import { Button } from '@fepkg/components/Button';
import { Input } from '@fepkg/components/Input';
import { IconChat, IconOrderSetup, IconSearch } from '@fepkg/icon-park-react';
import { useChatScript } from '../providers/ChatScriptProvider';
import { useHead } from '../providers/HeadProvider';
import { useRoomCards } from '../providers/RoomCardsProvider';
import { useTraderConfig } from '../providers/TraderConfigContainer';
import { Rooms } from './Rooms';

export const Header = () => {
  const { searchRef } = useHead();
  const { openModal } = useTraderConfig();
  const { setFilterText } = useRoomCards();

  const { open: openChatScriptModal } = useChatScript();

  return (
    <div className="bg-gray-700 border-0 border-b border-solid border-gray-600">
      <div className="h-12 flex items-center px-3 justify-between">
        <div className="flex items-center">
          <Input
            ref={searchRef}
            tabIndex={0}
            className="bg-gray-800 !w-[238px] first:child:w-[86px] !h-7"
            placeholder="交易员姓名/拼音(Ctrl+F)"
            suffixIcon={<IconSearch />}
            onChange={setFilterText}
          />
        </div>
        <div className={cx('flex items-center')}>
          <div className="flex items-center gap-3 h-4 ml-3 mr-1">
            <Button.Icon
              text
              icon={<IconChat size={16} />}
              className="w-6 h-6"
              onClick={openChatScriptModal}
              tooltip={{ content: '设置话术' }}
            />
            <Button.Icon
              text
              className="w-6 h-6"
              icon={<IconOrderSetup size={16} />}
              onClick={openModal}
              tooltip={{ content: '交易员挂单设置' }}
            />
          </div>
        </div>
      </div>
      <Rooms />
    </div>
  );
};
