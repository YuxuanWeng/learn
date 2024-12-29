/** 成交状态 */
import cx from 'classnames';

type Props = {
  /** 颜色 */
  color: string;
  /** 文字 */
  texts?: string[];
};

/** 成交状态标志 */
const TransactionStatus = ({ color, texts }: Props) => {
  return (
    <div className="w-3 relative flex items-center">
      <div className={cx('h-16 w-[2px]', color)} />
      <div
        className={cx(
          'w-3 gap-1 flex-center flex-col rounded',
          'absolute top-1/2 -translate-y-1/2 left-0 h-12',
          !texts && 'hidden',
          color
        )}
      >
        {texts?.map(i => (
          <span
            key={i}
            className="text-xs tracking-normal leading-none font-normal"
          >
            {i}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TransactionStatus;
