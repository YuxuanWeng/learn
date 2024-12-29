import cx from 'classnames';
import { getInstName } from '@fepkg/business/utils/get-name';
import { SelectedItem } from '@fepkg/components/Select/SelectedItem';
import { SelectedInstProps } from './types';

export const SelectedInst = ({ selectedInst, className, productType, onDeleteInst }: SelectedInstProps) => {
  return (
    <div className={cx('pt-3', className)}>
      <span className="text-gray-100 font-normal">已选机构</span>
      <div className="flex flex-wrap gap-2 mt-3 overflow-overlay h-14">
        {selectedInst?.map(inst => (
          <SelectedItem
            key={inst.inst_id}
            // 最大宽度120刚好在宽度为420的modal中排三列
            className="h-6 max-w-[120px]"
            label={getInstName({ inst, productType }) ?? ''}
            handleClose={() => onDeleteInst?.(inst.inst_id)}
          />
        ))}
      </div>
    </div>
  );
};
