import { useRef } from 'react';
import { Button } from '@fepkg/components/Button';
import { Input } from '@fepkg/components/Input';
import { IconNoConfirmation } from '@fepkg/icon-park-react';
import { preventEnterDefault } from '@/pages/ProductPanel/utils';

type NCProps = {
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否有错误 */
  error?: boolean;
  /** 是否选中 */
  checked?: boolean;
  /** 输入框受控值 */
  inputValue?: string;
  /** NC输入框变化时候的回调 */
  onInputChange?: (val: string) => void;
  /** NC标志点击回调 */
  onFlagClick?: (checked: boolean) => void;
};

export const NC = ({ checked, inputValue, disabled, error, onFlagClick, onInputChange }: NCProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex gap-2 !w-full !ml-0">
      <Button.Icon
        icon={<IconNoConfirmation size={20} />}
        className="!w-7 !h-7 !p-0"
        bright
        disabled={disabled}
        type="orange"
        checked={checked}
        onClick={() => {
          onFlagClick?.(!checked);
          requestIdleCallback(() => {
            inputRef.current?.focus();
          });
        }}
        onKeyDown={preventEnterDefault}
      />
      <Input
        ref={inputRef}
        className="h-7"
        label="NC"
        maxLength={100}
        placeholder="请输入"
        error={error}
        disabled={!checked || disabled}
        value={inputValue ?? ''}
        onChange={onInputChange}
      />
    </div>
  );
};
