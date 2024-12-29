import { atom, useAtomValue } from 'jotai';
import { GLOBAL_SCOPE } from '@/common/atoms';
import { UndoOperationItem } from '@/common/undo-services/types';

export const undoSnapshotsAtom = atom<UndoOperationItem[] | undefined>(undefined);
export const useUndoSnapshots = () => useAtomValue(undoSnapshotsAtom, GLOBAL_SCOPE);
