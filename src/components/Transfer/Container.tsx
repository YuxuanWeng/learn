import { memo } from 'react';
import cx from 'classnames';
import { Caption } from '@fepkg/components/Caption';
import { Placeholder } from '@fepkg/components/Placeholder';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { useTransferState } from '@/components/Transfer/context';
import { SortableOption } from './Option';
import { ContainerPlaceholderProps, ContainerProps, Position } from './types';

const ContainerPlaceholder = ({ showPlaceholder, title }: ContainerPlaceholderProps) => {
  if (showPlaceholder) {
    return (
      <Placeholder
        className="m-auto"
        type="no-setting"
        size="xs"
        label={`无${title ?? '数据'}`}
      />
    );
  }
  return null;
};

const MemoPlaceholder = memo(ContainerPlaceholder);

export const Container = ({ id, title, position, options, keys, selectedKeys, onClick }: ContainerProps) => {
  const { setNodeRef, over } = useDroppable({ id });
  const { leftRef, rightRef } = useTransferState();

  return (
    <div className="flex flex-col flex-1 h-[341px] py-3 pl-2 bg-gray-600 rounded-lg">
      {title && <Caption type={position === Position.Left ? 'primary' : 'orange'}>{title}</Caption>}
      <div className="component-dashed-x mt-2 mr-2" />
      <div
        ref={node => {
          setNodeRef(node);
          if (position === Position.Left) {
            leftRef.current = node;
          } else {
            rightRef.current = node;
          }
        }}
        className="relative flex-1 pr-2 pt-2 flex flex-col overlay-y-always"
      >
        <div className="h-max flex flex-col gap-2">
          <SortableContext
            id={id}
            items={keys}
          >
            {options.map(option => {
              const checked = !!selectedKeys?.find(key => key === option.key);
              return (
                <SortableOption
                  key={option.key}
                  option={option}
                  selected={checked}
                  onClick={onClick}
                />
              );
            })}
            {/* 拖拽时显示的一条直线 */}
            <div
              className={cx(
                'w-full -my-1 border border-solid border-transparent ',
                over?.id.toString() === id && 'border-t-primary-100'
              )}
            />
          </SortableContext>
        </div>
        <MemoPlaceholder
          showPlaceholder={!keys.length}
          title={title}
        />
      </div>
    </div>
  );
};
