import cx from 'classnames';
import { getInstName } from '@fepkg/business/utils/get-name';
import { BaseOption } from '@fepkg/components/BaseOptionsRender/BaseOption';
import { Checkbox } from '@fepkg/components/Checkbox';
import { Placeholder } from '@fepkg/components/Placeholder';
import { NumberBadge } from '@fepkg/components/Tags';
import { SearchOptionsProps } from './types';

const checkboxCls = 'flex items-center !h-10 px-3 mx-2 rounded-lg justify-start';

export const SearchOptions = ({
  productType,
  searchInst,
  isSelectAll,
  isIndeterminate,
  onSelectAll,
  onSelectedInstChange,
  className = '',
  selectedInst = []
}: SearchOptionsProps) => {
  return (
    <div className={className}>
      {searchInst?.length ? (
        <Checkbox
          childrenCls={() => 'flex items-center'}
          className={cx(checkboxCls, 'hover:bg-gray-500 hover:text-primary-000 text-gray-000')}
          checked={isSelectAll}
          indeterminate={isIndeterminate}
          onChange={onSelectAll}
        >
          <span className="mr-2">全部机构</span>
          <NumberBadge num={searchInst?.length || 0} />
        </Checkbox>
      ) : null}

      <div className="overflow-y-overlay h-[calc(100%_-_40px)]">
        {searchInst?.length ? (
          searchInst.map(inst => {
            return (
              <BaseOption
                key={inst.inst_id}
                className={checkboxCls}
                hoverActive
                checkbox
                checkboxProps={{
                  checked: selectedInst?.some(selected => selected.inst_id === inst.inst_id),
                  onChange: val => {
                    onSelectedInstChange?.(inst.inst_id, val);
                  }
                }}
              >
                <span className="text-gray-000">{getInstName({ inst, productType })}</span>
              </BaseOption>
            );
          })
        ) : (
          <div className="flex items-center h-full">
            <Placeholder
              className="mt-4 !gap-0"
              size="sm"
              type="no-search-result"
              label="没有搜索到机构"
            />
          </div>
        )}
      </div>
    </div>
  );
};
