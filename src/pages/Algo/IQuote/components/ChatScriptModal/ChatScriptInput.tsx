import cx from 'classnames';
import { TextArea } from '@fepkg/components/Input';

type ChatScriptInputProps = {
  prefix: string;
  value: string;
  onChange?: (val: string) => void;
  className?: string;
  onKeyDown?: (evt: React.KeyboardEvent<HTMLTextAreaElement>) => void;
};

export const ChatScriptInput = ({ prefix, value, onChange, onKeyDown, className = '' }: ChatScriptInputProps) => {
  return (
    <div className={cx('w-full h-[46px] bg-gray-800 flex rounded-lg', className)}>
      <TextArea
        className="flex-1 bg-gray-800 rounded-lg text-gray-000 text-sm"
        value={value}
        onChange={onChange}
        placeholder="请输入"
        label={prefix}
        onKeyDown={onKeyDown}
      />
    </div>
  );
};
