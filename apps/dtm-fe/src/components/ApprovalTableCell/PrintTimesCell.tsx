import { Tooltip } from '@fepkg/components/Tooltip';
import { User } from '@fepkg/services/types/bdm-common';

type PrintTimesCellProps = { operators?: User[] };

const PrintTimesContent = ({ operators }: PrintTimesCellProps) => {
  return (
    <div className="w-[300px] text-sm text-gray-000">
      <div className="h-[34px] font-medium component-dashed-x">打印人</div>
      <div className="mt-3 flex flex-wrap gap-x-2 gap-y-3 font-normal">
        {operators?.map(user => {
          return (
            <span
              key={user.user_id}
              className="px-3 h-6 bg-gray-700 rounded flex items-center justify-center"
            >
              {user.name_cn}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export const PrintTimesCell = ({ operators }: PrintTimesCellProps) => {
  if (!operators?.length) {
    return null;
  }

  return (
    <Tooltip
      floatingProps={{ className: '!p-3' }}
      content={<PrintTimesContent operators={operators} />}
    >
      <span className="bg-gray-600 h-6 w-14 text-center flex items-center justify-center rounded text-gray-000 font-normal">
        {operators.length}次
      </span>
    </Tooltip>
  );
};
