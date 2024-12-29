import { Caption } from '@fepkg/components/Caption';
import { DealContainerData } from '../type';

type OtherTitleProps = { data: DealContainerData };

export const OtherTitle = ({ data }: OtherTitleProps) => {
  return (
    <div className="h-10 px-2 bg-gray-600 border border-solid border-y-0 border-gray-500">
      <div className="h-8 w-full px-2 flex bg-gray-800 border-solid border-gray-600 border-0 border-t">
        {data.isHistory ? (
          <Caption
            type="orange"
            className="!text-gray-100"
            size="xs"
          >
            历史成交
          </Caption>
        ) : (
          <Caption
            className="!text-gray-100"
            size="xs"
          >
            当日成交
          </Caption>
        )}
      </div>
      <div className="h-0 mx-2 -mt-px border-solid border-0 border-gray-600 border-t" />
      {/* 模拟 当日/历史成交 标题的下边距 */}
      <div className="h-2 bg-gray-800" />
    </div>
  );
};
