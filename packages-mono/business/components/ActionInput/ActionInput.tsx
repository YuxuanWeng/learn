import { FocusEvent, KeyboardEvent, forwardRef, useRef, useState } from 'react';
import cx from 'classnames';
import { usePropsValue } from '@fepkg/common/hooks';
import { Button } from '@fepkg/components/Button';
import { Input, InputChangeEvent } from '@fepkg/components/Input';
import { Tooltip } from '@fepkg/components/Tooltip';
import { IconDecoration1, IconEdit } from '@fepkg/icon-park-react';
import { useMergeRefs } from '@floating-ui/react';
import { ActionInputProps } from './types';

const alwaysValid = async () => true;

export const ActionInput = forwardRef<HTMLInputElement, ActionInputProps>(
  (
    {
      containerCls,
      displayCls,
      prefix = <IconDecoration1 size={24} />,
      suffix,
      triggerIcon = <IconEdit />,
      showTrigger,
      error,
      defaultValue,
      maxLength = 10,
      value,
      onChange,
      onBlur,
      onEnterPress,
      onValidate = alwaysValid,
      onSubmit,
      spaceLegal = false,
      ...restProps
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const mergedRefs = useMergeRefs([ref, inputRef]);

    const [editing, setEditing] = useState(false);

    const [innerValue, setInnerValue] = usePropsValue({
      defaultValue,
      value
    });
    const [innerError, setInnerError] = usePropsValue({
      defaultValue: error ?? false,
      value: error
    });

    const handleChange = (val: string, evt: InputChangeEvent<HTMLInputElement>) => {
      if (spaceLegal) {
        setInnerValue(val);
        onChange?.(val, evt);
      } else {
        const trimValue = val.trim();
        setInnerValue(trimValue);
        onChange?.(trimValue, evt);
      }
    };

    const handleEdit = () => {
      // 不论如何，只要切换到input，此时的input都不应该是错误状态
      setInnerError(false);
      setEditing(true);
      // 切换到编辑状态时，需要去掉原本有的空格
      setInnerValue(v => v?.trim());

      requestAnimationFrame(() => inputRef.current?.focus());
    };

    const handleBlur = async (evt: FocusEvent<HTMLInputElement>) => {
      setEditing(false);
      setInnerError(false);

      const val = evt.currentTarget.value;
      const valid = await onValidate?.(val);
      // 校验，不通过的话，setInnerValue 为 defaultValue
      if (valid) onSubmit?.(val);
      else setInnerValue(defaultValue);

      onBlur?.(evt);
    };

    const handleEnterPress = async (val: string, evt: KeyboardEvent<HTMLInputElement>, composing: boolean) => {
      // 如果不是正在输入中文，进行提交
      if (!composing) {
        const valid = await onValidate?.(val);
        // 校验，通过的话，setEditing(false)
        if (valid) {
          setEditing(false);
          onSubmit?.(val);
        } else {
          setInnerError(true);
        }
      }

      onEnterPress?.(val, evt, composing);
    };

    return (
      <div className={cx('inline-flex items-center gap-1', containerCls)}>
        {prefix && <div className="w-6 h-6 text-primary-100">{prefix}</div>}

        {editing ? (
          <Input
            ref={mergedRefs}
            padding={[0, 12]}
            error={innerError}
            value={innerValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onEnterPress={handleEnterPress}
            maxLength={maxLength}
            {...restProps}
          />
        ) : (
          // 行情看板可复制，多次复制后将会有名称超出的情况
          <Tooltip
            truncate
            content={innerValue}
          >
            <span className={cx('text-sm truncate text-gray-000', displayCls)}>{innerValue}</span>
          </Tooltip>
        )}

        {showTrigger && !editing && (
          <Button.Icon
            text
            icon={triggerIcon}
            onClick={handleEdit}
          />
        )}
        {suffix}
      </div>
    );
  }
);
