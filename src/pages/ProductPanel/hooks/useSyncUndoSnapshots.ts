import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { GLOBAL_SCOPE } from '@/common/atoms';
import { useLocalforage } from '@/common/hooks/useLocalforage';
import { UndoOperationItem } from '@/common/undo-services/types';
import { UNDO } from '@/common/utils/undo';
import { undoSnapshotsAtom } from '@/pages/ProductPanel/atoms/undo';

export const useSyncUndoSnapshots = () => {
  const [undoSnapshots] = useLocalforage<UndoOperationItem[]>(UNDO);
  const setUndoSnapshots = useSetAtom(undoSnapshotsAtom, GLOBAL_SCOPE);

  useEffect(() => {
    setUndoSnapshots(undoSnapshots);
  }, [setUndoSnapshots, undoSnapshots]);
};
