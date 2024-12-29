import { TextBadge } from '@fepkg/components/Tags';

type FirstMaturityDateCellProps = {
  /** 展示内容 */
  content?: string;
  /** 「休几」的数量 */
  restDayNum?: string;
  /** 是否展示disabled态 */
  disabled?: boolean;
};

export const FirstMaturityDateCell = ({ content, restDayNum, disabled }: FirstMaturityDateCellProps) => {
  return (
    <>
      {content}

      {!!restDayNum && (
        <TextBadge
          type="HOL"
          text="休"
          className="ml-2"
          num={restDayNum}
          disabled={disabled}
        />
      )}
    </>
  );
};
