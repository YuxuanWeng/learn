import { HTMLProps, MouseEvent, RefObject } from 'react';
import cx from 'classnames';
import { formatDate } from '@fepkg/common/utils/date';
import { BadgeV2 } from '@fepkg/components/BadgeV2';
import { Button } from '@fepkg/components/Button';
import { IconDelete, IconNotification } from '@fepkg/icon-park-react';
import moment from 'moment';
import { rendererIconCls, rendererLayoutCls } from '../constants';
import { MessageRendererProps } from '../types';

export const Compat = ({ className, message, onDelete, onClick, ...restProps }: MessageRendererProps) => {
  const { create_time = Date.now(), flag_read } = message ?? {};

  const createTimeFormat = moment(Number(create_time)).isBefore(moment(), 'day') ? 'MM-DD HH:mm:ss' : 'HH:mm:ss';
  const createTime = formatDate(create_time, createTimeFormat);

  return (
    <div
      className={cx('grid-cols-[32px_minmax(0,1fr)] grid-rows-[repeat(2,24px)]', rendererLayoutCls, className)}
      onClick={e => {
        onClick?.(e);
      }}
      {...restProps}
    >
      <IconNotification className={rendererIconCls} />

      <div className="flex items-center gap-1">
        <BadgeV2
          dot={!flag_read}
          style={{ top: 6, right: -6 }}
        >
          <span className="text-gray-000 text-sm font-bold">通知</span>
        </BadgeV2>
        <span className="ml-auto text-gray-300 text-xs font-normal">{createTime}</span>
      </div>

      <div className="flex items-center">
        [当前版本不支持查看消息类型，请升级至最新版本]
        <Button.Icon
          className="group-hover:!flex !hidden ml-auto"
          text
          icon={<IconDelete />}
          onClick={e => {
            onDelete?.(e);
            e.stopPropagation();
            e.preventDefault();
          }}
        />
      </div>
    </div>
  );
};
