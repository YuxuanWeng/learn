import { ReactElement, cloneElement, useState } from 'react';
import cx from 'classnames';
import { Pagination as AntPagination, PaginationProps } from 'antd';
import { Input } from '@fepkg/components/Input';
import { PageSizeSelect } from './PageSizeSelect';

export const Pagination = ({
  current,
  defaultPageSize = 10,
  pageSize = defaultPageSize,
  total,
  showQuickJumper,
  onChange,
  className,
  showSizeChanger = false,
  pageSizeOptions,
  onShowSizeChange,
  prefetch,
  ...restProps
}: PaginationProps & { prefetch?: (page: number) => void }) => {
  const [value, setValue] = useState('');
  const maxPage = Math.ceil((total ?? 0) / (pageSize ?? defaultPageSize));

  const handleChange = (val: string) => {
    const num = Number(val);
    if (!val) {
      setValue('');
      return;
    }
    if (Number.isInteger(num) && num >= 1) {
      setValue(String(num));
      prefetch?.(Math.min(num, maxPage));
    } else {
      setValue('');
    }
  };

  const handleReset = () => {
    let num = Number(value);
    if (num > maxPage) {
      num = maxPage;
    } else if (num < 1) {
      num = 1;
    }
    if (value) {
      setValue(String(num));
      onChange?.(num, pageSize ?? defaultPageSize);
    }
    // 执行跳转后清除input内容
    setValue('');
  };

  const pageOptions = pageSizeOptions?.map(item => ({ label: `${item}条/页`, value: item }));

  return (
    <div className="flex h-6 gap-1">
      <AntPagination
        pageSize={pageSize}
        total={total}
        onChange={(pageNum, size) => {
          onChange?.(pageNum, size);
          setValue('');
        }}
        itemRender={(page, type, element) => {
          return cloneElement(element as ReactElement, {
            onPointerEnter: () => {
              if (type === 'page') {
                prefetch?.(page);
              }
            }
          });
        }}
        defaultPageSize={defaultPageSize}
        current={current}
        showSizeChanger={false}
        className={cx('[&_.ant-pagination-item]:!text-sm', className)}
        {...restProps}
      />
      {showQuickJumper && (
        <div className="flex items-center gap-[1px] rounded-xl w-[108px] bg-gray-700">
          <label
            htmlFor="pagination-input"
            className="w-[54px] bg-gray-600 text-center rounded-r-none rounded-l-lg h-full leading-[24px] text-sm"
          >
            跳转
          </label>
          <Input
            id="pagination-input"
            className="!w-0 flex-1 rounded-l-none rounded-r-lg h-full"
            rounded
            clearIcon={null}
            value={value}
            onChange={handleChange}
            onEnterPress={(_val, e) => {
              handleReset();
              // 回车后主动失去焦点
              e.currentTarget.blur();
            }}
          />
        </div>
      )}
      {showSizeChanger && (
        <PageSizeSelect
          options={pageOptions}
          pageSize={pageSize}
          onPageChange={onShowSizeChange}
        />
      )}
    </div>
  );
};
