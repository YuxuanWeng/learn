import { Progress } from '@/components/Progress';

export type DataInitProgressStatusType = 'loading' | 'success' | 'error' | 'none';

type IProgressProps = {
  status: DataInitProgressStatusType;
  progress: number;
  // content: string;
};
export const DataInitProgress = ({ status, progress }: IProgressProps) => {
  return (
    <footer className="relative bottom-0 flex flex-col justify-center w-full">
      {/* <div className={cx('flex items-center justify-end mb-[14px] px-4', status === 'none' && 'invisible')}>
        <Caption
          type={status === 'error' ? 'danger' : 'primary'}
          size="xs"
          childrenCls="text-gray-300 font-normal"
          className="mr-1"
        >
          {content}
        </Caption>
        <span className="overflow-hidden font-normal leading-4 text-gray-200 text-md">
          {progress.toFixed(0)}
          <span className="text-xs">%</span>
        </span>
      </div> */}
      <Progress
        hidden={status === 'none'}
        isError={status === 'error'}
        progress={progress}
      />
    </footer>
  );
};
