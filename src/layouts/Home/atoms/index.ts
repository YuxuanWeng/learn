import { atom, useAtom, useAtomValue } from 'jotai';
import { GLOBAL_SCOPE } from '@/common/atoms';
import { NavigatorItemId } from '@/components/Navigator/types';

export const navigatorCheckedIdAtom = atom<NavigatorItemId>(NavigatorItemId.Market);

export const useNavigatorCheckedIdValue = () => useAtomValue(navigatorCheckedIdAtom, GLOBAL_SCOPE);
export const useNavigatorCheckedId = () => useAtom(navigatorCheckedIdAtom, GLOBAL_SCOPE);
