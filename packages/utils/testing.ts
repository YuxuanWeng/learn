import { fireEvent } from '@testing-library/react';

/** 更改输入框内容 */
export const changeInput = (inputEl: HTMLInputElement | HTMLTextAreaElement, value?: string) => {
  fireEvent.change(inputEl, { target: { value } });
};

/** 模拟点击 label（fireEvent 是比较底层的事件，用户实际操作会是一系列的事件组合） */
export const clickEl = (el: HTMLElement) => {
  fireEvent.pointerDown(el);
  fireEvent.mouseDown(el);
  fireEvent.pointerUp(el);
  fireEvent.mouseUp(el);
  fireEvent.click(el);
  // clicking the label will trigger a click of the label.control
  // however, it will not focus the label.control so we have to do it
  // ourselves.
  // https://github.com/testing-library/react-testing-library/issues/276
  const labelEl = el as HTMLLabelElement;
  if (labelEl?.control) labelEl.control.focus();
};
