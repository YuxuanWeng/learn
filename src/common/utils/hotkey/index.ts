import { isElement, isInputElement, isTextAreaElement, isTextInputElement } from '@fepkg/common/utils/element';
import { globalModifierStatus } from '@fepkg/common/utils/hotkey';
import { action2FunctionMap, registeredHotkeys } from '@fepkg/common/utils/hotkey/register';
import { KeyHandler, PriorityKeyHandler } from '@fepkg/common/utils/hotkey/types';
import { ARROW_KEYBOARD_KEYS, KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { message } from '@fepkg/components/Message';
import { UserHotkey } from '@fepkg/services/types/common';
import { UserHotkeyFunction } from '@fepkg/services/types/enum';
import { isEqual, noop } from 'lodash-es';
import hotkeys, { getKeyCode } from '@/common/utils/hotkey/hotkeys-js';
import { fetchUserHotkey } from '../../services/api/user/hotkey-get';
import { isQuoteInputElement } from '../element';
import { getHotkeyWithNumPad } from './utils';

const COMBINE_SYMBOL = '+';

export enum HotkeyScope {
  main = 'main',
  set = 'set'
}

// 功能键
const modifierMap: Record<number, string> = {
  16: 'shift',
  18: window.System?.isMac ? 'option' : 'alt',
  17: 'ctrl',
  91: 'cmd'
};
const modifierCodes = Object.keys(modifierMap).map(Number);

let isSettingHotkey = false;
let lastCodes: number[] = [];

hotkeys('*', { keydown: true, keyup: true, scope: HotkeyScope.main }, () => {
  globalModifierStatus.ctrlKey = hotkeys.isPressed('ctrl');
  globalModifierStatus.commandKey = hotkeys.isPressed('cmd');
  globalModifierStatus.shiftKey = hotkeys.isPressed('shift');
  globalModifierStatus.altKey = hotkeys.isPressed('alt');
});

export const quoteSettingsShortcuts: UserHotkeyFunction[] = [
  UserHotkeyFunction.UserHotkeyOpenQuoteWindow,
  UserHotkeyFunction.UserHotkeyQuoteJoin,
  UserHotkeyFunction.UserHotkeyQuoteRefer,
  UserHotkeyFunction.UserHotkeyQuoteUnRefer,
  UserHotkeyFunction.UserHotkeyQuoteAddStar,
  UserHotkeyFunction.UserHotkeyQuoteAddDoubleStar,
  UserHotkeyFunction.UserHotkeyOCO,
  UserHotkeyFunction.UserHotkeyPackageKey,
  UserHotkeyFunction.UserHotkeyInternalConversion,
  UserHotkeyFunction.UserHotkeyAlmostDone,
  UserHotkeyFunction.UserHotkeyRecommend,
  UserHotkeyFunction.UserHotkeyRefresh,
  UserHotkeyFunction.UserHotkeyValuationQuote
];
export const remarkSettingsShortcuts: UserHotkeyFunction[] = [
  UserHotkeyFunction.UserHotkeyRemarkOne,
  UserHotkeyFunction.UserHotkeyRemarkTwo,
  UserHotkeyFunction.UserHotkeyRemarkThree,
  UserHotkeyFunction.UserHotkeyRemarkFour,
  UserHotkeyFunction.UserHotkeyRemarkFive,
  UserHotkeyFunction.UserHotkeyRemarkSix,
  UserHotkeyFunction.UserHotkeyRemarkSeven,
  UserHotkeyFunction.UserHotkeyRemarkEight
];
export const funcSettingsShortcuts: UserHotkeyFunction[] = [
  UserHotkeyFunction.UserHotkeyShowAll,
  UserHotkeyFunction.UserHotkeyBondCalculator
  // UserHotkeyFunction.UserHotkeyGVNTKNDeal,
  // UserHotkeyFunction.UserHotkeyTrade
];

export const mainScopeShortcuts: UserHotkeyFunction[] = [
  ...quoteSettingsShortcuts,
  ...remarkSettingsShortcuts,
  ...funcSettingsShortcuts
];

export const calculatorShortcuts: UserHotkeyFunction[] = [
  UserHotkeyFunction.UserHotkeyQuoteAddZero,
  UserHotkeyFunction.UserHotkeyQuoteAddOne,
  UserHotkeyFunction.UserHotkeyQuoteTomorrowAddZero,
  UserHotkeyFunction.UserHotkeyQuoteTomorrowAddOne,
  UserHotkeyFunction.UserHotkeyQuoteMonday,
  UserHotkeyFunction.UserHotkeyQuoteTuesday,
  UserHotkeyFunction.UserHotkeyQuoteWednesday,
  UserHotkeyFunction.UserHotkeyQuoteThursday,
  UserHotkeyFunction.UserHotkeyQuoteFriday
];

export const dealShortcuts: UserHotkeyFunction[] = [UserHotkeyFunction.UserHotkeyMarketRotation];

export const HotkeyFunctionDisplayMap = {
  [UserHotkeyFunction.UserHotkeyOpenQuoteWindow]: '打开报价窗口',
  [UserHotkeyFunction.UserHotkeyGVNTKNDeal]: 'GVN/TKN成交',
  [UserHotkeyFunction.UserHotkeyTrade]: 'TRD窗口',
  [UserHotkeyFunction.UserHotkeyQuoteJoin]: '报价Join',
  [UserHotkeyFunction.UserHotkeyQuoteRefer]: '报价Refer',
  [UserHotkeyFunction.UserHotkeyQuoteUnRefer]: '报价UnRefer',
  [UserHotkeyFunction.UserHotkeyQuoteAddStar]: '报价加*',
  [UserHotkeyFunction.UserHotkeyQuoteAddDoubleStar]: '报价加**',
  [UserHotkeyFunction.UserHotkeyInternalConversion]: '明暗盘转换',
  [UserHotkeyFunction.UserHotkeyRecommend]: '推荐',
  [UserHotkeyFunction.UserHotkeyOCO]: 'oco',
  [UserHotkeyFunction.UserHotkeyPackageKey]: '打包',
  [UserHotkeyFunction.UserHotkeyShowAll]: '清空条件',
  [UserHotkeyFunction.UserHotkeyRefresh]: '更新报价时间',
  [UserHotkeyFunction.UserHotkeyAlmostDone]: 'AlmostDone',
  [UserHotkeyFunction.UserHotkeyBondCalculator]: '债券计算器',
  [UserHotkeyFunction.UserHotkeyValuationQuote]: '估值报价',
  [UserHotkeyFunction.UserHotkeyRemarkOne]: '备注1',
  [UserHotkeyFunction.UserHotkeyRemarkTwo]: '备注2',
  [UserHotkeyFunction.UserHotkeyRemarkThree]: '备注3',
  [UserHotkeyFunction.UserHotkeyRemarkFour]: '备注4',
  [UserHotkeyFunction.UserHotkeyRemarkFive]: '备注5',
  [UserHotkeyFunction.UserHotkeyRemarkSix]: '备注6',
  [UserHotkeyFunction.UserHotkeyRemarkSeven]: '备注7',
  [UserHotkeyFunction.UserHotkeyRemarkEight]: '备注8',
  [UserHotkeyFunction.UserHotkeyQuoteAddZero]: '+0',
  [UserHotkeyFunction.UserHotkeyQuoteAddOne]: '+1',
  [UserHotkeyFunction.UserHotkeyQuoteTomorrowAddZero]: '明天+0',
  [UserHotkeyFunction.UserHotkeyQuoteTomorrowAddOne]: '明天+1',
  [UserHotkeyFunction.UserHotkeyQuoteMonday]: '周一',
  [UserHotkeyFunction.UserHotkeyQuoteTuesday]: '周二',
  [UserHotkeyFunction.UserHotkeyQuoteWednesday]: '周三',
  [UserHotkeyFunction.UserHotkeyQuoteThursday]: '周四',
  [UserHotkeyFunction.UserHotkeyQuoteFriday]: '周五',
  [UserHotkeyFunction.UserHotkeyMarketRotation]: '债券分组'
};

export const DefaultHotkeys = {
  [UserHotkeyFunction.UserHotkeyQuoteAddZero]: '1',
  [UserHotkeyFunction.UserHotkeyQuoteAddOne]: '2',
  [UserHotkeyFunction.UserHotkeyQuoteTomorrowAddZero]: '3',
  [UserHotkeyFunction.UserHotkeyQuoteTomorrowAddOne]: '4',
  [UserHotkeyFunction.UserHotkeyQuoteMonday]: '5',
  [UserHotkeyFunction.UserHotkeyQuoteTuesday]: '6',
  [UserHotkeyFunction.UserHotkeyQuoteWednesday]: '7',
  [UserHotkeyFunction.UserHotkeyQuoteThursday]: '8',
  [UserHotkeyFunction.UserHotkeyQuoteFriday]: '9',
  [UserHotkeyFunction.UserHotkeyMarketRotation]: 'tab'
};

// 设置快捷键，code到显示的Map
export const keyRegisterCodeMap: Record<number, string> = {
  8: '⌫',
  9: 'tab',
  12: 'clear',
  13: 'enter',
  27: 'esc',
  32: 'space',
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
  46: 'delete',
  45: 'insert',
  36: 'home',
  35: 'end',
  33: 'pageup',
  34: 'pagedown',
  20: 'capslock',
  96: 'num_0',
  97: 'num_1',
  98: 'num_2',
  99: 'num_3',
  100: 'num_4',
  101: 'num_5',
  102: 'num_6',
  103: 'num_7',
  104: 'num_8',
  105: 'num_9',
  106: 'num_multiply',
  107: 'num_add',
  108: 'num_enter',
  109: 'num_subtract',
  110: 'num_decimal',
  111: 'num_divide',
  188: ',',
  190: '.',
  191: '/',
  192: '`',
  189: '-',
  187: '=',
  186: ';',
  222: "'",
  219: '[',
  221: ']',
  220: '\\',
  112: 'F1',
  113: 'F2',
  114: 'F3',
  115: 'F4',
  116: 'F5',
  117: 'F6',
  118: 'F7',
  119: 'F8',
  120: 'F9',
  121: 'F10',
  122: 'F11',
  123: 'F12'
};

export const getCode = (key: string) =>
  ({ ...hotkeys.keyMap, ...hotkeys.modifierMap })[key] ?? key.toUpperCase().codePointAt(0);

const funcKeys = ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11', 'f12'];
const funcCodes = new Set(funcKeys.map(getCode));

const numberWithNumPadKeys: string[] = [];
const numberWithNumPadCodes: (number | string)[] = [];
// 获得数字
for (let i = 48; i <= 57; i += 1) {
  const key = String.fromCodePoint(i);
  numberWithNumPadKeys.push(key);
  numberWithNumPadCodes.push(getCode(key));
}
// 获得右侧小键盘数字
for (let i = 96; i <= 105; i += 1) {
  const key = keyRegisterCodeMap[i];
  numberWithNumPadKeys.push(key);
  numberWithNumPadCodes.push(getCode(key));
}

const alphabetNumberKeys = new Set<string>(numberWithNumPadKeys);
const alphabetNumberCodes = new Set<number | string>(numberWithNumPadCodes);

// 获得大写字母
for (let i = 65; i <= 90; i += 1) {
  const key = String.fromCodePoint(i);
  alphabetNumberKeys.add(key);
  alphabetNumberCodes.add(getCode(key));
}

export const getAlphabetNumberKeys = () => {
  return { keys: alphabetNumberKeys, codes: alphabetNumberCodes };
};

hotkeys.filter = evt => {
  const { target } = evt;

  const keyCode = getKeyCode(evt); // hotkey库使用的keyCode

  // 含shift及数字键时，小键盘不支持设置, 会识别成end等keyCode自动被过滤
  const match = evt.code.match(/^Numpad(\d)$/);
  if (match && match[1] !== evt.key && hotkeys.getScope() === HotkeyScope.set) {
    message.error('含shift及数字键时，小键盘不支持设置');
  }

  // 非数字/字母，功能键(ctrl、cmd（mac中）、shift、option（mac中）、alt）、F1-12，则不生效
  if (
    keyCode &&
    // keyCode !== 229 && // 输入中文字符会是229, 代表识别不出来code, 除了这种情况都应该false
    !alphabetNumberCodes.has(keyCode) &&
    !modifierCodes.includes(keyCode) &&
    !funcCodes.has(keyCode)
  ) {
    return false;
  }

  const targetIsElement = isElement(target);
  if (targetIsElement) {
    // 设置快捷键的界面无需过滤
    if (hotkeys.getScope() === HotkeyScope.set) {
      return true;
    }

    if (isInputElement(target)) {
      // checkbox focus 时，应禁用 Space 和 Enter
      if (target.type === 'checkbox' && [KeyboardKeys.Space, KeyboardKeys.Enter].includes(evt?.key)) {
        return false;
      }

      // 若 radio focus 时，应禁用方向键
      if (target.type === 'radio' && ARROW_KEYBOARD_KEYS.includes(evt?.key)) {
        return false;
      }
    }

    // 除报价面板中价格要素区域（价格/量）外，输入框中不响应自定义快捷键
    // 若文本输入的 input与textarea focus 时，应禁用 自定义快捷键
    if (isQuoteInputElement(target)) {
      // 若存在功能键加数字, 则响应，输入框中不响应纯数字快捷键
      if (numberWithNumPadCodes.includes(keyCode)) {
        return hotkeys.getPressedKeyCodes().some(c => modifierCodes.includes(c));
      }
      return true;
    }
    if (isTextInputElement(target) || isTextAreaElement(target)) {
      return false;
    }
  }

  return true;
};

const systemReservedKeys = [
  ['backspace'],
  ['delete'],
  ['capslock'],
  ['ctrlKey', 'shiftKey'],
  ['shiftKey', 'ctrlKey'],
  ['altKey', 'space'],
  ['metaKey']
];
const reservedKeys = [
  ...systemReservedKeys,
  ['esc'],
  ['enter'],
  ['tab'],
  ['space'],
  ['ctrlKey'],
  ['shiftKey'],
  ['altKey'],
  ['option'],
  ['up'],
  ['down'],
  ['left'],
  ['right'],
  ['B'], // OMS默认快捷键, 报价面板内：Bid意向价
  ['O'], // OMS默认快捷键, 报价面板内：Ofr意向价
  ['F'] // OMS默认快捷键, 报价面板内：点亮返点
];

const systemReservedCombKeys = ['esc', 'enter', 'tab', 'space', 'delete', 'backspace', 'capslock'];

const winReservedKeys = [
  // 系统快捷键
  // alt+tab
  ['ctrlKey', 'tab'],
  // alt+f4
  ['ctrlKey', 'F4'],
  ['ctrlKey', 'W'],
  ['ctrlKey', 'X'],
  ['ctrlKey', 'Y'],
  ['ctrlKey', 'Z'],
  ['ctrlKey', 'A'],
  ['ctrlKey', 'C'],
  ['ctrlKey', 'V'],
  ['ctrlKey', 'P']
];

const macReservedKeys = [
  // 系统快捷键
  // command+tab
  ['metaKey', 'tab'],
  // command+`
  ['metaKey', '`'],
  // command+Q
  ['metaKey', 'Q'],
  ['metaKey', 'W'],
  ['metaKey', 'X'],
  ['metaKey', 'Y'],
  ['metaKey', 'Z'],
  ['metaKey', 'A'],
  ['metaKey', 'C'],
  ['metaKey', 'V'],
  ['metaKey', 'P']
];

const getKeyDisplay = (code: number) => keyRegisterCodeMap[code] ?? modifierMap[code] ?? String.fromCodePoint(code);

const checkIsSystemReserved = (codes: number[], isDateHotkey: boolean) => {
  // 检测系统与OMS不可设置的快捷键
  if (
    [...reservedKeys, ...(window.System?.isMac ? macReservedKeys : winReservedKeys)]
      .map(keys => keys.map(getCode))
      .some(pCodes => isEqual(codes, pCodes))
  ) {
    // 无需toast的快捷键
    if (
      [['delete'], ['backspace'], ['capslock'], ['shiftKey']]
        .map(keys => keys.map(getCode))
        .some(pCodes => isEqual(codes, pCodes))
    ) {
      return { isReserved: true };
    }
    return { isReserved: true, errMsg: '系统默认快捷键，不可设置' };
  }

  // 检测系统与OMS不可包含的快捷键
  if (
    [...systemReservedCombKeys, window.System?.isMac ? '' : 'metaKey']
      .map(getCode)
      .some(item => codes.includes(Number(item)))
  ) {
    return { isReserved: true, errMsg: '系统默认快捷键，不可设置' };
  }

  // 单键快捷键限制，结算方式单键不校验
  if (!isDateHotkey && codes.length === 1 && !funcKeys.map(getCode).includes(codes[0])) {
    return { isReserved: true, errMsg: '快捷键设置不符合规定，请重新设置' };
  }

  // 若组合键全为数字/字母，或数字/字母在首位，则设置无效，无提醒
  if (
    !(isDateHotkey && codes.length === 1) && // 结算方式单键不校验
    (alphabetNumberCodes.has(codes[0]) || codes.every(c => alphabetNumberCodes.has(c)))
  ) {
    return { isReserved: true };
  }

  // 逗号若不在最后，则设置无效（hotkeys-js以逗号分隔多个快捷键，目前它只适配了逗号放最后的逻辑）
  const comma = hotkeys.keyMap[','];
  if (codes.includes(comma) && codes.at(-1) !== comma) {
    return { isReserved: true };
  }

  // mac系统中cmd结合多字母会被hotkeys-js拆分，如cmd+A+B 为识别成 cmd+A 与 cmd+B，所以mac下cmd三键组合一定要搭配个modifier
  const metaKey = Number(getCode('metaKey'));
  if (
    window.System?.isMac &&
    codes.length === 3 &&
    codes.includes(metaKey) &&
    codes.filter(i => modifierCodes.includes(i)).length !== 2
  ) {
    return { isReserved: true };
  }

  return { isReserved: false };
};

export const handleSetHotkeys = (onRegister = noop, isDateHotkey = false, changeScope = true) => {
  const registerKey = (codes: number[]) => {
    // 功能键提前
    const precedeModifierCodes = [...codes];
    for (const modifier of modifierCodes) {
      if (precedeModifierCodes.includes(modifier)) {
        precedeModifierCodes.splice(precedeModifierCodes.indexOf(modifier), 1); // 从原始位置移除
        precedeModifierCodes.unshift(modifier); // 添加到数组的开头
      }
    }

    // 检测系统与OMS不可设置的快捷键
    const { isReserved, errMsg } = checkIsSystemReserved(precedeModifierCodes, isDateHotkey);
    if (isReserved) {
      if (errMsg) message.error(errMsg);

      return;
    }

    onRegister(precedeModifierCodes.map(getKeyDisplay).join(COMBINE_SYMBOL));
  };

  const handler = (e: KeyboardEvent) => {
    // 会阻止打开控制台
    e.preventDefault();
    const codes = hotkeys.getPressedKeyCodes().map(c => {
      if (/^num_\d$/.test(keyRegisterCodeMap[c])) {
        // 48 为大小键盘数字键code差
        return c - 48;
      }

      return c;
    });

    if (codes.length > 3) return;
    const isOnlyModifiers = codes.every(c => modifierCodes.includes(c));

    if (e.type === 'keydown' && !isOnlyModifiers) {
      isSettingHotkey = true;

      if (codes.length === 3) {
        registerKey(codes);
      }
    }

    if (e.type === 'keyup' && isSettingHotkey) {
      isSettingHotkey = false; // 第一次接收keyup则代表本次快捷键设置结束，在registerKey函数中检测是否合法
      registerKey(lastCodes);
    }

    lastCodes = codes;
  };
  hotkeys('*', { keydown: true, keyup: true, scope: HotkeyScope.set }, handler);
  if (changeScope) {
    hotkeys.setScope(HotkeyScope.set);
  }

  return () => {
    hotkeys.unbind('*', HotkeyScope.set, handler);
    if (changeScope) {
      hotkeys.setScope(HotkeyScope.main);
    }
  };
};

// 预定义的行为 UserHotkeyFunction 和具体绑定函数的映射
// {
//   [UserHotkeyFunction]: {
//     [id]: PriorityKeyHandler[]
//   }
// }

const bindHotkeyWithNumPad = (hotkey: string, callback: KeyHandler, useKeyUp = false) => {
  hotkeys(hotkey, { scope: HotkeyScope.main, keydown: !useKeyUp, keyup: useKeyUp }, callback);

  if (/\d/.test(hotkey)) {
    const hotkeyWithNumPad = getHotkeyWithNumPad(hotkey, COMBINE_SYMBOL);
    hotkeys(hotkeyWithNumPad, { scope: HotkeyScope.main, keydown: !useKeyUp, keyup: useKeyUp }, callback);
  }
};

const unBindHotkeyWithNumPad = (hotkey: string, callback: KeyHandler) => {
  hotkeys.unbind(hotkey, HotkeyScope.main, callback);

  if (/^\d$/.test(hotkey)) {
    const hotkeyWithNumPad = getHotkeyWithNumPad(hotkey, COMBINE_SYMBOL);
    hotkeys.unbind(hotkeyWithNumPad, HotkeyScope.main, callback);
  }
};

export const updateHotkeyByStorageData = (data: Record<string, string>) => {
  for (const key of [...mainScopeShortcuts, ...calculatorShortcuts, ...dealShortcuts]) {
    const oldHotKey = registeredHotkeys[key];
    const newHotKey = data[key];

    if (oldHotKey === newHotKey) continue;

    registeredHotkeys[key] = newHotKey;

    if (action2FunctionMap[key] == null) continue;

    for (const priorityHandlers of Object.values(action2FunctionMap[key])) {
      for (const priorityHandler of priorityHandlers) {
        if (oldHotKey) {
          unBindHotkeyWithNumPad(oldHotKey, priorityHandler.callback);
        }

        bindHotkeyWithNumPad(newHotKey, priorityHandler.callback, priorityHandler.useKeyUp);
      }
    }
  }
};

interface UserHotkeyManager {
  // 绑定 UserHotkeyFunction 和 具体的快捷键
  updateHotkey(newHotkeys: UserHotkey[]);

  // 绑定 UserHotkeyFunction 和具体的行为
  // id 在每个 UserHotkeyFunction 下标记绑定的不同回调函数
  register(action: UserHotkeyFunction, callback: VoidFunction, id?: string, priority?: number, useKeyUp?: boolean);

  unRegister(action: UserHotkeyFunction, id?: string, priority?: number);

  registerInTab(action: UserHotkeyFunction, callback: VoidFunction, tab?: string, priority?: number);

  // 获取所有用户快捷键设置并初始化内存和 localStorage
  initUserHotkeySettings: () => Promise<void>;
}

export const userHotkeyManager: UserHotkeyManager = {
  updateHotkey(newHotkeys) {
    for (const h of newHotkeys) {
      const action = h.function;
      const hotkey = h.value;

      const oldHotKey = registeredHotkeys[action];

      if (hotkey === oldHotKey) continue;

      registeredHotkeys[action] = hotkey;

      if (action2FunctionMap[action] != null) {
        for (const priorityHandlers of Object.values(action2FunctionMap[action])) {
          for (const priorityHandler of priorityHandlers) {
            if (oldHotKey) {
              unBindHotkeyWithNumPad(oldHotKey, priorityHandler.callback);
            }

            bindHotkeyWithNumPad(hotkey, priorityHandler.callback, priorityHandler.useKeyUp);
          }
        }
      }
    }

    localStorage.setItem('userHotkeys', JSON.stringify(registeredHotkeys));
  },

  register(action, callback, id = 'default', priority = 1, useKeyUp = false) {
    if (action == null) return;

    const priorityHandlers = action2FunctionMap[action]?.[id];

    if (action2FunctionMap[action] == null) {
      action2FunctionMap[action] = {};
    }

    if (priorityHandlers == null) {
      action2FunctionMap[action][id] = [];
    }

    if (priorityHandlers) {
      const currentHandlerIndex = priorityHandlers?.findIndex(ph => ph.priority === priority);
      if (currentHandlerIndex !== -1 && registeredHotkeys[action]) {
        unBindHotkeyWithNumPad(registeredHotkeys[action], priorityHandlers[currentHandlerIndex].callback);

        priorityHandlers.splice(currentHandlerIndex, 1);
      }
    }

    const preventDefaultCb: KeyHandler = e => {
      const hotkey = registeredHotkeys[action];

      const allActions = Object.keys(registeredHotkeys).filter(k => registeredHotkeys[k] === hotkey);

      const currentPriorityHandlers = allActions.reduce((all, act) => {
        return [...all, ...(action2FunctionMap[act]?.[id] ?? [])];
      }, [] as PriorityKeyHandler[]);

      if (currentPriorityHandlers.every(ph => ph.priority <= priority)) {
        callback();
      }
      e.preventDefault();
    };

    const newPriorityHandlers = action2FunctionMap[action][id];

    const currPriorityIndex = newPriorityHandlers?.findIndex(ph => ph.priority === priority);

    if (currPriorityIndex === -1) {
      newPriorityHandlers.push({
        callback: preventDefaultCb,
        priority,
        useKeyUp
      });
    } else {
      newPriorityHandlers[currPriorityIndex] = {
        callback: preventDefaultCb,
        priority,
        useKeyUp
      };
    }

    if (registeredHotkeys[action] != null) {
      bindHotkeyWithNumPad(registeredHotkeys[action], preventDefaultCb, useKeyUp);
    }
  },

  unRegister(action, id, priority = 1) {
    if (action == null || action2FunctionMap[action] == null) return;

    const priorityHandlers = action2FunctionMap[action]?.[id ?? 'default'];

    const currentHandlerIndex = (priorityHandlers ?? []).findIndex(ph => ph.priority === priority);

    if (currentHandlerIndex !== -1) {
      if (registeredHotkeys[action] != null) {
        unBindHotkeyWithNumPad(registeredHotkeys[action], priorityHandlers[currentHandlerIndex].callback);
      }

      priorityHandlers.splice(currentHandlerIndex, 1);
    }
  },

  registerInTab(action, callback, panelId, priority = 1) {
    if (panelId == null) {
      this.register(action, callback, 'default', priority);
      return;
    }

    this.register(
      action,
      () => {
        callback();
      },
      panelId,
      priority
    );
  },

  initUserHotkeySettings: async () => {
    const shortcuts = [...mainScopeShortcuts, ...calculatorShortcuts, ...dealShortcuts];

    const result = (await fetchUserHotkey({ function_list: shortcuts })).hotkey_list;

    for (const h of shortcuts) {
      registeredHotkeys[h] = DefaultHotkeys[h] ?? '';
    }

    for (const h of result ?? []) {
      registeredHotkeys[h.function] = h.value || DefaultHotkeys[h.function];
    }

    localStorage.setItem('userHotkeys', JSON.stringify(registeredHotkeys));
  }
};
