import { ReactNode, useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import { Input } from '@fepkg/components/Input';
import { Tooltip } from '@fepkg/components/Tooltip';

type SendInputProps = {
  /** 是否过桥 */
  isBridge?: boolean;
  /** 【发给/bid发给】默认值 */
  bidValue?: string;
  /** 【ofr发给】默认值 */
  ofrValue?: string;
  /** inputReadonly */
  bidInputReadonly?: boolean;
  /** ofrInputReadonly */
  ofrInputReadonly?: boolean;
  /** 【发给/bid发给】输入框确认事件 */
  onBidConfirm?: (val: string, onError: VoidFunction) => void;
  /** 【ofr发给】输入框确认事件 */
  onOfrConfirm?: (val: string, onError: VoidFunction) => void;
  isDark?: boolean;
};

type DisplayPlaceholderProps = {
  label?: ReactNode;
  value?: string;
  disabled?: boolean;
  onClick?: VoidFunction;
  isDark?: boolean;
};

/** input展示状态，输入框内容超级长时显示省略号，并且hover气泡框展示全部内容 */
const DisplayPlaceholder = ({ label, value, disabled, onClick, isDark }: DisplayPlaceholderProps) => {
  return (
    <span
      className={cx(
        'flex items-center h-7 border border-solid border-transparent rounded-lg',
        disabled ? 'bg-gray-600' : 'hover:border-primary-100',
        !disabled && (!isDark ? 'bg-gray-800' : 'bg-gray-700')
      )}
      style={{ width: 218, paddingLeft: 12 }}
      onClick={onClick}
    >
      <span
        className="text-gray-200 text-sm whitespace-nowrap flex-shrink-0"
        style={{ width: 60 }}
      >
        {label}
      </span>
      <Tooltip
        content={value}
        truncate
        strictTruncate
      >
        <div className="text-white text-sm truncate">{value}</div>
      </Tooltip>
    </span>
  );
};

/** 第一行-【发给】input框 */
const Inner = ({
  isBridge = false,
  bidValue,
  ofrValue,
  bidInputReadonly = false,
  ofrInputReadonly = false,
  onBidConfirm,
  onOfrConfirm,
  isDark
}: SendInputProps) => {
  // 用于控制input展示状态
  const [bidInputModify, setBidInputModify] = useState(false);
  const [ofrInputModify, setOfrInputModify] = useState(false);

  // 内部输入状态
  const [bidInputValue, setBidInputValue] = useState(bidValue);
  const [ofrInputValue, setOfrInputValue] = useState(ofrValue);

  // 用于输入框自动聚焦
  const bidInputRef = useRef<HTMLInputElement>(null);
  const ofrInputRef = useRef<HTMLInputElement>(null);
  const isEnterPress = useRef(false);

  const reset = () => {
    setBidInputValue(bidValue);
    setOfrInputValue(ofrValue);
  };

  useEffect(() => {
    reset();
  }, [bidValue, ofrValue]);

  return (
    <div className="flex-1">
      {/* 过桥标志被点亮，需要展示两个输入框 */}
      <div className="flex gap-2">
        {bidInputModify ? (
          <Input
            ref={bidInputRef}
            className="!w-[218px] !h-7"
            label={isBridge ? 'Bid发给' : '发给'}
            labelWidth={60}
            value={bidInputValue}
            disabled={bidInputReadonly}
            onChange={setBidInputValue}
            onBlur={evt => {
              // 避免enter之后失焦重复请求
              if (evt.currentTarget.value !== bidValue && !isEnterPress.current) {
                onBidConfirm?.(evt.currentTarget.value, reset);
              }
              setBidInputModify(false);
              isEnterPress.current = false;
            }}
            onEnterPress={val => {
              isEnterPress.current = true;
              if (val !== bidValue) onBidConfirm?.(val, reset);
              // 回车后input失去焦点
              bidInputRef.current?.blur();
            }}
          />
        ) : (
          <DisplayPlaceholder
            label={isBridge ? 'Bid发给' : '发给'}
            value={bidInputValue}
            disabled={bidInputReadonly}
            onClick={() => {
              if (bidInputReadonly) return;
              setBidInputModify(() => {
                requestIdleCallback(() => {
                  bidInputRef.current?.focus();
                });
                return true;
              });
            }}
            isDark={isDark}
          />
        )}

        {isBridge &&
          (ofrInputModify ? (
            <Input
              ref={ofrInputRef}
              className="!w-[218px] !h-7"
              label="Ofr发给"
              disabled={ofrInputReadonly}
              labelWidth={60}
              value={ofrInputValue}
              onChange={setOfrInputValue}
              onBlur={evt => {
                if (evt.currentTarget.value !== ofrValue && !isEnterPress.current)
                  onOfrConfirm?.(evt.currentTarget.value, reset);
                setOfrInputModify(false);
                isEnterPress.current = false;
              }}
              onEnterPress={val => {
                isEnterPress.current = true;
                if (val !== ofrValue) onOfrConfirm?.(val, reset);
                ofrInputRef.current?.blur();
              }}
            />
          ) : (
            <DisplayPlaceholder
              label="Ofr发给"
              value={ofrInputValue}
              disabled={ofrInputReadonly}
              onClick={() => {
                if (ofrInputReadonly) return;
                setOfrInputModify(() => {
                  requestIdleCallback(() => {
                    ofrInputRef.current?.focus();
                  });
                  return true;
                });
              }}
              isDark={isDark}
            />
          ))}
      </div>
    </div>
  );
};

export const SendInput = (props: SendInputProps) => {
  return <Inner {...props} />;
};
