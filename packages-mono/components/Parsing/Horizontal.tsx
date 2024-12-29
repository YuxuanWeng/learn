import { forwardRef, useId } from 'react';
import cx from 'classnames';
import { usePropsValue } from '@fepkg/common/hooks';
import { Button } from '../Button';
import { InputChangeEvent, TextArea } from '../Input';
import { ParsingProps } from './types';

export const Horizontal = forwardRef<HTMLTextAreaElement, ParsingProps>(
  (
    {
      containerCls,
      error,
      errorText = '券码未能识别，请清空后重新复制识别！',
      controllers = ['primary', 'secondary'],
      controllersExtra,
      primaryBtnProps,
      secondaryBtnProps,
      onPrimaryClick,
      onSecondaryClick,
      id,
      className,
      controllerCls,
      size = 'xs',
      padding = [7, 11],
      rounded = true,
      placeholder = '粘贴代码或简称至识别框内进行识别',
      rows = 5,
      defaultValue,
      value,
      onChange,
      ...restTextAreaProps
    },
    ref
  ) => {
    const randomId = useId();
    const inputId = id ?? randomId;

    const [innerValue, setInnerValue] = usePropsValue({
      defaultValue,
      value
    });

    const trimmedInnerValue = innerValue?.trim();
    const showController = !!controllers.length;

    const handleChange = (val: string, evt: InputChangeEvent<HTMLTextAreaElement>) => {
      setInnerValue(val);
      onChange?.(val, evt);
    };

    return (
      <label
        htmlFor={inputId}
        className={cx('flex gap-px h-[94px] bg-gray-800', rounded && 'rounded-lg', containerCls)}
      >
        <TextArea
          {...restTextAreaProps}
          id={inputId}
          ref={ref}
          className={cx('bg-gray-800', className)}
          size={size}
          padding={padding}
          rows={rows}
          placeholder={placeholder}
          defaultValue={defaultValue}
          value={innerValue}
          onChange={handleChange}
        />

        {showController && (
          <div
            className={cx(
              'flex-shrink-0 flex flex-col gap-3 p-3 border-0 border-l border-solid border-gray-600',
              controllerCls
            )}
            aria-valuetext="controllers"
          >
            {controllers?.slice(0, 2)?.map(controller => {
              if (controller === 'primary') {
                return (
                  <div
                    key={controller}
                    className="s-parsing-primary-container flex flex-1 gap-3"
                  >
                    <Button
                      tabIndex={-1}
                      type="primary"
                      {...primaryBtnProps}
                      className={cx('s-parsing-primary-btn flex-1 def:w-22 def:h-7', primaryBtnProps?.className)}
                      disabled={!trimmedInnerValue || primaryBtnProps?.disabled}
                      onClick={evt => {
                        if (innerValue) onPrimaryClick?.(innerValue, evt);
                      }}
                    >
                      {primaryBtnProps?.label ?? '开始识别'}
                    </Button>

                    {controllersExtra?.primary}
                  </div>
                );
              }

              if (controller === 'secondary') {
                return (
                  <div
                    key={controller}
                    className="s-parsing-secondary-container flex flex-1 gap-3"
                  >
                    <Button
                      tabIndex={-1}
                      type="gray"
                      plain
                      {...secondaryBtnProps}
                      className={cx('s-parsing-secondary-btn flex-1 def:w-22 def:h-7', secondaryBtnProps?.className)}
                      disabled={!trimmedInnerValue || secondaryBtnProps?.disabled}
                      onClick={evt => {
                        if (innerValue) onSecondaryClick?.(innerValue, evt);
                      }}
                    >
                      {secondaryBtnProps?.label ?? '高级识别'}
                    </Button>

                    {controllersExtra?.secondary}
                  </div>
                );
              }

              return null;
            })}
          </div>
        )}
      </label>
    );
  }
);
