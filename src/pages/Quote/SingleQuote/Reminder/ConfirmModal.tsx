import cx from 'classnames';
import { ModalUtils } from '@fepkg/components/Modal';
import { Tooltip } from '@fepkg/components/Tooltip';
import { IconAttentionFilled } from '@fepkg/icon-park-react';
import { ProductType, Side } from '@fepkg/services/types/enum';
import { QuoteReminder } from './types';

const ReminderDisplay = ({ side, reminder }: { side: Side; reminder: QuoteReminder }) => {
  const sideReminder = reminder[side];
  const isBid = side === Side.SideBid;
  const sideContent = isBid ? 'bid' : 'ofr';
  const considerationCls = isBid ? 'text-secondary-100' : 'text-orange-100';

  return (
    <>
      {sideReminder?.invertedInfo?.inverted && (
        <div>
          {sideContent}倒挂，对价是：
          <span className={considerationCls}>{sideReminder?.invertedInfo?.consideration}</span>
        </div>
      )}
      {sideReminder?.deviation && <div>{sideContent}超出了估值建议区间</div>}
    </>
  );
};

/** 批量倒挂提醒样式中，若债券简称长度超过8则省略展示并hover气泡展示完整简称 */
const BondShortNameText = ({ shortName, maxLen = 8 }: { shortName: string; maxLen?: number }) => {
  maxLen = maxLen > 0 ? maxLen : 8;
  return shortName.length <= maxLen ? (
    <span>{shortName}</span>
  ) : (
    <Tooltip
      content={shortName}
      delay={{ open: 618 }}
    >
      <span>{shortName.slice(0, Math.max(0, maxLen))}...</span>
    </Tooltip>
  );
};

const BatchReminderDisplay = ({
  reminder,
  bidIndex,
  ofrIndex,
  singleLine
}: {
  reminder: QuoteReminder;
  bidIndex: number;
  ofrIndex: number;
  singleLine: boolean /** 批量倒挂提醒窗口中当只有一条倒挂信息时，该条信息分两行展示，否则每条信息一行展示 */;
}) => {
  const isBidShowReminder = reminder[Side.SideBid]?.invertedInfo?.inverted;
  const isOfrShowReminder = reminder[Side.SideOfr]?.invertedInfo?.inverted;

  const isSameLine = bidIndex === ofrIndex || !isBidShowReminder || !isOfrShowReminder;

  return isBidShowReminder || isOfrShowReminder ? (
    <div className={cx('text-gray-100', cx(!singleLine && 'text-center'))}>
      <span className={cx(!singleLine && 'block mb-3')}>
        {isSameLine && `第${isBidShowReminder ? bidIndex : ofrIndex}行  ${reminder?.bond?.display_code}`}
        &nbsp;
        {reminder?.bond?.short_name && <BondShortNameText shortName={reminder?.bond?.short_name} />}
      </span>
      {singleLine && <>&nbsp;&nbsp;</>}
      {isBidShowReminder && (
        <span className={cx(!singleLine && 'block')}>
          {isSameLine ? '' : `第${bidIndex}行，`}
          bid倒挂，对价是：&nbsp;
          <span className="text-secondary-100">{reminder[Side.SideBid]?.invertedInfo?.consideration}</span>
        </span>
      )}
      {isOfrShowReminder && (
        <span className={cx(!singleLine && 'block')}>
          {isBidShowReminder ? <span>&nbsp;</span> : null}
          {isSameLine ? '' : `  第${ofrIndex}行，`}ofr倒挂，对价是：&nbsp;
          <span className="text-orange-100">{reminder[Side.SideOfr]?.invertedInfo?.consideration}</span>
        </span>
      )}
    </div>
  ) : null;
};

const Single = ({ reminder }: { reminder: QuoteReminder }) => {
  return (
    <>
      <div className="flex-center flex-col gap-3 pb-6 component-dashed-x">
        <ReminderDisplay
          side={Side.SideBid}
          reminder={reminder}
        />
        <ReminderDisplay
          side={Side.SideOfr}
          reminder={reminder}
        />
      </div>

      <div className="flex-center gap-2 mt-3">
        <IconAttentionFilled className="text-orange-100" />
        <span className="text-sm text-gray-200">是否继续保存？</span>
      </div>
    </>
  );
};

const Batch = ({ reminders }: { reminders: QuoteReminder[] }) => {
  /** 当只有一条倒挂信息需要展示时，需要分两行展示，singleLine = false */
  const singleLine =
    reminders.filter(
      remind => remind[Side.SideBid]?.invertedInfo?.inverted || remind[Side.SideOfr]?.invertedInfo?.inverted
    ).length != 1;
  return (
    <>
      <div className={cx('flex-col gap-3 pb-6 component-dashed-x', singleLine ? 'flex' : 'flex-center')}>
        {reminders
          .sort((a, b: QuoteReminder) => {
            /** sort by line number asc */
            const aIndex = a.bidIndex ?? a.ofrIndex ?? 0;
            const bIndex = b.bidIndex ?? b.ofrIndex ?? 0;
            return aIndex - bIndex;
          })
          .map(reminder => {
            const key = `${(reminder.bidIndex || 0) + 1}_${(reminder.ofrIndex || 0) + 1}_${reminder?.bond?.bond_code}`;

            return (
              <BatchReminderDisplay
                key={key}
                bidIndex={(reminder.bidIndex || 0) + 1}
                ofrIndex={(reminder.ofrIndex || 0) + 1}
                reminder={reminder}
                singleLine={singleLine}
              />
            );
          })}
      </div>

      <div className="flex-center gap-2 mt-3">
        <IconAttentionFilled className="text-orange-100" />
        <span className="text-sm text-gray-200">是否继续保存？</span>
      </div>
    </>
  );
};

const modalCls = cx(
  '[&_.ant-modal-body]:!p-6',
  '[&_.ant-modal-confirm-content]:!mt-0',
  '[&_.ant-modal-confirm-btns]:flex-center [&_.ant-modal-confirm-btns]:!mt-4'
);

export const showConfirmReminderModal = ({
  list,
  batch = list.length > 1,
  onOk,
  onCancel
}: {
  productType: ProductType;
  list: QuoteReminder[];
  batch?: boolean;
  onOk?: () => void;
  onCancel?: () => void;
}) => {
  // 批量报价不需要提示估值偏离
  const valid = list.some(
    item => item[Side.SideBid]?.invertedInfo?.inverted || item[Side.SideOfr]?.invertedInfo?.inverted
  );

  if (batch && !valid) {
    onOk?.();
    return;
  }

  ModalUtils.confirm({
    content: batch ? <Batch reminders={list} /> : <Single reminder={list[0]} />,
    centered: true,
    showIcon: false,
    showTitle: false,
    buttonsCentered: true,
    mask: true,
    maskClosable: false,
    width: 'auto',
    className: modalCls,
    onOk,
    onCancel
  });
};
