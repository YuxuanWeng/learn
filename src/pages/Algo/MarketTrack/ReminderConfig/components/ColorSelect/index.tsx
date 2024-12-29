import { useState } from 'react';
import cx from 'classnames';
import { Popover } from '@fepkg/components/Popover';
import { ColorPickProps } from '../../types';

const colorCls = 'rounded w-4 h-4 cursor-pointer flex-center';
const Content = (props: ColorPickProps & { onClose: () => void }) => {
  const { colorOpt, selectedValue, onChange, onClose } = props;

  return colorOpt?.map(item => {
    return (
      <span
        key={item.value}
        className={cx('rounded-lg p-2 hover:bg-gray-800 cursor-pointer flex-center')}
        onClick={() => {
          onClose();
          onChange?.(item);
        }}
      >
        <span className={cx(colorCls, selectedValue?.value === item.value ? 'outline-2 outline' : '', item.color)} />
      </span>
    );
  });
};

export const ColorPick = (props: ColorPickProps) => {
  const { selectedValue, colorOpt } = props;
  const curColor = colorOpt?.find(i => i.value === selectedValue?.value);
  const [open, setOpen] = useState(false);
  return (
    <Popover
      arrow={false}
      offset={{ crossAxis: -21, mainAxis: 2 }}
      floatingProps={{ className: 'px-3 py-1 bg-gray-600 flex gap-3 !flex-row' }}
      trigger="manual"
      open={open}
      onOpenChange={setOpen}
      placement="bottom-start"
      destroyOnClose
      content={
        <Content
          onClose={() => setOpen(false)}
          {...props}
        />
      }
    >
      <div
        className={cx(colorCls, curColor?.color, curColor?.hoverColor)}
        onClick={() => {
          setOpen(true);
        }}
      />
    </Popover>
  );
};
