import cx from 'classnames';
import { Highlight } from '@fepkg/components/Highlight';
import { useFloat } from '@fepkg/components/Search/FloatProvider';
import { FiccBondBasic } from '@fepkg/services/types/common';
import { useInput } from './InputProvider';

type FloatOptionProps = {
  bond: FiccBondBasic;
  index: number;
  keyword: string;
};

export const FloatOption = ({ bond, index, keyword }: FloatOptionProps) => {
  const { activeIndex, listRef, interactions } = useFloat();
  const { handleSelect } = useInput();

  const columns = {
    // 需要展示有后缀的code
    display_code: '120px',
    short_name: '160px',
    time_to_maturity: '160px'
  };
  const visibleKeys = Object.keys(columns);
  const templateColumns = visibleKeys.map(i => columns[i]).join(' ');

  return (
    <div
      className={cx(
        'grid items-center h-6 text-sm font-medium text-gray-100 hover:text-gray-000 cursor-pointer w-full',
        activeIndex === index && 'bg-gray-500 rounded-lg'
      )}
      style={{
        gridTemplateColumns: templateColumns
      }}
      {...interactions.getItemProps({
        key: bond.display_code,
        ref(node) {
          listRef.current[index] = node;
        },
        role: 'option',
        // 用 onMouseDown 取代 onClick
        // 以避免单击鼠标按键时间长的习惯导致的 blur 提前生效问题
        onMouseDown() {
          handleSelect(bond);
        }
      })}
    >
      {visibleKeys.map(key => {
        return (
          <span
            key={key}
            className="pl-3 truncate"
          >
            <Highlight keyword={keyword}>{bond[key]}</Highlight>
          </span>
        );
      })}
    </div>
  );
};
