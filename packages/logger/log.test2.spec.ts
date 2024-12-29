import { describe, it, vi } from 'vitest';

describe('test log tool: prod', () => {
  beforeAll(() => {
    vi.stubGlobal('_env', 'prod');
    vi.stubGlobal('_opt', null);
    vi.stubGlobal('_spy1', vi.fn());

    vi.stubGlobal('Main', {
      invoke() {
        return Promise.resolve({
          env: global._env
        });
      }
    });
  });
  afterAll(() => {
    vi.clearAllMocks();
  });

  it.skip('根据环境区分库', async () => {
    const { testLogger } = await import('./node');
    testLogger.i({ hello: 'word' }, { immediate: true });
  });
});
