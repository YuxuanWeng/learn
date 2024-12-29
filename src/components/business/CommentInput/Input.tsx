import { forwardRef, useId } from 'react';
import cx from 'classnames';
import { usePropsValue } from '@fepkg/common/hooks';
import { CheckboxGroup } from '@fepkg/components/Checkbox';
import { Input } from '@fepkg/components/Input';
import { RadioButton } from '@fepkg/components/Radio';
import { defaultFlagOptions } from './constants';
import { CommentInputFlagValue, CommentInputProps, CommentInputValue } from './types';

const MAX_LEN = 30;

export const CommentInput = forwardRef<HTMLInputElement, CommentInputProps>(
  (
    {
      id,
      // 默认样式
      className = 'items-end gap-1',
      checkboxCls = 'w-[324px] gap-4 !rounded-lg',
      inputCls,
      flagType = 'checkbox',
      flagOptions = defaultFlagOptions,
      defaultValue = { comment: '' },
      value,
      onChange,
      ...restProps
    },
    ref
  ) => {
    const randomId = useId();
    const inputId = id ?? randomId;

    const defaultOptionsValues = flagOptions
      .map(v => v.value)
      .reduce((result, key) => {
        result[key] = false;
        return result;
      }, {});

    const [innerValue, setInnerValue] = usePropsValue<CommentInputValue>({
      defaultValue,
      value
    });

    const handleInputChange = (val: string) => {
      const mergedValue = { ...innerValue, comment: val };
      setInnerValue(mergedValue);
      onChange?.(mergedValue);
    };

    const handleFlagChange = (val: CommentInputFlagValue) => {
      const mergedValue = { ...innerValue, flagValue: val };
      setInnerValue(mergedValue);
      onChange?.(mergedValue);
    };

    return (
      <label
        htmlFor={inputId}
        className={cx('flex flex-col', className)}
      >
        <Input
          id={id}
          ref={ref}
          label="备注"
          labelWidth={72}
          className={cx('bg-gray-800 text-gray-000', inputCls)}
          padding={[0, 12]}
          placeholder="请输入"
          maxLength={MAX_LEN}
          value={innerValue.comment}
          onChange={handleInputChange}
          {...restProps}
        />

        <CheckboxGroup
          className={cx('!bg-gray-600 !h-6', checkboxCls)}
          value={Object.keys(innerValue.flagValue ?? {}).filter(key => innerValue.flagValue?.[key])}
          // 以按钮形式展示的group不能传入options
          options={flagType === 'button' ? void 0 : flagOptions}
          onChange={val => {
            const updated = {};
            for (const v of val) {
              updated[v.toString()] = true;
            }
            handleFlagChange?.({ ...defaultOptionsValues, ...updated });
          }}
        >
          {flagOptions?.map(opt => (
            <RadioButton
              key={opt.value}
              className="!h-6 font-normal rounded-lg text-xs"
              type="checkbox"
              ctrl
              checked={innerValue.flagValue?.[opt.value]}
              value={opt.value}
            >
              {opt.label}
            </RadioButton>
          ))}
        </CheckboxGroup>
      </label>
    );
  }
);
