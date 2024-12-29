import { isTextInputElement } from '@fepkg/common/utils/element';
import { DataInputType } from '@/components/business/Quote/constants';

/** 在价、量、返点的Input组件中已注入data-input-type={DataInputType}属性 */
export const isQuoteInputElement = (element?: Element | null): element is HTMLInputElement => {
  if (isTextInputElement(element) && element.dataset.inputType === DataInputType) return true;
  return false;
};
