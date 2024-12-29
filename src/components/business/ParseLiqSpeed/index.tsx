import { KeyboardEvent, Ref, useEffect, useMemo, useRef, useState } from 'react';
import cx from 'classnames';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { Combination } from '@fepkg/components/Combination';
import { Input, InputChangeEvent, InputProps } from '@fepkg/components/Input';
import { Tooltip } from '@fepkg/components/Tooltip';
import { fetchParsingClearSpeed } from '@fepkg/services/api/parsing/clear-speed';
import { LiquidationSpeedTag } from '@fepkg/services/types/bds-enum';
import { LiquidationSpeed } from '@fepkg/services/types/common';
import { ParsingClearSpeed } from '@fepkg/services/types/parsing/clear-speed';
import { trim, uniqBy } from 'lodash-es';
import { formatLiquidationSpeedListToString } from '@/common/utils/liq-speed';

type ReqProps = Omit<ParsingClearSpeed.Request, 'user_input'>;

type ParseLiqSpeedProps = Omit<InputProps, 'defaultValue'> & {
  /** 额外的请求参数 */
  requestParams?: ReqProps;
  /** 结算方式默认值 */
  defaultValue?: LiquidationSpeed[];
  /** 是否禁用 */
  disabled?: boolean;
  /** input ref */
  inputRef?: Ref<HTMLInputElement>;
  /** 阻止识别 */
  isPreventParse?: (val?: string) => boolean;
  /** 输入框的回调函数 */
  onInputChange?: (val: string, evt?: InputChangeEvent<HTMLInputElement>) => void;
  /** 识别结果回调 */
  onParse?: (data?: LiquidationSpeed[]) => void;
  /** 按了空格键 */
  onSpaceKeydown?: () => void;
};

const WEEK_TAG = new Set([
  LiquidationSpeedTag.Monday,
  LiquidationSpeedTag.Tuesday,
  LiquidationSpeedTag.Wednesday,
  LiquidationSpeedTag.Thursday,
  LiquidationSpeedTag.Friday,
  LiquidationSpeedTag.Saturday,
  LiquidationSpeedTag.Sunday
]);

export const ParseLiqSpeed = ({
  defaultValue,
  disabled,
  inputRef,
  requestParams = {},
  isPreventParse,
  onInputChange,
  onParse,
  onSpaceKeydown,
  ...rest
}: ParseLiqSpeedProps) => {
  const memoDefaultValue = useMemo(
    () => formatLiquidationSpeedListToString(defaultValue ?? [], 'YYYY-MM-DD', true, '-') || '-',
    [defaultValue]
  );

  const [inputValue, setInputValue] = useState('');
  const [resultValue, setResultValue] = useState(memoDefaultValue);

  const compositing = useRef(false);

  let displayValue = inputValue ?? '';
  if (disabled) displayValue = '';

  // 同步结算备注面板的结算方式
  useEffect(() => {
    setResultValue(memoDefaultValue);
    setInputValue('');
  }, [defaultValue, memoDefaultValue]);

  const handleInputChange = (val: string) => {
    const trimmedVal = trim(val);
    setInputValue(trimmedVal);
    onInputChange?.(trimmedVal);
  };

  const handleKeyDown = async (evt: KeyboardEvent<HTMLInputElement>) => {
    if (isPreventParse?.(inputValue)) return;
    if (evt.key === ' ') {
      onSpaceKeydown?.();
      return;
    }
    if (evt.key !== KeyboardKeys.Enter) return;
    if (disabled) return;
    evt.stopPropagation();
    const parsingResult = await fetchParsingClearSpeed({ user_input: inputValue, ...requestParams });

    // 由于备注结算的offset是单选，故取识别结果的第一个结算方式的offset作为每一个结算方式的offset
    const firstOffset = parsingResult.clear_speeds?.find(v => (v.tag && WEEK_TAG.has(v.tag)) || !!v.date)?.offset ?? 0;

    const firstDate = parsingResult.clear_speeds?.find(v => !!v.date);

    const formatClearSpeeds = parsingResult.clear_speeds
      ?.map(v => {
        if ((v.tag && WEEK_TAG.has(v.tag)) || !!v.date) {
          // 周几标签，offset统一设置为第一个周几标签的offset
          return { ...v, offset: firstOffset };
        }
        return v;
      })
      .filter(v => !v.date);

    // 去重
    const uniqSpeeds = uniqBy(formatClearSpeeds, item => {
      if (item.tag && WEEK_TAG.has(item.tag)) return `${item.tag}_${item.date}`;
      return `${item.tag}_${item.date}_${item.offset}`;
    });

    if (firstDate) uniqSpeeds.push({ ...firstDate, offset: firstOffset });
    onParse?.(uniqSpeeds);
    setInputValue('');
    setResultValue(formatLiquidationSpeedListToString(uniqSpeeds ?? [], 'YYYY-MM-DD', true, '-') || '-');
  };

  return (
    <Combination
      disabled={disabled}
      size="sm"
      containerCls="w-[276px]"
      prefixNode={
        <Input
          {...rest}
          ref={inputRef}
          value={displayValue}
          onChange={handleInputChange}
          onKeyDown={evt => {
            if (compositing.current) return;
            handleKeyDown(evt);
          }}
          onCompositionStart={() => {
            compositing.current = true;
          }}
          onCompositionUpdate={() => {
            compositing.current = true;
          }}
          onCompositionEnd={() => {
            compositing.current = false;
          }}
          className="w-[184px]"
        />
      }
      suffixNode={
        <div className="!w-[92px] flex items-center px-3 border border-solid border-gray-800">
          <Tooltip
            truncate
            content={resultValue}
          >
            <span className="inline-block truncate text-sm">{resultValue || '-'}</span>
          </Tooltip>
        </div>
      }
    />
  );
};
