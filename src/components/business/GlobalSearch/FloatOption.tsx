import { Key, ReactNode } from 'react';
import cx from 'classnames';
import { getInstName } from '@fepkg/business/utils/get-name';
import { Highlight } from '@fepkg/components/Highlight';
import { SearchOption } from '@fepkg/components/Search';
import { useFloat } from '@fepkg/components/Search/FloatProvider';
import { GlobalSearchOption, GlobalSearchOptionType } from '@/components/business/GlobalSearch/types';
import { useInput } from './InputProvider';
import { useSearchProps } from './SearchPropsProvider';

type FloatOptionProps = {
  className?: string;
  index: number;
  option: SearchOption<GlobalSearchOption>;
  keyword: string;
  sibling: boolean;
  /** 是否展示债券评级 */
  rating: boolean;
};

export const FloatOption = ({ className, index, option, keyword, sibling, rating }: FloatOptionProps) => {
  const { search_option_type } = option.original;
  const { activeIndex, listRef, interactions } = useFloat();
  const { handleChange } = useInput();
  const { productType } = useSearchProps();

  let content: ReactNode = null;

  switch (search_option_type) {
    case GlobalSearchOptionType.BOND:
      content = (
        <>
          <Highlight
            className="pl-4"
            keyword={keyword}
          >
            {option.original.display_code}
          </Highlight>
          <Highlight keyword={keyword}>{option.original.short_name}</Highlight>
          {rating && <span className="truncate">{option.original.issuer_rating}</span>}
          <span className="truncate">{option.original.time_to_maturity}</span>
        </>
      );
      break;
    case GlobalSearchOptionType.INST: {
      // 机构业务简称, 无则展示中文简称
      const bizShortName = getInstName({ inst: option.original, productType });
      content = (
        <>
          <Highlight
            className="pl-4"
            keyword={keyword}
          >
            {bizShortName}
          </Highlight>
          <Highlight keyword={keyword}>{option.original.short_name_zh}</Highlight>
          <Highlight
            className={rating ? 'col-span-2' : undefined}
            keyword={keyword}
          >
            {option.original.full_name_zh}
          </Highlight>
        </>
      );
      break;
    }
    case GlobalSearchOptionType.TRADER: {
      // 机构业务简称, 无则展示中文简称
      const bizShortName = getInstName({ inst: option.original.inst_info, productType });
      content = (
        <>
          <Highlight
            className="pl-4"
            keyword={keyword}
          >
            {option.original.name_zh}
          </Highlight>
          <Highlight
            className={rating ? 'col-span-3' : 'col-span-2'}
            keyword={keyword}
          >
            {bizShortName}
          </Highlight>
        </>
      );
      break;
    }
    case GlobalSearchOptionType.BROKER:
      content = (
        <>
          <Highlight
            className="pl-4"
            keyword={keyword}
          >
            {option.original.name_cn}
          </Highlight>
          <Highlight
            className="col-span-2"
            keyword={keyword}
          >
            {option.original.account}
          </Highlight>
        </>
      );
      break;
    default:
      break;
  }

  return (
    <>
      <div
        className={cx(
          'relative grid items-center shrink-0 h-6 text-sm font-medium rounded-lg cursor-pointer',
          'child-span:whitespace-nowrap child-span:text-ellipsis child-span:overflow-hidden',
          // 相当于hover效果
          activeIndex === index ? 'bg-gray-500 text-gray-000' : 'text-gray-100',
          className
        )}
        style={{
          gridTemplateColumns: rating ? '160px 160px 80px 120px' : '160px 160px 200px'
        }}
        {...interactions.getItemProps({
          key: option.value as Key,
          ref(node) {
            listRef.current[index] = node;
          },
          role: 'option',
          // 用 onMouseDown 取代 onClick
          // 以避免单击鼠标按键时间长的习惯导致的 blur 提前生效问题
          onMouseDown() {
            handleChange(option);
          }
        })}
      >
        {content}
      </div>

      {sibling && <div className="component-dashed-x shrink-0 h-px" />}
    </>
  );
};
