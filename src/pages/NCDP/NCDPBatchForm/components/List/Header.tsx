import { useMemo } from 'react';
import { initList, useNCDPBatchForm } from '../../providers/FormProvider';
import { Action } from './Action';

export const Header = () => {
  const { isEdit, isBatch, updateFormList } = useNCDPBatchForm();

  const columns = useMemo(() => {
    const res = [
      { label: '序号', width: 40, center: true },
      { label: '发行机构', width: 140 },
      { label: '评级', width: 88 },
      { label: '期限', width: 92 },
      { label: '价格', width: 192 },
      { label: '数量(亿)', width: 112 },
      { label: '发行日期', width: 92 },
      { label: '备注', width: 120 }
    ];
    if (!isBatch) res.shift();
    return res;
  }, [isBatch]);

  const updateAll = (field: 'flag_brokerage' | 'flag_internal') => {
    updateFormList(draft => {
      const len = draft.length;
      let falsyCount = 0;

      for (let i = 0; i < len; i++) {
        if (!draft[i][field]) {
          // 如果有未选中的，需要选中
          falsyCount++;
          draft[i][field] = true;
        }
      }

      // 如果没有未选中的，说明此时是全部选中，需要全部取消选中
      if (!falsyCount) {
        for (let i = 0; i < len; i++) {
          draft[i][field] = false;
        }
      }
    });
  };

  return (
    <div className="flex items-center gap-1 px-2.5 text-gray-200">
      {columns.map(({ label, width, center }) => {
        return (
          <div
            key={label}
            style={{ width, justifyContent: center ? 'center' : undefined }}
            className="flex items-center h-9 px-3 text-sm whitespace-nowrap select-none"
          >
            {label}
          </div>
        );
      })}

      {isBatch && (
        <Action
          showDelete={!isEdit}
          showPopconfirm
          onBrokerage={() => updateAll('flag_brokerage')}
          onInternal={() => updateAll('flag_internal')}
          onDelete={() => updateFormList(initList())}
        />
      )}
    </div>
  );
};
