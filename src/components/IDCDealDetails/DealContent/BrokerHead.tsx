import { useMemo } from 'react';
import cx from 'classnames';
import { Button } from '@fepkg/components/Button';
import { IconDownDouble, IconUpDouble } from '@fepkg/icon-park-react';
import { useFilter } from '@/components/IDCDealDetails/SearchFilter/providers/FilterStateProvider';
import { miscStorage } from '@/localdb/miscStorage';
import { DealContainerData } from '../type';

type OtherTitleProps = { data: DealContainerData };

export const BrokerHead = ({ data }: OtherTitleProps) => {
  const { openBrokers, contentList, updateOpenBrokers } = useFilter();
  const currentGroup = contentList.find(v => v.broker.user_id === data.broker.user_id);

  const openBrokerPart = (open: boolean) => {
    updateOpenBrokers(oldBrokers => {
      const targetItem = oldBrokers.find(item => item.userId === data.broker.user_id);
      if (targetItem) targetItem.isOpen = open;
      else {
        oldBrokers.push({ userId: data.broker.user_id, isOpen: open });
      }
    });
  };

  const isOpen = useMemo(
    () => !!openBrokers?.find(item => item.userId === data.broker.user_id)?.isOpen,
    [openBrokers, data.broker.user_id]
  );

  const current = openBrokers.find(item => item.userId === data.broker.user_id);
  return (
    // 用items-end来代替mt，避免边距过高导致底部边框被遮挡
    <div className="h-full bg-gray-800 text-sm font-bold flex items-end justify-center relative">
      <div
        className={cx(
          'h-11 w-full flex items-center bg-gray-500',
          'border border-solid border-gray-500',
          // 如果展开当前组，则不需要下边框，下边框颜色设置为背景色，否则会因为边框从有到无导致标题轻微抖动
          current?.isOpen && currentGroup?.groups.length ? 'rounded-t-lg border-b-gray-600' : 'rounded-lg'
        )}
        style={{ background: 'linear-gradient(180deg, #25262B 0%, #33343C 100%)' }}
      >
        <span className="text-gray-000 text-md font-bold pl-3">{data.broker.name_cn}</span>

        {data.broker.user_id === miscStorage.userInfo?.user_id && (
          <span className="text-primary-200 ml-1">- 本人成交</span>
        )}

        {isOpen && (
          <Button.Icon
            text
            icon={<IconUpDouble className="text-gray-100" />}
            className="ml-2"
            onClick={() => openBrokerPart(false)}
          />
        )}
        {!isOpen && (
          <Button.Icon
            text
            icon={<IconDownDouble className="text-gray-100" />}
            className="ml-2"
            onClick={() => openBrokerPart(true)}
          />
        )}
      </div>
    </div>
  );
};
