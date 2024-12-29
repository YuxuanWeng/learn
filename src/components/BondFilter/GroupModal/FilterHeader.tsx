import { useEffect, useRef, useState } from 'react';
import { ActionInput } from '@fepkg/business/components/ActionInput';
import { Button } from '@fepkg/components/Button';
import { Input } from '@fepkg/components/Input';
import { message } from '@fepkg/components/Message';
import { IconDecoration1, IconEdit } from '@fepkg/icon-park-react';
import { usePanelGroupConfig } from './provider';

const MAX_INPUT_LENGTH = 10;

export const FilterHeader = () => {
  const { selectedGroup, check, updateGroupName } = usePanelGroupConfig();

  // const [editing, setEditing] = useState(false);
  // const [isError, setIsError] = useState(false);
  // const [innerValue, setInnerValue] = useState(selectedGroup?.groupName);

  // useEffect(() => {
  //   if (selectedGroup?.groupName !== innerValue) setInnerValue(selectedGroup?.groupName);
  //   setIsError(false);
  //   setEditing(false);
  // }, [selectedGroup?.groupName]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  if (!selectedGroup) return null;

  const handleOk = (val: string) => {
    if (val === selectedGroup.groupName) return;
    updateGroupName(selectedGroup.groupId, val);
  };

  // const handleInputBlur = () => {
  //   const trimValue = innerValue?.trim();
  //   if (!trimValue) {
  //     message.error('分组名称不能为空');
  //     inputRef.current?.focus();
  //     setIsError(true);
  //     return;
  //   }
  //   if (trimValue === selectedGroup.groupName) {
  //     setEditing(false);
  //     return;
  //   }
  //   if (trimValue.length > MAX_INPUT_LENGTH) {
  //     message.error(`分组名称不得超过${MAX_INPUT_LENGTH}个字符!`);
  //     inputRef.current?.focus();
  //     setIsError(true);
  //     return;
  //   }
  //   handleOk(trimValue);
  // };
  // const handleOpenAddGroupModal = () => {
  //   setEditing(true);
  // };

  const handleValidate = async (val?: string) => check(val);

  return (
    <div
      className="flex flex-col"
      key={selectedGroup.groupName}
    >
      <div className="min-h-[40px] flex items-center">
        <ActionInput
          className="ml-1 !w-45 text-gray-000"
          defaultValue={selectedGroup.groupName}
          ref={node => {
            inputRef.current = node;
            node?.focus();
          }}
          showTrigger
          onValidate={handleValidate}
          placeholder="分组名称修改中.."
          onSubmit={handleOk}
        />
      </div>

      {/* <div className="min-h-[40px] flex items-center">
        <IconDecoration1 className="text-2xl/0 text-primary-100" />
        {editing ? (
          <Input
            className="ml-1 !w-[158px] text-gray-000"
            ref={node => {
              inputRef.current = node;
              node?.focus();
            }}
            defaultValue={selectedGroup.groupName}
            error={!innerValue || isError}
            value={innerValue}
            onBlur={handleInputBlur}
            onChange={val => {
              const trimValue = val.trim();
              if (trimValue && trimValue.length > MAX_INPUT_LENGTH) setIsError(true);
              else setIsError(false);
              setInnerValue(val);
            }}
            onEnterPress={handleInputBlur}
            placeholder="分组名称修改中.."
          />
        ) : (
          <span className="text-gray-000  max-w-[160px] truncate overflow-ellipsis ml-1">
            {selectedGroup.groupName}
          </span>
        )}

        {!editing && (
          <Button.Icon
            text
            icon={<IconEdit />}
            className="!w-4 !h-4 !ml-2 hover:bg-primary-100 hover:cursor-pointer"
            onClick={handleOpenAddGroupModal}
          />
        )}
      </div> */}
    </div>
  );
};
