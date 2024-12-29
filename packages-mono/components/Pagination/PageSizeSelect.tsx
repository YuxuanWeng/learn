import { useMemo, useState } from 'react';
import { IconDown, IconUp } from '@fepkg/icon-park-react';
import { Popover } from '../Popover';

type Props = {
  pageSize: number;
  options?: { label: string; value: number }[];
  onPageChange?: (pageNum: number, pageSize: number) => void;
};

type ContentProps = {
  onClick: (val: number) => void;
  options?: { label: string; value: number }[];
};

const Content = ({ options = [], onClick }: ContentProps) => {
  return (
    // bg-gray-600 p-2 rounded-lg border border-solid border-gray-500
    <div className="">
      {options.map(({ value, label }) => (
        <div
          className="rounded-lg h-8 hover:bg-gray-500 hover:text-gray-000 text-gray-100 flex-center gap-2 cursor-pointer"
          key={value}
          onClick={() => {
            onClick(value);
          }}
        >
          <span className="text-sm">{label}</span>
        </div>
      ))}
    </div>
  );
};

export const PageSizeSelect = ({ pageSize, options, onPageChange }: Props) => {
  const [open, setOpen] = useState(false);
  const text = useMemo(() => {
    return options?.find(option => option.value === pageSize)?.label ?? '';
  }, [options, pageSize]);

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      offset={4}
      floatingFocus={false}
      trigger="hover"
      arrow={false}
      floatingProps={{ className: '!p-2 !min-w-[108px]' }}
      content={
        <Content
          onClick={val => {
            onPageChange?.(1, val);
            setOpen(false);
          }}
          options={options}
        />
      }
    >
      <div className="flex justify-between items-center h-6 w-[108px] px-3 bg-gray-700 hover:bg-gray-500 rounded-lg">
        <span className="truncate text-sm font-medium text-gray-100">{text}</span>
        {open ? (
          <IconUp
            className="text-gray-200"
            size={16}
          />
        ) : (
          <IconDown
            className="text-gray-200"
            size={16}
          />
        )}
      </div>
    </Popover>
  );
};
