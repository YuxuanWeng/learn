import cx from 'classnames';
import styles from './style.module.less';

export type ProgressProps = {
  hidden: boolean;
  isError: boolean;
  progress: number;
  className?: string;
};

export const Progress = ({ hidden, isError, progress, className }: ProgressProps) => {
  return (
    <div className={cx('relative mx-auto mt-0 h-[3px] w-full overflow-hidden', hidden ? 'invisible' : '', className)}>
      <div
        className={cx(
          'absolute h-[3px] w-full rounded overflow-hidden',
          isError ? 'bg-danger-200' : `animate-process ${styles['progress-gradient']}`
        )}
        style={{ right: `${(100 - progress).toFixed(1)}%` }}
      />
    </div>
  );
};
