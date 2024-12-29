import { PopoverPosition } from '@fepkg/common/types';
import { atom } from 'jotai';
import { DiffDealType } from '@/components/IDCDealDetails/type';
import { TypeDealRecord } from '../types';

/** 右键菜单是否可见 */
export const ctxMenuVisibleAtom = atom(false);
/** 右键菜单的位置 */
export const anchorPointAtom = atom<PopoverPosition>({ x: 0, y: 0 });
/** 克隆弹窗是否可见 */
export const cloneMdlVisibleAtom = atom(false);
/** 成交记录结算弹窗是否可见 */
export const liquidationMdlVisibleAtom = atom(false);
/** 查看修改弹窗数据 */
export const diffModalDataAtom = atom<DiffDealType | undefined>(undefined);
/** 当前正在操作的数据 */
export const dealRecordOperatingAtom = atom<TypeDealRecord | undefined>(undefined);
