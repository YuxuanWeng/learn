import { ReadOnly } from '../../../ReadOnly';
import { ExerciseGroup } from '../../ExerciseGroup';
import { useExercise } from '../../ExerciseGroup/provider';
import { PriceGroup, PriceGroupProps } from '../../PriceGroup';
import { useMulCalculateQuery } from '../hooks/useMulCalculateQuery';
import { useCalcHead } from './CalcHeadProvider';

/** 该组件目前仅仅在单条报价弹窗的备注和计算中有用到，样式是根据该弹窗设计，后续如有其他地方引用该组件需要注意样式调整 */
export const PriceInfo = (props: PriceGroupProps & { onOptionsClick?: (val: boolean | null) => void }) => {
  const { getBondPriceOptions } = useCalcHead();
  const { exerciseEnum } = useExercise();

  useMulCalculateQuery(exerciseEnum);

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex-center gap-1">
          <PriceGroup {...props} />
        </div>
        <ExerciseGroup
          className="rounded-lg flex-row-reverse !gap-2 h-6"
          itemClassName="!w-12"
        />
      </div>

      <div className="my-2">
        <ReadOnly
          rowCount={2}
          options={getBondPriceOptions()}
          optionsClassName="!h-6"
          containerClassName="!gap-y-1 py-px"
        />
      </div>
    </>
  );
};
