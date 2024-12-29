import { useMemo, useState } from 'react';
import cx from 'classnames';
import { Button } from '@fepkg/components/Button';
import { Caption } from '@fepkg/components/Caption';
import { Modal, ModalUtils } from '@fepkg/components/Modal';
import { Placeholder } from '@fepkg/components/Placeholder';
import { Radio, RadioGroup } from '@fepkg/components/Radio';
import { TableSorterOrder } from '@fepkg/components/Table';
import { IconAddCircle, IconDelete, IconDrag } from '@fepkg/icon-park-react';
import { QuoteSortedField } from '@fepkg/services/types/bds-enum';
import { DndContext, DragOverEvent, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { FloatingPortal } from '@floating-ui/react';
import { ConfigModal } from './ConfigModal';
import { CustomSortingProvider, useCustomSorting } from './provider';
import { CustomSortOption, CustomSortingProps } from './types';

const PLACEHOLDER_OPTION_KEY = QuoteSortedField.FieldNone;

const Header = () => {
  const { setConfigModalVisible } = useCustomSorting();
  return (
    <div className="flex items-center justify-between">
      <Caption>
        <span className="text-gray-000">排序条件</span>
      </Caption>
      <Button.Icon
        text
        icon={<IconAddCircle size={16} />}
        tooltip={{ content: '配置字段', placement: 'top' }}
        throttleWait={500}
        onClick={() => {
          setConfigModalVisible(true);
        }}
      />
    </div>
  );
};

const always = () => true;

const OptionItem = ({
  value,
  disabled,
  className
}: {
  disabled?: boolean;
  value: CustomSortOption;
  className?: string;
}) => {
  const { updateOption, deleteOptions } = useCustomSorting();
  const { attributes, listeners, isDragging, setNodeRef, transition, over } = useSortable({
    id: value.sortedField,
    animateLayoutChanges: always,
    data: { id: value.sortedField }
  });

  const showLine = over?.id === value.sortedField;

  if (value.sortedField === PLACEHOLDER_OPTION_KEY) {
    return (
      <div
        ref={setNodeRef}
        className={cx(
          'border border-solid border-transparent absolute bottom-8 min-h-[32px] w-[371px] m-auto',
          over?.id === PLACEHOLDER_OPTION_KEY && 'border-t-primary-200'
        )}
      />
    );
  }

  return (
    <div
      className={cx(
        'flex flex-col hover:bg-gray-500 rounded-lg justify-center',
        isDragging && '!text-gray-300',
        className
      )}
      ref={setNodeRef}
      style={{ transition }}
      {...listeners}
      {...attributes}
      tabIndex={-1}
    >
      {/* 拖拽时显示的一条直线 */}
      <div className={cx('border border-solid border-transparent', showLine && 'border-t-primary-200')} />
      <div className="flex flex-row items-center min-h-[32px] group">
        <IconDrag
          className="hidden cursor-grab ml-1 group-hover:block"
          size={16}
        />
        <div className="w-4 ml-1 group-hover:hidden" />
        <div className="flex gap-10 items-center">
          <span className="ml-1 w-20">{value.label}</span>
          <RadioGroup
            value={[value.order ?? TableSorterOrder.DESC]}
            onChange={val => {
              updateOption(value.sortedField, val[0] as TableSorterOrder);
            }}
            className="!gap-10"
          >
            {value.radioGroup.map(item => (
              <Radio
                disabled={isDragging || disabled}
                value={item.value}
                key={item.value}
              >
                {item.label}
              </Radio>
            ))}
          </RadioGroup>
        </div>

        <Button.Icon
          text
          className={cx('hidden ml-2', !disabled && 'group-hover:block')}
          icon={<IconDelete className="hover:text-primary-000" />}
          onClick={() => {
            deleteOptions(value.sortedField);
          }}
        />
      </div>
    </div>
  );
};

const Options = () => {
  const { options, updateSort } = useCustomSorting();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 20 } }));

  const [activeId, setActiveId] = useState<QuoteSortedField | null>(null);

  const activeInfo = useMemo(() => {
    for (let i = 0, len = options.length; i < len; i++) {
      const item = options[i];
      if (activeId === options[i].sortedField) return { index: i, item };
    }
    return { index: 0 };
  }, [activeId, options]);

  const handleDragStart = ({ active }) => {
    setActiveId(active.id);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const handleDragEnd = (event: DragOverEvent) => {
    if (!event.active?.id) return;
    const dragValue = event.active.id as QuoteSortedField;
    const dropValue = event.over?.id as QuoteSortedField | undefined;
    if (dropValue === undefined) return;

    updateSort(dragValue, dropValue === PLACEHOLDER_OPTION_KEY ? undefined : dropValue);
  };

  const optionKeys = options.map(v => v.sortedField);

  return (
    <div
      className="rounded-lg bg-gray-600 h-[304px] flex flex-col gap-3 p-3 overflow-x-hidden overflow-y-overlay"
      onMouseUp={() => {
        handleDragCancel();
      }}
    >
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={optionKeys}>
          {options.map(v => (
            <OptionItem
              key={v.sortedField}
              value={v}
            />
          ))}
        </SortableContext>
        <FloatingPortal id="floating-container-custom-sort">
          <DragOverlay
            dropAnimation={null}
            adjustScale
            zIndex={1070}
          >
            {activeInfo.item && (
              <div className="flex justify-between items-center border border-solid border-gray-500 h-8 rounded-lg !bg-gray-800/80 backdrop-blur-xs">
                <OptionItem
                  className="!bg-transparent !text-gray-300"
                  disabled
                  key={activeInfo.item.sortedField}
                  value={activeInfo.item}
                />
              </div>
            )}
          </DragOverlay>
        </FloatingPortal>
      </DndContext>
    </div>
  );
};

const Container = () => {
  const { options, setConfigModalVisible } = useCustomSorting();
  if (!options.filter(v => v.sortedField !== QuoteSortedField.FieldNone).length) {
    return (
      <div className="h-[364px] flex flex-col items-center relative">
        <Placeholder
          type="no-setting"
          size="xs"
          label={
            <div className=" flex items-center text-gray-200 flex-col gap-3">
              <span>暂未配置字段</span>
              <Button onClick={() => setConfigModalVisible(true)}>去配置</Button>
            </div>
          }
        />
      </div>
    );
  }
  return (
    <div className="p-3 flex flex-col gap-3 select-none">
      <Header />
      <Options />
    </div>
  );
};

const Wrapper = (props: CustomSortingProps) => {
  const { visible, onCancel, onConfirm } = props;
  const { getStateOptions, hasChanged } = useCustomSorting();

  /** 判断是否发生过修改 */
  const handleClose = () => {
    if (hasChanged()) {
      ModalUtils.warn({
        title: '退出编辑',
        content: '您本次更改的内容将不会保存，确定退出编辑吗？',
        okText: '确定',
        cancelText: '继续编辑',
        onOk: onCancel
      });
    } else {
      onCancel?.();
    }
  };

  const handleConfirm = () => {
    onConfirm?.(getStateOptions());
    onCancel?.();
  };

  return (
    <>
      <Modal
        keyboard
        draggable={false}
        confirmByEnter
        visible={visible}
        width={420}
        title="自定义排序"
        onCancel={handleClose}
        onConfirm={handleConfirm}
        footerProps={{ centered: true, confirmBtnProps: { label: '保存' } }}
      >
        <Container />
      </Modal>
      <ConfigModal />
    </>
  );
};

export const CustomSorting = (props: CustomSortingProps) => {
  if (!props.visible) return null;
  return (
    <CustomSortingProvider initialState={{ defaultOptions: props.options }}>
      <Wrapper {...props} />
    </CustomSortingProvider>
  );
};
