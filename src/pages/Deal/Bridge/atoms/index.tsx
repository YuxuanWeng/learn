import { atom } from 'jotai';

/** 当前选中的过桥记录id */
export const selectedRecordIdsAtom = atom<string[]>([]);

/** 桥机构搜索符合条件的桥机构idList */
export const bridgeSearchIdListAtom = atom<string[]>([]);

/** 筛选符合条件的桥id集合 */
export const searchBridgeIdListAtom = atom<string[]>([]);
