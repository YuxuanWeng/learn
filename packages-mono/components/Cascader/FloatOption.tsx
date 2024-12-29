import { useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import { BaseOption } from '@fepkg/components/BaseOptionsRender/BaseOption';
import { Placeholder } from '@fepkg/components/Placeholder';
import { IconRight } from '@fepkg/icon-park-react';
import { useVirtualList } from 'ahooks';
import { useCascader } from './SelectProvider';
import { CascaderItemProps, CascaderListProps, CascaderOption } from './types';

const CascadeItem = ({
  option,
  checkboxCls,
  isExpend,
  disabled,
  checked,
  indeterminate,
  onClick,
  onChange
}: CascaderItemProps) => {
  return (
    <BaseOption
      className="w-full mb-0.5 overflow-x-hidden justify-between"
      disabled={disabled}
      onClick={onClick}
      checkbox
      hoverActive
      expand={isExpend}
      title={option.label}
      checkboxProps={{ className: checkboxCls, checked, disabled, indeterminate, onChange }}
      suffixNode={option.children?.length ? <IconRight /> : null}
    >
      {option.label}
    </BaseOption>
  );
};

export const CascadeList = ({ depth, options, expendDepth, virtual, setExpendDepth, className }: CascaderListProps) => {
  const first = options?.find(i => (i.children?.length ?? 0) > 0);
  const [expendKey, setExpendKey] = useState<string | number | undefined>();

  const parentRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { change } = useCascader();

  const [virtualData] = useVirtualList<CascaderOption>(options ?? [], {
    containerTarget: parentRef,
    wrapperTarget: wrapperRef,
    itemHeight: 36,
    overscan: 20
  });

  const virtualOptions = virtualData.map(v => v.data);

  // 用于展开深度小于该列表时自动取消展开
  useEffect(() => {
    if (expendDepth <= depth) {
      setExpendKey(void 0);
    }
  }, [depth, expendDepth]);

  // 当前展开的选项，如果没有就就给第一项
  const expendOption = options?.find(o => o.value === expendKey) ?? first;
  const mergeOptions = (virtual ? virtualOptions : options) ?? [];

  return (
    <>
      <div
        ref={parentRef}
        className={cx(
          'flex-1 pr-2 flex flex-col gap-y-1 overflow-overlay',
          // depth > 1 && 'component-dashed-y',
          className
        )}
      >
        <div ref={wrapperRef}>
          {mergeOptions.map(item => {
            return (
              <CascadeItem
                key={item.value}
                checkboxCls={depth > 1 ? 'flex-1' : 'w-auto'}
                option={item}
                isExpend={expendOption?.value === item.value}
                checked={item.checked}
                indeterminate={item.indeterminate}
                onClick={() => {
                  if (item.children?.length) {
                    setExpendKey(item.value);
                    setExpendDepth?.(depth + 1);
                  }
                }}
                onChange={val => {
                  // onChange?.(val, item);
                  // onOptionChecked(val, item);
                  change(val, item);
                }}
              />
            );
          })}
        </div>
        {!mergeOptions.length && (
          <Placeholder
            className="my-8"
            size="xs"
            type="no-search-result"
          />
        )}
      </div>

      {/* 递归展示子列表 */}
      {expendOption ? (
        <>
          {/* 虚线单独拿出来是为了避免虚线随着内容滚动 */}
          <div className="component-dashed-y h-[228px]" />
          <CascadeList
            virtual={virtual}
            depth={depth + 1}
            className="pl-2"
            options={expendOption.children}
            expendDepth={expendDepth}
            setExpendDepth={setExpendDepth}
            // onChange={onChange}
          />
        </>
      ) : null}
    </>
  );
};
