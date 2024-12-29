import { useEffect, useReducer, useState } from 'react';
import { uniqueArr } from '@fepkg/common/utils';
import { message } from '@fepkg/components/Message';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { UserHotkey } from '@fepkg/services/types/common';
import { useMemoizedFn } from 'ahooks';
import { useAccess } from '@/common/providers/AccessProvider';
import { mulUpsertUserHotkey } from '@/common/services/api/user/hotkey-mul-upsert';
import { HotkeyScope, handleSetHotkeys, userHotkeyManager } from '@/common/utils/hotkey';
import hotkeys from '@/common/utils/hotkey/hotkeys-js';
import { useNavigatorCheckedIdValue } from '@/layouts/Home/atoms';
import { useActiveProductType } from '@/layouts/Home/hooks/useActiveProductType';
import { NavigatorItemId } from '../Navigator/types';
import ShortCutBlock from './components/ShortCutBlock';
import { EShortCutType, ISelectRow, IUpdateSelectedRow } from './type';
import { initShortcuts, initState, reducer, titleMap } from './utils';

const Shortcut = () => {
  const { access } = useAccess();
  const checkedId = useNavigatorCheckedIdValue();
  const { activeProductType = ProductType.ProductTypeNone } = useActiveProductType() ?? {};

  const isActive = checkedId === NavigatorItemId.Setting;

  const [shortcuts, dispatch] = useReducer(reducer, initState, initShortcutsState => {
    return initShortcuts(initShortcutsState, access, activeProductType);
  });

  const [selectedRow, setSelectedRow] = useState<ISelectRow>();

  const getDuplicateList = (type?: EShortCutType, hotkey?: string) => {
    // 分别检测main和calc中的快捷键
    const commonCheckList = Object.keys(shortcuts)
      .filter(item => item !== EShortCutType.SettlementType)
      .map(item => (shortcuts[item] ?? []) as UserHotkey[]);
    const allCheckList = Object.keys(shortcuts).map(item => (shortcuts[item] ?? []) as UserHotkey[]);

    const shortcutsMap = new Map<EShortCutType, UserHotkey[][]>([
      [EShortCutType.ProductPanel, commonCheckList],
      [EShortCutType.Func, commonCheckList],
      [EShortCutType.SettlementType, [shortcuts[EShortCutType.SettlementType] ?? []]],
      [EShortCutType.All, allCheckList]
    ]);

    const duplicates: string[] = [];
    const shortcutsList = shortcutsMap.get(type ?? EShortCutType.All) ?? allCheckList;

    for (const list of shortcutsList) {
      const keyCounts: Record<string, boolean> = {
        ...(hotkey ? { [hotkey]: true } : undefined)
      };

      for (const shortcut of list) {
        if (shortcut.value == null || shortcut.value === '') continue;
        if (shortcut.function === selectedRow?.function) continue;

        if (keyCounts[shortcut.value] != null) {
          duplicates.push(shortcut.value);
          continue;
        }
        keyCounts[shortcut.value] = true;
      }
    }

    return uniqueArr(duplicates);
  };

  const checkDuplicate = (type?: EShortCutType, hotkey?: string) => {
    const duplicates = getDuplicateList(type, hotkey);

    if (duplicates.length === 0) {
      return false;
    }

    message.error('快捷键设置重复，请重新设置');
    return true;
  };

  const onSave = async (hotkey_list: UserHotkey[]) => {
    const isDuplicate = checkDuplicate();
    if (isDuplicate) {
      return false;
    }

    await mulUpsertUserHotkey({
      hotkey_list
    });

    userHotkeyManager.updateHotkey(hotkey_list);

    return true;
  };

  const updateSelectedRow: IUpdateSelectedRow = useMemoizedFn((hotkey, selected) => {
    selected = selected ?? selectedRow;
    if (selected == null) return;

    const { type } = selected;

    const isDuplicate = checkDuplicate(type, hotkey);
    if (isDuplicate) {
      return;
    }

    const shortcutsList = shortcuts[type];

    const newShortcuts: UserHotkey[] =
      shortcutsList?.map(item => {
        if (item.function === selected?.function) {
          return { ...item, value: hotkey };
        }

        return item;
      }) ?? [];

    onSave(newShortcuts);

    dispatch({
      type,
      payload: newShortcuts
    });
  });

  useEffect(() => {
    const isDateHotkey = selectedRow?.type === EShortCutType.SettlementType;

    const cancelHandle = handleSetHotkeys(updateSelectedRow, isDateHotkey, false);
    // 未选择时取消监听
    if (!selectedRow) {
      cancelHandle();
    }
    return cancelHandle;
  }, [selectedRow, updateSelectedRow]);

  // 拦截快捷键
  useEffect(() => {
    if (!isActive) return void 0;

    hotkeys.setScope(HotkeyScope.set);
    return () => {
      hotkeys.setScope(HotkeyScope.main);
    };
  }, [isActive]);

  return (
    <div tabIndex={-1}>
      <header className="flex mt-6 pt-6 border-0 border-t border-gray-600 border-solid">
        <span className="flex-shrink-0 text-md font-bold select-none">快捷键</span>
      </header>

      {Object.keys(shortcuts).map(item => {
        const key = item as keyof typeof shortcuts;
        if (!shortcuts[key]?.length) {
          return null;
        }
        return (
          <ShortCutBlock
            key={key}
            type={key}
            title={titleMap[key] ?? ''}
            list={shortcuts[key] ?? []}
            setSelectedRow={setSelectedRow}
            updateSelectedRow={updateSelectedRow}
          />
        );
      })}
    </div>
  );
};

export default Shortcut;
