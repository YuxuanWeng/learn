import { Dispatch, SetStateAction } from 'react';
import cx from 'classnames';
import { Input } from '@fepkg/components/Input';
import { UserHotkey } from '@fepkg/services/types/common';
import { HotkeyFunctionDisplayMap } from '@/common/utils/hotkey';
import { EShortCutType, ISelectRow, IUpdateSelectedRow } from '../type';

export type IShortCutInput = {
  data: UserHotkey;
  type: EShortCutType;
  setSelectedRow: Dispatch<SetStateAction<ISelectRow | undefined>>;
  updateSelectedRow: IUpdateSelectedRow;
};

// 把'_' 和 '+'号后的英文首字母大写
const enhanceStr = (str?: string): string | null => {
  try {
    return str
      ? str
          .split('+')
          .map(part => {
            return part
              .split('_')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join('_');
          })
          .join('+')
      : null;
  } catch {
    return str ?? null;
  }
};

const ShortCutInput: React.FC<IShortCutInput> = ({ data, setSelectedRow, updateSelectedRow, type }) => {
  const showClearIcon = type === EShortCutType.SettlementType || !data.value ? null : undefined; // undefined则走组件默认效果

  return (
    <div className={cx('flex-1')}>
      <div className="flex-1 inline-flex items-center text-sm w-[280px]">
        <Input
          className="h-7"
          labelWidth={120}
          label={HotkeyFunctionDisplayMap[data.function]}
          placeholder="暂未设置"
          value={enhanceStr(data.value)}
          onFocus={() => {
            setSelectedRow({ ...data, type });
          }}
          onBlur={() => {
            setSelectedRow(undefined);
          }}
          onClearClick={() => {
            updateSelectedRow('', { ...data, type });
          }}
          clearIcon={showClearIcon}
        />
      </div>
    </div>
  );
};

export default ShortCutInput;
