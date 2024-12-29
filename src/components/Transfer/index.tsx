import { useMemo, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { FloatingPortal } from '@floating-ui/react';
import { v4 } from 'uuid';
import { TransferProvider } from '@/components/Transfer/context';
import { ButtonGroup } from './ButtonGroup';
import { Container } from './Container';
import { OverlayOption } from './Option';
import { KeyMode, Position, TransferOption, TransferProps } from './types';
import { getSortOptions, sortSelectedKeys } from './utils';

const TransferInner = (props: TransferProps) => {
  const { options, sourceTitle, targetTitle, sourceKeys, targetKeys, onChange, disabled } = props;
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 0 } }));

  const [leftContainerId] = useState(() => v4());
  const [rightContainerId] = useState(() => v4());

  const [leftCheckedKey, setLeftCheckedKey] = useState<string>();
  const [rightCheckedKey, setRightCheckedKey] = useState<string>();
  const [leftSelectedKeys, setLeftSelectedKeys] = useState<string[]>([]);
  const [rightSelectedKeys, setRightSelectedKeys] = useState<string[]>([]);

  const leftData = useMemo(() => getSortOptions(options, sourceKeys), [options, sourceKeys]);
  const rightData = useMemo(() => getSortOptions(options, targetKeys), [options, targetKeys]);

  const handleDragEnd = (event: DragEndEvent) => {
    if (!event.active?.id) return;
    const dropValue = event.over?.id.toString();
    if (!dropValue) return;
    const containerFrom = event.active?.data.current?.sortable.containerId;
    const containerTo = event.over?.data.current ? event.over?.data.current?.sortable.containerId : event.over?.id;

    if (containerTo == leftContainerId) {
      let targetIndex: number;
      if (dropValue === leftContainerId) {
        targetIndex = sourceKeys.length;
      } else {
        targetIndex = sourceKeys.findIndex(key => key === dropValue);
      }
      const upKeys = sourceKeys.slice(0, targetIndex);
      const downKeys = sourceKeys.slice(targetIndex);
      if (containerFrom == leftContainerId) {
        // move left to left
        const resultKeys = [
          ...upKeys.filter(item => !leftSelectedKeys.includes(item)),
          ...leftSelectedKeys,
          ...downKeys.filter(item => !leftSelectedKeys.includes(item))
        ];
        onChange(resultKeys, targetKeys);
      } else {
        // move right to left
        const rightResultKeys = targetKeys.filter(key => !rightSelectedKeys.includes(key));
        const leftResultKeys = [...upKeys, ...rightSelectedKeys, ...downKeys];
        setLeftSelectedKeys(rightSelectedKeys);
        setRightSelectedKeys([]);
        onChange(leftResultKeys, rightResultKeys);
      }
    } else {
      let targetIndex: number;
      if (dropValue === rightContainerId) {
        targetIndex = targetKeys.length;
      } else {
        targetIndex = targetKeys.findIndex(key => key === dropValue);
      }
      const upKeys = targetKeys.slice(0, targetIndex);
      const downKeys = targetKeys.slice(targetIndex);
      if (containerFrom == leftContainerId) {
        // move left to right
        const leftResultKeys = sourceKeys.filter(key => !leftSelectedKeys.includes(key));
        const rightResultKeys = [...upKeys, ...leftSelectedKeys, ...downKeys];
        setRightSelectedKeys(leftSelectedKeys);
        setLeftSelectedKeys([]);
        onChange(leftResultKeys, rightResultKeys);
      } else {
        // move right to right
        const resultKeys = [
          ...upKeys.filter(item => !rightSelectedKeys.includes(item)),
          ...rightSelectedKeys,
          ...downKeys.filter(item => !rightSelectedKeys.includes(item))
        ];
        onChange(sourceKeys, resultKeys);
      }
    }
  };

  const onOneToRightClick = () => {
    if (leftSelectedKeys.length) {
      onChange(
        sourceKeys.filter(key => !leftSelectedKeys.includes(key)),
        targetKeys.concat(leftSelectedKeys)
      );
      setLeftCheckedKey(void 0);
      setLeftSelectedKeys([]);
    } else {
      const [first] = sourceKeys;
      setLeftCheckedKey(first);
      setLeftSelectedKeys([first]);
      setRightSelectedKeys([]);
    }
  };

  const onOneToLeftClick = () => {
    if (rightSelectedKeys.length) {
      onChange(
        sourceKeys.concat(rightSelectedKeys),
        targetKeys.filter(key => !rightSelectedKeys.includes(key))
      );
      setRightCheckedKey(void 0);
      setRightSelectedKeys([]);
    } else {
      const [first] = targetKeys;
      setRightCheckedKey(first);
      setRightSelectedKeys([first]);
      setLeftSelectedKeys([]);
    }
  };

  const onAllToRightClick = () => {
    setLeftCheckedKey(void 0);
    setLeftSelectedKeys([]);
    onChange([], targetKeys.concat(sourceKeys));
  };

  const onAllToLeftClick = () => {
    setRightCheckedKey(void 0);
    setRightSelectedKeys([]);
    onChange(sourceKeys.concat(targetKeys), []);
  };

  const onLeftAreaClick = (item: TransferOption, keyMode: KeyMode) => {
    setRightSelectedKeys([]);
    if (keyMode === KeyMode.Ctrl) {
      if (!leftSelectedKeys.includes(item.key)) {
        setLeftSelectedKeys(keys => sortSelectedKeys(sourceKeys, keys.concat(item.key)));
      } else {
        setLeftSelectedKeys(keys =>
          sortSelectedKeys(
            sourceKeys,
            keys.filter(key => key !== item.key)
          )
        );
      }
    } else if (keyMode === KeyMode.Shift) {
      if (leftSelectedKeys.length === 0) {
        setLeftSelectedKeys([item.key]);
      } else if (leftCheckedKey) {
        const leftCheckedItemIndex = sourceKeys.findIndex(k => k === leftCheckedKey);
        const clickItemIndex = sourceKeys.findIndex(k => k === item.key);
        if (leftCheckedItemIndex < clickItemIndex) {
          setLeftSelectedKeys(sourceKeys.slice(leftCheckedItemIndex, clickItemIndex + 1));
        } else {
          setLeftSelectedKeys(sourceKeys.slice(clickItemIndex, leftCheckedItemIndex + 1));
        }
      }
      if (!leftCheckedKey) setLeftCheckedKey(item.key);
      return;
    } else {
      setLeftSelectedKeys([item.key]);
    }
    setLeftCheckedKey(item.key);
  };

  const onRightAreaClick = (item: TransferOption, keyMode: KeyMode) => {
    setLeftSelectedKeys([]);
    if (keyMode === KeyMode.Ctrl) {
      if (!rightSelectedKeys.includes(item.key)) {
        setRightSelectedKeys(keys => sortSelectedKeys(targetKeys, keys.concat(item.key)));
      } else {
        setRightSelectedKeys(keys =>
          sortSelectedKeys(
            targetKeys,
            keys.filter(key => key !== item.key)
          )
        );
      }
    } else if (keyMode === KeyMode.Shift) {
      if (rightSelectedKeys.length === 0) {
        setRightSelectedKeys([item.key]);
      } else if (rightCheckedKey) {
        const rightCheckedItemIndex = targetKeys.findIndex(k => k === rightCheckedKey);
        const clickItemIndex = targetKeys.findIndex(k => k === item.key);
        if (rightCheckedItemIndex < clickItemIndex) {
          setRightSelectedKeys(targetKeys.slice(rightCheckedItemIndex, clickItemIndex + 1));
        } else {
          setRightSelectedKeys(targetKeys.slice(clickItemIndex, rightCheckedItemIndex + 1));
        }
      }
      if (!rightCheckedKey) setRightCheckedKey(item.key);
      return;
    } else {
      setRightSelectedKeys([item.key]);
    }
    setRightCheckedKey(item.key);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="flex">
        <Container
          id={leftContainerId}
          title={sourceTitle}
          position={Position.Left}
          options={leftData}
          keys={sourceKeys}
          selectedKeys={leftSelectedKeys}
          onClick={onLeftAreaClick}
        />
        <ButtonGroup
          disabled={disabled}
          toLeftDisabled={targetKeys.length < 1}
          toRightDisabled={sourceKeys.length < 1}
          onOneToRightClick={onOneToRightClick}
          onOneToLeftClick={onOneToLeftClick}
          onAllToRightClick={onAllToRightClick}
          onAllToLeftClick={onAllToLeftClick}
        />
        <Container
          id={rightContainerId}
          title={targetTitle}
          position={Position.Right}
          options={rightData}
          keys={targetKeys}
          selectedKeys={rightSelectedKeys}
          onClick={onRightAreaClick}
        />
      </div>
      <FloatingPortal id="floating-container">
        {/* 拖拽时候的样式 */}
        <DragOverlay
          dropAnimation={null}
          zIndex={1070}
        >
          <div className="flex flex-col gap-2">
            {[...leftSelectedKeys, ...rightSelectedKeys].map(key => {
              const option = options.find(o => o.key === key);
              return (
                <OverlayOption
                  key={key}
                  option={option}
                />
              );
            })}
          </div>
        </DragOverlay>
      </FloatingPortal>
    </DndContext>
  );
};

export const Transfer = (props: TransferProps) => {
  return (
    <TransferProvider>
      <TransferInner {...props} />
    </TransferProvider>
  );
};
