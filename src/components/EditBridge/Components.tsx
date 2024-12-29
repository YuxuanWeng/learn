import cx from 'classnames';
import { Options } from '@fepkg/business/constants/options';
import { Button } from '@fepkg/components/Button';
import { Checkbox } from '@fepkg/components/Checkbox';
import { Combination } from '@fepkg/components/Combination';
import { Input } from '@fepkg/components/Input';
import { Tooltip } from '@fepkg/components/Tooltip';
import { IconInfo, IconRate } from '@fepkg/icon-park-react';
import { BridgeChannel } from '@fepkg/services/types/enum';
import { ChannelOptions, PAY_REG } from './constant';

type ChannelProps = {
  value?: BridgeChannel;
  className?: string;
  labelClassName?: string;
  onChange?: (value: BridgeChannel) => void;
};

type CostProps = {
  value?: string;
  disabled?: boolean;
  withRateBtn?: boolean;
  onChange?: (value: string) => void;
  onRateClick?: () => void;
};

type SendProps = { value?: string; className?: string; onChange?: (value: string) => void };

type SendCommentProps = { value?: string; className?: string; onChange?: (value: string) => void };

type HideCommentProps = { isChecked: boolean; onChange: (value: boolean) => void };

const mid = Math.ceil(ChannelOptions.length / 2);
const first = ChannelOptions.slice(0, mid);
const second = ChannelOptions.slice(mid);

const renderChannel = (
  options: Options<BridgeChannel>,
  value?: BridgeChannel,
  onChange?: (value: BridgeChannel) => void
) => {
  return (
    <div className="flex gap-1">
      {options.map(v => {
        return (
          <Button
            className={cx(
              'max-w-[56px] min-w-[56px] h-6 w-14 !px-0 !border-0',
              value !== v.value
                ? '!bg-gray-600 !text-gray-100 hover:!bg-gray-500 hover:!text-gray-000'
                : 'hover:!bg-primary-500'
            )}
            text
            plain={value === v.value}
            type={value === v.value ? 'primary' : 'gray'}
            key={v.value}
            onClick={() => {
              onChange?.(v.value);
            }}
          >
            {v.label}
          </Button>
        );
      })}
    </div>
  );
};

const Channel = ({ value, className, labelClassName, onChange }: ChannelProps) => {
  return (
    <div className={cx('flex flex-row bg-gray-700 rounded-lg py-[6px] px-[10px]', className)}>
      <span className={cx('min-w-[76px] text-gray-200', labelClassName)}>渠道</span>
      <div className="flex flex-col gap-1">
        <div className="flex gap-1">{renderChannel(first, value, onChange)}</div>
        <div className="flex gap-1">{renderChannel(second, value, onChange)}</div>
      </div>
    </div>
  );
};

const Cost = ({ value, disabled = false, withRateBtn = true, onChange, onRateClick }: CostProps) => {
  return (
    <div className="flex items-center gap-2 w-full">
      <Combination
        containerCls="flex-1"
        size="sm"
        background="prefix700-suffix600"
        disabled={!!disabled}
        prefixNode={
          <Input
            className="text-gray-000"
            label="费用"
            value={value ?? ''}
            placeholder="请输入"
            onChange={val => {
              if (!PAY_REG.test(val)) return;
              onChange?.(val);
            }}
          />
        }
        suffixNode="厘"
      />
      {withRateBtn && (
        <Button.Icon
          type="gray"
          plain
          disabled={disabled}
          className="!w-7 !h-7 !px-0"
          icon={<IconRate size={20} />}
          onClick={onRateClick}
        />
      )}
    </div>
  );
};

const Settlement = ({ settlement }: { settlement?: string }) => {
  return (
    <div className="h-7 bg-gray-600 rounded-lg px-3">
      <span className="inline-block w-18 text-gray-200 leading-7">交割方式</span>
      <span className="text-gray-000 leading-7">{settlement}</span>
    </div>
  );
};

const Send = ({ value, className, onChange }: SendProps) => {
  return (
    <Input
      label="发给"
      value={value ?? ''}
      maxLength={100}
      placeholder="请输入"
      className={cx('h-7 text-gray-000', className)}
      onChange={onChange}
    />
  );
};

const SendComment = ({ value, className, onChange }: SendCommentProps) => {
  return (
    <Input
      className={cx('bg-gray-700 h-7 text-gray-000', className)}
      label="发单备注"
      maxLength={30}
      value={value ?? ''}
      placeholder="请输入"
      onChange={onChange}
    />
  );
};

const HideComment = ({ isChecked, onChange }: HideCommentProps) => {
  return (
    <div className="flex flex-col">
      <div className="h-6 flex flex-row justify-end items-center">
        <Checkbox
          checked={isChecked}
          className="text-gray-000"
          onChange={() => {
            onChange(!isChecked);
          }}
        >
          隐藏备注
        </Checkbox>

        <Tooltip
          content="勾选即在发单信息中隐藏发单备注内容"
          placement="top"
        >
          <IconInfo className="text-gray-100 hover:text-primary-100 ml-2" />
        </Tooltip>
      </div>
    </div>
  );
};

export { Channel, Cost, Settlement, Send, SendComment, HideComment };
