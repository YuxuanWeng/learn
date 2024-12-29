import { useState } from 'react';
import { Button } from '@fepkg/components/Button';
import { Input } from '@fepkg/components/Input';
import { Popover } from '@fepkg/components/Popover';
import { Switch } from '@fepkg/components/Switch';
import { IconCopy, IconDelete } from '@fepkg/icon-park-react';
import { OppositePriceNotifyColor } from '@fepkg/services/types/enum';
import { colors, notifyLogicState } from '../../constants';
import { useMutationSetting } from '../../hooks/useMutationSetting';
import { NValueEnum, OppositePriceNotifyLogicTable } from '../../types';
import { ColorPick } from '../ColorSelect';
import { RenameLogic } from '../RenameLogic';

const OverlayContent = ({ content }: { content: string }) => {
  return (
    <div className="flex flex-col gap-2 max-w-[390px]">
      <div className="text-sm">触发条件</div>
      <i className="component-dashed-x mb-0.5" />
      <div className="text-sm text-gray-200">{content}</div>
    </div>
  );
};

export const NotifyLogicTypeCell = ({ row }: { row: OppositePriceNotifyLogicTable }) => {
  const canCopy = notifyLogicState[row.notify_logic_type].copy && !row.copied;
  const canDel = notifyLogicState[row.notify_logic_type].copy && row.copied;
  const { handleClick } = useMutationSetting();
  return (
    <div className="px-3 flex flex-1 items-center justify-between">
      <Popover
        placement="bottom-start"
        trigger="hover"
        destroyOnClose
        floatingFocus={false}
        content={<OverlayContent content={notifyLogicState[row.notify_logic_type].detail} />}
        safePolygon={false}
      >
        <span>{row.notify_logic_name}</span>
      </Popover>
      {/* 能复制或能删除时展示按钮 */}
      {(canCopy || canDel) && (
        <Button.Icon
          text
          icon={canDel ? <IconDelete /> : <IconCopy />}
          onClick={e => {
            e.stopPropagation();
            handleClick(row);
          }}
        />
      )}
    </div>
  );
};

export const ColorCell = ({ row }: { row: OppositePriceNotifyLogicTable }) => {
  const { updateLogics } = useMutationSetting();
  return (
    <ColorPick
      selectedValue={colors.find(i => i.value === row.color)}
      colorOpt={colors}
      onChange={val => updateLogics({ ...row, color: val.value as OppositePriceNotifyColor })}
    />
  );
};

export const TurnOnCell = ({ row }: { row: OppositePriceNotifyLogicTable }) => {
  const { updateLogics } = useMutationSetting();
  return (
    <Switch
      tabIndex={-1}
      checked={row.turn_on}
      onChange={val => updateLogics({ ...row, turn_on: val })}
    />
  );
};

export const NValueCell = ({ row }: { row: OppositePriceNotifyLogicTable }) => {
  // N值为空时展示为0
  const originalValue = row.n_value ? row.n_value.toString() : '0';
  const { updateLogics } = useMutationSetting();
  const [inputValue, setInputValue] = useState(originalValue);
  const [edit, setEdit] = useState(false);
  const { nValueType, rule } = notifyLogicState[row.notify_logic_type];

  const handleModifyNValue = () => {
    if (!inputValue || inputValue === '' || +inputValue === row.n_value) {
      setInputValue(originalValue);
    } else updateLogics({ ...row, n_value: +inputValue });
    setEdit(false);
  };

  // 啥也不是
  if (nValueType === NValueEnum.None) return null;
  // 是开关类n_value
  if (nValueType === NValueEnum.OnOff) {
    return (
      <div className="flex-center w-full">
        <Switch
          tabIndex={-1}
          checked={row.n_value === 1}
          onChange={val => updateLogics({ ...row, n_value: val ? 1 : 0 })}
        />
      </div>
    );
  }

  // input类n_value
  // 编辑状态
  if (edit) {
    return (
      <div className="flex-center">
        <Input
          value={inputValue}
          autoFocus
          className="h-7 leading-3 text-gray-000"
          onBlur={handleModifyNValue}
          onEnterPress={handleModifyNValue}
          onChange={val => {
            if (rule?.test(val)) setInputValue(val);
          }}
        />
      </div>
    );
  }

  // 展示状态
  return (
    <div
      // 这里需要宽度，否则没有值的时候双击无效
      className="w-full flex-center"
      onDoubleClick={() => setEdit(true)}
    >
      {inputValue}
    </div>
  );
};

export const LogicCell = ({ row }: { row: OppositePriceNotifyLogicTable }) => {
  const { updateLogics } = useMutationSetting();
  const [msg, setMsg] = useState(row.msg_template);
  return (
    <RenameLogic
      msg={msg}
      onChange={val => {
        setMsg(val);
        updateLogics({ ...row, msg_template: val });
      }}
    />
  );
};
