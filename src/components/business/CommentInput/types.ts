import { InputProps } from '@fepkg/components/Input';

export type CommentInputFlag =
  | 'flag_stock_exchange'
  | 'flag_bilateral'
  | 'flag_request'
  | 'flag_indivisible'
  | 'comment_flag_bridge'
  | 'comment_flag_pay_for';
export type CommentInputFlagOption = { label: string; value: CommentInputFlag };
export type CommentInputFlagValue = { [k in CommentInputFlag]?: boolean };

export type CommentInputValue = {
  /** 备注输入内容 */
  comment: string;
  /** flag value */
  flagValue?: CommentInputFlagValue;
};

export type CommentInputProps = Omit<InputProps, 'defaultValue' | 'value' | 'onChange'> & {
  /** input className */
  inputCls?: string;
  /** checkbox className */
  checkboxCls?: string;
  /** Checkbox类型，可选为button，默认为checkbox */
  flagType?: 'checkbox' | 'button';
  /** flag 选项列表 */
  flagOptions?: CommentInputFlagOption[];
  /** CommentInput 默认的 value */
  defaultValue?: CommentInputValue;
  /** CommentInput value */
  value?: CommentInputValue;
  /** Comment 整体状态变更时的回调 */
  onChange?: (val: CommentInputValue) => void;
};
