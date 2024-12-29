import { SelectedItem } from '@fepkg/components/Select/SelectedItem';
import { useSearchInstTrader } from './provider';
import { buildRenderData } from './util';

/** 明细中的变更分组成员已选项区域 */
export const Footer = () => {
  const { selectedTraders, handleDeleteTrader } = useSearchInstTrader();
  const renderData = buildRenderData(selectedTraders);

  return (
    <div className="h-[110px] flex flex-col gap-2 px-3 p-3">
      <span className="text-sm text-gray-200 ">已选</span>
      <div className="h-full overflow-y-overlay flex flex-wrap gap-2">
        {renderData.map(v => {
          return (
            <SelectedItem
              key={v.id}
              className="max-w-[138px] h-6"
              label={v.name}
              handleClose={() => handleDeleteTrader(v.id)}
            />
          );
        })}
      </div>
    </div>
  );
};
