import cx from 'classnames';
import { RadioButton } from '@fepkg/components/Radio';
import { SpotDate } from '@/components/IDCSpot/types';

type IProps = {
  disabled?: boolean;
  spotDate?: SpotDate;
  onChange?: (spotDate?: SpotDate) => void;
};

const buttonClass = 'w-[60px] h-6 ml-0.5';
export default function IDCSimplifyShortcuts({ disabled, spotDate, onChange }: IProps) {
  const onItemClick = (event: React.MouseEvent<HTMLElement, MouseEvent>, clickSpotDate?: SpotDate) => {
    onChange?.(clickSpotDate);
    const isCtrlKey = event.metaKey || event.ctrlKey;
    // 单选
    if (!isCtrlKey) {
      onChange?.(clickSpotDate);
    } else {
      if (spotDate === SpotDate.FRA) {
        onChange?.(clickSpotDate);
        return;
      }
      // 多选时仅有自己选项时反选自己，不生效
      if (spotDate === clickSpotDate) {
        return;
      }
      // 多选时仅两者都有，将自己排除
      if (spotDate === SpotDate.NonFRA) {
        if (clickSpotDate === SpotDate.Plus0) {
          onChange?.(SpotDate.Today1Tommorow0);
        } else {
          onChange?.(SpotDate.Plus0);
        }
      } else {
        onChange?.(SpotDate.NonFRA);
      }
    }
  };

  return (
    <div className={cx('inline-block rounded-lg bg-gray-700 flex items-center h-6')}>
      <RadioButton
        tabIndex={-1}
        disabled={disabled}
        checked={!disabled && (spotDate === SpotDate.Plus0 || spotDate === SpotDate.NonFRA)}
        onClick={event => onItemClick?.(event, SpotDate.Plus0)}
        className={buttonClass}
        clearInnerPadding
      >
        <span className="!text-xs">+0</span>
      </RadioButton>

      <RadioButton
        tabIndex={-1}
        disabled={disabled}
        checked={!disabled && (spotDate === SpotDate.Today1Tommorow0 || spotDate === SpotDate.NonFRA)}
        onClick={event => onItemClick?.(event, SpotDate.Today1Tommorow0)}
        className={cx(buttonClass, '!w-18')}
        clearInnerPadding
      >
        <span className="!text-xs">+1/明天+0</span>
      </RadioButton>

      <RadioButton
        tabIndex={-1}
        disabled={disabled}
        checked={!disabled && spotDate === SpotDate.FRA}
        onClick={event => onChange?.(SpotDate.FRA)}
        className={buttonClass}
        clearInnerPadding
      >
        <span className="!text-xs">远期</span>
      </RadioButton>
    </div>
  );
}
