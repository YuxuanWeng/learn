import cx from 'classnames';
import { formatDate } from '@fepkg/common/utils/date';
import { BadgeV2 } from '@fepkg/components/BadgeV2';
import { Button } from '@fepkg/components/Button';
import { Tooltip } from '@fepkg/components/Tooltip';
import { IconDelete, IconReminderFilled, IconRightArrow } from '@fepkg/icon-park-react';
import { ProductType } from '@fepkg/services/types/enum';
import moment from 'moment';
import { rendererIconCls, rendererLayoutCls } from '../constants';
import { MessageRendererProps } from '../types';

const ProductTagMap = {
  [ProductType.BNC]: { label: '利率', cls: 'text-primary-100 bg-primary-700 font-medium text-xs' },
  [ProductType.BCO]: { label: '信用', cls: 'text-secondary-100 bg-secondary-700 font-medium text-xs' },
  [ProductType.NCD]: { label: '存单', cls: 'text-orange-100 bg-orange-700 font-medium text-xs' }
} as const;

const ProductTag = ({ productType }: { productType?: ProductType }) => {
  const meta = ProductTagMap[productType ?? 0];
  return <span className={cx('ml-auto flex-center shrink-0 w-[42px] rounded', meta?.cls)}>{meta?.label}</span>;
};

export const UrgentDeal = ({ className, message, onDelete, onClick, ...restProps }: MessageRendererProps) => {
  const { create_time = Date.now(), flag_read, detail, product_type } = message ?? {};
  const { sender_name, content_values } = detail ?? {};
  const [ofrCp, bidCp, quote] = content_values ?? [];

  const createTimeFormat = moment(Number(create_time)).isBefore(moment(), 'day') ? 'MM-DD HH:mm:ss' : 'HH:mm:ss';
  const createTime = formatDate(create_time, createTimeFormat);

  return (
    <div
      className={cx('grid-cols-[32px_minmax(0,1fr)] grid-rows-[24px_24px_minmax(0,1fr)]', rendererLayoutCls, className)}
      onClick={onClick}
      {...restProps}
    >
      <IconReminderFilled className={rendererIconCls} />

      <div className="flex items-center gap-1">
        <span className="text-primary-100 font-bold">{sender_name}</span>
        <BadgeV2
          dot={!flag_read}
          style={{ top: 6, right: -6 }}
        >
          <span className="text-gray-000 text-sm font-bold">催你提交</span>
        </BadgeV2>
        <span className="ml-auto text-gray-300 text-xs font-normal">{createTime}</span>
      </div>

      <div className="flex items-center gap-1">
        <Tooltip
          content={ofrCp}
          truncate
        >
          <span className="max-w-[164px] truncate">{ofrCp}</span>
        </Tooltip>
        <IconRightArrow className="text-gray-300" />
        <Tooltip
          content={bidCp}
          truncate
        >
          <span className="max-w-[164px] truncate">{bidCp}</span>
        </Tooltip>

        <ProductTag productType={product_type} />
      </div>

      <div className="flex items-end gap-2 leading-6">
        {quote}

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
