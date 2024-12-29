import cx from 'classnames';
import { IconDrag } from '@fepkg/icon-park-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { KeyMode, OverlayOptionProps, SortableOptionProps } from './types';

export const SortableOption = ({ option, selected, disabled, onClick }: SortableOptionProps) => {
  const { isDragging, attributes, listeners, isSorting, setNodeRef, transform, transition, over } = useSortable({
    id: option.key,
    animateLayoutChanges: () => false,
    data: { key: option.key }
  });

  return (
    <div
      ref={setNodeRef}
      className={cx(
        'relative select-none h-6 rounded-lg border border-solid border-transparent group',
        !isDragging && 'hover:!border-gray-400',
        selected && 'bg-gray-500',
        disabled ? 'text-gray-300 hover:border-transparent cursor-default' : 'cursor-pointer'
      )}
      style={{
        opacity: isDragging && selected ? 0.4 : 1,
        transition,
        transform: isSorting ? undefined : CSS.Translate.toString(transform)
      }}
      {...listeners}
      {...attributes}
      tabIndex={-1}
      onMouseDown={event => {
        if (!disabled && !event.shiftKey && !(event.ctrlKey || event.metaKey) && !selected) {
          onClick?.(option, KeyMode.None);
        }
      }}
      onClick={event => {
        if (!disabled && (event.shiftKey || event.ctrlKey || event.metaKey)) {
          onClick?.(option, event.shiftKey ? KeyMode.Shift : KeyMode.Ctrl);
        } else if (!disabled && selected && !event.shiftKey && !(event.ctrlKey || event.metaKey)) {
          onClick?.(option, KeyMode.None);
        }
      }}
    >
      <div className="text-sm flex items-center">
        <IconDrag
          size={12}
          className="mx-0.5 invisible group-hover:visible"
        />
        {option.title}
      </div>
      {/* 拖拽时显示的一条直线 */}
      <div
        className={cx(
          'absolute w-full h-8 -top-[5px] border border-solid border-transparent ',
          over?.id.toString() === option.key && 'border-t-primary-100'
        )}
      />
    </div>
  );
};

export const OverlayOption = ({ option }: OverlayOptionProps) => {
  return (
    <div className="select-none flex items-center cursor-move border border-solid border-gray-500 h-6 w-[182px] rounded-lg !bg-gray-800/80 backdrop-blur-xs">
      <IconDrag
        size={12}
        className="ml-0.5 text-gray-300 cursor-move"
      />
      <span className={cx('ml-0.5 truncate text-sm leading-6')}>{option?.title}</span>
    </div>
  );
};
