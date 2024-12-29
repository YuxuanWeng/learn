import { TextBadge } from '@fepkg/components/Tags';

type ShortNameCellProps = {
  /** 展示内容 */
  content?: string;
  /** 是否上市 */
  listed?: boolean;
  /** 浮动利率类型 */
  frType?: string;
  /** 周六/周日 */
  weekendDay?: string;
  /** 「休几」的数量 */
  restDayNum?: string;
  /** 到期日是否为节假日 */
  maturityIsHoliday?: boolean;
  /** 是否展示disabled态 */
  disabled?: boolean;
};

export const ShortNameCell = ({
  content,
  listed,
  frType,
  weekendDay,
  restDayNum,
  maturityIsHoliday,
  disabled
}: ShortNameCellProps) => {
  const showFrTypeBadge = !!frType;
  const showNBadge = !listed;
  const showHOLBadge = (maturityIsHoliday || !!restDayNum) && !weekendDay;
  const showWeekendDayBadge = (maturityIsHoliday || restDayNum) && weekendDay;

  const showBadge =
    showFrTypeBadge || showNBadge || showHOLBadge || ((maturityIsHoliday || !!restDayNum) && weekendDay);

  return (
    <>
      <span className="flex-shrink-0 truncate-clip">{content}</span>

      {showBadge && (
        <div className="flex items-center h-full gap-x-2 py-1 ml-2">
          {showFrTypeBadge && (
            <TextBadge
              type="BOND"
              text={frType}
              disabled={disabled}
            />
          )}
          {showNBadge && (
            <TextBadge
              type="BOND"
              text="N"
              disabled={disabled}
            />
          )}
          {showHOLBadge && (
            <TextBadge
              type="HOL"
              text="休"
              disabled={disabled}
            />
          )}
          {showWeekendDayBadge && (
            <TextBadge
              type="DAY"
              text={weekendDay}
              disabled={disabled}
            />
          )}
        </div>
      )}
    </>
  );
};
