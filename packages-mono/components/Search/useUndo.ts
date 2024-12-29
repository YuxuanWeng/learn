import { Dispatch, KeyboardEvent, SetStateAction, useState } from 'react';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { useMemoizedFn } from 'ahooks';

export const handleUndoKeyDown = (evt: KeyboardEvent<HTMLInputElement>, undo: () => void, redo: () => void) => {
  const { isMac } = window.System;

  if (isMac) {
    if (evt.key.toLowerCase() === KeyboardKeys.KeyZ && evt.metaKey) {
      if (evt.shiftKey) {
        redo();
      } else {
        undo();
      }

      evt.preventDefault();
    }
  } else {
    if (evt.key.toLowerCase() === KeyboardKeys.KeyZ && evt.ctrlKey) {
      undo();
      evt.preventDefault();
    }

    if (evt.key.toLowerCase() === KeyboardKeys.KeyY && evt.ctrlKey) {
      redo();
      evt.preventDefault();
    }
  }
};

export const useUndo = (inputValue: string, setInputValue: Dispatch<SetStateAction<string>>) => {
  // 撤销栈
  // 当选中选项时，清空栈并 push 选中选项的 value
  // 每次focus时若 value 改变则 push value
  const [undoStack, setUndoStack] = useState<string[]>([]);
  // 当前 undo 的 index，为 null 时则没有进行过 undo
  const [undoIndex, setUndoIndex] = useState<number>();
  // redo 后要恢复的值，为 undo 之前的 inputValue
  const [redoValue, setRedoValue] = useState('');

  const intoStack = useMemoizedFn((val: string) => {
    if (undoIndex != null) return;
    if (val !== undoStack[undoStack.length - 1]) {
      setUndoStack(prev => [...prev, val]);
    }
  });

  const undo = useMemoizedFn(() => {
    let undoValue = '';
    if (undoIndex != null) {
      undoValue = undoStack[undoIndex - 1];
    } else {
      undoValue = undoStack[undoStack.length - 1];
      if (undoValue === inputValue) {
        undoValue = undoStack[undoStack.length - 2];
      }
    }

    if (undoValue == null) return;

    if (undoIndex != null && undoStack[undoIndex - 1] == null) return;

    if (undoIndex == null) {
      setRedoValue(inputValue);
      if (undoValue === inputValue) {
        setUndoIndex(undoStack.length - 2);
      } else {
        setUndoIndex(undoStack.length - 1);
      }
    } else {
      setUndoIndex(undoIndex - 1);
    }

    setInputValue(undoValue);
  });

  const redo = useMemoizedFn(() => {
    if (undoIndex == null) return;

    const target = undoStack[undoIndex + 1] ?? redoValue;
    if (target === inputValue) return;

    setInputValue(target);
    setUndoIndex(undoIndex >= undoStack.length - 1 ? undefined : undoIndex + 1);
  });

  return { undoStack, setUndoStack, undoIndex, setUndoIndex, redoValue, intoStack, undo, redo };
};
