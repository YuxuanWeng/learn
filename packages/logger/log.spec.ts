import { describe, expect, it, vi } from 'vitest';
import { CACHE_LOG_COUNT } from '@fepkg/logger';
import moment from 'moment';

describe('test log tool', () => {
  beforeAll(() => {
    vi.stubGlobal('_env', 'dev');
    vi.stubGlobal('_opt', null);
  });
  beforeEach(() => {
    vi.stubGlobal('_spy1', vi.fn());
    vi.stubGlobal('_spy2', vi.fn());
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  it.skip('多条批量发送', async () => {
    const { testLogger } = await import('./node');
    for (let i = 0; i < 50; i++) {
      const date1 = moment('2022-10-20').add(i, 'seconds');
      vi.setSystemTime(date1.valueOf());
      testLogger.i({ hello: 'excel' });
    }
    expect(global._spy1).not.toHaveBeenCalled();
    expect(global._spy2).toHaveBeenCalled();
    const logs = global._spy2.calls[0][0];
    expect(logs).toHaveLength(CACHE_LOG_COUNT);
    expect(logs[0].timeStamp).toEqual(moment('2022-10-20').add(0, 'seconds').valueOf());
    expect(logs[49].timeStamp).toEqual(moment('2022-10-20').add(49, 'seconds').valueOf());
  });

  it.skip('单条立即发送', async () => {
    const { testLogger: logger } = await import('./node');
    logger.i({ hello: 'word' }, { immediate: true });
    expect(global._spy1).toHaveBeenCalled();
    expect(global._spy2).not.toHaveBeenCalled();
    expect(global._opt.source).toBe('dev');
  });
});
