import { forwardRef, useId } from 'react';
import cx from 'classnames';
import { usePropsValue } from '@fepkg/common/hooks';
import { IconDelete } from '@fepkg/icon-park-react';
import { Button } from '../Button';
import { InputChangeEvent, TextArea } from '../Input';
import { ParsingProps } from './types';

export const Vertical = forwardRef<HTMLTextAreaElement, ParsingProps>(
  (
    {
      containerCls,
      error,
      errorText = '券码未能识别，请清空后重新复制识别！',
      controllers = ['secondary', 'primary'],
      primaryBtnProps,
      secondaryBtnProps,
      onPrimaryClick,
      onSecondaryClick,
      id,
      className,
      size = 'xs',
      padding = [15],
      rounded = true,
      placeholder = '粘贴代码或简称至识别框内进行识别',
      rows = 5,
      defaultValue,
      value,
      onChange,
      loading,
      ...restTextAreaProps
    },
    ref
  ) => {
    const randomId = useId();
    const inputId = id ?? randomId;

    /** 是否受控 */
    const controlled = value !== undefined;

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
        className={cx(
          'flex flex-col w-[328px] bg-gray-800 border border-solid',
          rounded && 'rounded',
          error
            ? 'border-danger-200 focus-within:bg-danger-600'
            : 'border-transparent focus-within:bg-primary-700 hover:border-primary-100 focus-within:border-primary-200',
          containerCls
        )}
      >
        <TextArea
          {...restTextAreaProps}
          id={inputId}
          ref={ref}
          className={cx('!bg-transparent !border-transparent', className)}
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
            className="flex h-6 gap-4 px-4"
            aria-valuetext="controllers"
          >
            {controllers?.slice(0, 2)?.map(controller => {
              if (controller === 'primary') {
                return (
                  <Button
                    loading={loading}
                    key={controller}
                    className="s-parsing-primary-btn flex-1 h-full !transition-none"
                    icon={<IconDelete />}
                    {...primaryBtnProps}
                    disabled={error || !trimmedInnerValue || primaryBtnProps?.disabled}
                    onClick={evt => {
                      if (innerValue) onPrimaryClick?.(innerValue, evt);
                    }}
                  >
                    {primaryBtnProps?.label ?? '开始识别'}
                  </Button>
                );
              }

              if (controller === 'secondary') {
                return (
                  <Button
                    key={controller}
                    className="s-parsing-secondary-btn flex-1 h-full !transition-none"
                    icon={<IconDelete />}
                    {...secondaryBtnProps}
                    disabled={!trimmedInnerValue || secondaryBtnProps?.disabled}
                    onClick={evt => {
                      if (innerValue) onSecondaryClick?.(innerValue, evt);
                      /** 如果非受控，则默认清空内部值 */
                      if (!controlled) handleChange('', evt);
                    }}
                  >
                    {secondaryBtnProps?.label ?? '清空'}
                  </Button>
                );
              }

              return null;
            })}
          </div>
        )}

        <div className="flex-shrink-0 h-4 px-4 text-xs text-danger-200 select-none">{error ? errorText : void 0}</div>
      </label>
    );
  }
);
