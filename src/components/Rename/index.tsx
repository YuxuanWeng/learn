import { useRef } from 'react';
import { ActionInput } from '@fepkg/business/components/ActionInput';
import { IconShare } from '@fepkg/icon-park-react';
import { useMainGroupData } from '@/pages/ProductPanel/providers/MainGroupProvider';

type RenameProps = {
  name: string;
  subName?: string;
  disabled?: boolean;
};

const MAX_INPUT_LENGTH = 10;
// 当行情看板是复制出来的时候，名称将会有大于10的情况，失焦后即使没有做任何修改，也需要主动将其截取到10个字符
const getTargetName = (val: string) => val.slice(0, MAX_INPUT_LENGTH);

export const Rename = ({ name, subName, disabled = false }: RenameProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { rename, checkValid, activeGroupState } = useMainGroupData();

  const handleValidate = async (val: string) => {
    const targetValue = getTargetName(val);
    return checkValid(activeGroupState.activeGroup?.groupId ?? '', targetValue);
  };

  const handleRename = (val: string) => {
    const targetValue = getTargetName(val);
    if (targetValue === name) {
      return;
    }
    rename(activeGroupState.activeGroup?.groupId ?? '', targetValue);
  };

  return (
    <ActionInput
      containerCls="flex items-center flex-1"
      displayCls="text-gray-000 font-bold !text-md ml-2 [@media(max-width:912px){&}]:max-w-[148px] [@media(min-width:912px){&}]:max-w-[160px]"
      className="!w-[200px] ml-2"
      padding={[4, 12]}
      prefix=""
      suffix={
        disabled ? (
          <div className="ml-2 flex items-center text-gray-300">
            <IconShare />
            <span className="text-xs pl-1 truncate">{subName}</span>
          </div>
        ) : null
      }
      ref={node => {
        inputRef.current = node;
        node?.focus();
      }}
      showTrigger={!disabled}
      defaultValue={name}
      onValidate={handleValidate}
      onSubmit={handleRename}
      placeholder="看板名称编辑中.."
    />
  );
};
