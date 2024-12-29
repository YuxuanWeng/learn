import { forwardRef } from 'react';
import { CommentInput, CommentInputProps } from '@/components/business/CommentInput';
import { useCalcFooter } from './CalcFooterProvider';

export const Comment = forwardRef<HTMLInputElement, CommentInputProps>(({ onChange, className, ...restProps }, ref) => {
  const { footerValue, setFooterValue } = useCalcFooter();

  return (
    <CommentInput
      className={className}
      ref={ref}
      value={footerValue}
      onChange={val => {
        if (onChange) onChange?.(val);
        else setFooterValue(val);
      }}
      composition
      onEnterPress={(_, evt, composing) => {
        // 如果按下 shift 键，仅换行，不进行其他操作
        if (evt.shiftKey) return;
        // 如果正在输入中文，阻止提交
        if (composing) {
          evt.stopPropagation();
        }
      }}
      {...restProps}
    />
  );
});
