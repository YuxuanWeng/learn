import { useEffect } from 'react';
import cx from 'classnames';
import { Portal } from '@fepkg/components/Portal';
import { useFloat } from '@fepkg/components/Search/FloatProvider';
import { ProductType } from '@fepkg/services/types/enum';
import { useFuzzySearchQuery } from '@/components/business/GlobalSearch/useFuzzySearchQuery';
import { FloatOption } from './FloatOption';
import { useInput } from './InputProvider';
import { useSearchProps } from './SearchPropsProvider';
import { useTimeConsumingLog } from './useTimeConsumingLog';

const floatOptionsCls = cx(
  'flex flex-col gap-px p-2 rounded-lg',
  'bg-gray-600 border border-solid border-gray-500 drop-shadow-dropdown overflow-y-overlay'
);

const MediaMap = {
  [ProductType.BNC]: cx(
    'max-h-[298px]',
    '[@media(min-height:700px){&}]:max-h-[398px]',
    '[@media(min-height:800px){&}]:max-h-[498px]',
    '[@media(min-height:900px){&}]:max-h-[598px]',
    '[@media(min-height:950px){&}]:max-h-[none]'
  ),
  [ProductType.BCO]: cx(
    'max-h-[228px]',
    '[@media(min-height:700px){&}]:max-h-[328px]',
    '[@media(min-height:800px){&}]:max-h-[428px]',
    '[@media(min-height:900px){&}]:max-h-[528px]',
    '[@media(min-height:950px){&}]:max-h-[none]'
  ),
  [ProductType.NCD]: cx(
    'max-h-[264px]',
    '[@media(min-height:700px){&}]:max-h-[364px]',
    '[@media(min-height:800px){&}]:max-h-[466px]',
    '[@media(min-height:900px){&}]:max-h-[568px]',
    '[@media(min-height:950px){&}]:max-h-[none]'
  )
};
const needRatingProductTypeList = new Set([ProductType.BCO, ProductType.NCD]);

export const FloatOptions = () => {
  const { productType } = useSearchProps();
  const { open, floating, interactions, setActiveIndex } = useFloat();
  const { searchValue } = useInput();
  const { data, isLoading } = useFuzzySearchQuery(searchValue);

  const needRating = needRatingProductTypeList.has(productType ?? ProductType.ProductTypeNone);
  const visible = !!(open && !isLoading && searchValue && data?.options?.length);

  // 若下拉框框内数据只有 1 条，则默认设置 activeIndex 为该内容的 index
  // 若下拉框内数据没有债券内容，但有其他选项时，则默认设置 activeIndex 为第一条内容的 index
  useEffect(() => {
    if (visible && (data?.options?.length === 1 || (data?.options?.length && !data?.bondOptions?.length))) {
      setActiveIndex(0);
    } else {
      setActiveIndex(null);
    }
  }, [visible, searchValue, data, setActiveIndex]);

  useTimeConsumingLog();

  return (
    <Portal rootId="global-search-options-container">
      <div
        {...interactions.getFloatingProps({ ref: floating.refs.setFloating })}
        className={cx(floatOptionsCls, MediaMap[productType])}
        style={{
          ...floating.floatingStyles,
          visibility: visible ? 'visible' : 'hidden',
          zIndex: 9999
        }}
        onMouseDown={evt => {
          // 防止点击options滚动条时触发搜索组件的onBlur事件, 与search/FloatOptions相同
          evt.preventDefault();
        }}
      >
        {data?.options?.map((option, index) => {
          return (
            <FloatOption
              key={`${option.value}_${option.original.search_option_type}`}
              index={index}
              option={option}
              keyword={searchValue}
              sibling={!!option.original.is_sibling_option}
              rating={needRating}
            />
          );
        })}
      </div>
    </Portal>
  );
};
