import { describe, expect } from 'vitest';
import { dialogCacheMap, removeDialogCache, setDialogCache } from './context';

describe('window context cache map', () => {
  it('map order', () => {
    // order after set
    setDialogCache({ webContentsId: 2, winName: 'test2' });
    setDialogCache({ webContentsId: 3, winName: 'test3' });
    setDialogCache({ webContentsId: 4, winName: 'test4' });
    let i = [2, 3, 4];
    dialogCacheMap.forEach((_, k) => {
      expect(k).toBe(i.shift());
    });

    // order after remove
    i = [2, 4];
    removeDialogCache(3);
    dialogCacheMap.forEach((_, k) => {
      expect(k).toBe(i.shift());
    });

    // order after set again
    setDialogCache({ webContentsId: 1, winName: 'test1' });
    i = [2, 4, 1];
    dialogCacheMap.forEach((_, k) => {
      expect(k).toBe(i.shift());
    });

    // order after set the same key again
    setDialogCache({ webContentsId: 3, winName: 'test3' });
    i = [2, 4, 1, 3];
    dialogCacheMap.forEach((_, k) => {
      expect(k).toBe(i.shift());
    });
  });
});
