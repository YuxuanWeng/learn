import { useEffect, useRef, useState } from 'react';
import { usePrevious } from '@fepkg/common/hooks';
import { Input } from '@fepkg/components/Input';
import { Tooltip } from '@fepkg/components/Tooltip';

const MAX_INPUT_LENGTH = 15;
export const RenameLogic = ({ msg, onChange }: { msg: string; onChange: (value: string) => void }) => {
  const [editing, setEditing] = useState(false);
  const [innerValue, setInnerValue] = useState(msg);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const prevValue = usePrevious(msg);

  useEffect(() => {
    if (prevValue !== msg) setInnerValue(msg);
  }, [prevValue, msg]);

  const handleSubmit = () => {
    const trimValue = innerValue.trim();
    if (trimValue === msg) {
      setEditing(false);
      return;
    }

    setInnerValue(trimValue);
    onChange?.(trimValue);
    setEditing(false);
  };

  return (
    <div
      className="flex items-center flex-1 truncate"
      onDoubleClick={() => setEditing(true)}
    >
      {editing ? (
        <Input
          ref={node => {
            inputRef.current = node;
            node?.focus();
          }}
          defaultValue={msg}
          value={innerValue}
          onBlur={handleSubmit}
          maxLength={MAX_INPUT_LENGTH}
          onChange={setInnerValue}
          onEnterPress={handleSubmit}
          placeholder="自定义话术编辑中.."
          onClick={evt => evt.stopPropagation()}
          className="text-gray-000 mr-4 h-7"
        />
      ) : (
        <Tooltip
          content={msg}
          truncate
        >
          <span className="truncate">{msg}</span>
        </Tooltip>
      )}
    </div>
  );
};
