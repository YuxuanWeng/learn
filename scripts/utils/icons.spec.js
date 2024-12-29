import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

describe('test icons', () => {
  it('should get correctly names', async () => {
    const iconsReader = await import('./icons');
    iconsReader.setEnv({
      walk: () => [
        {
          path: '/a.svg'
        },
        {
          path: '/foo/b.svg'
        },
        {
          path: 'c.jpg'
        }
      ],
      sizeOf: () => ({
        width: 0,
        height: 0
      })
    });
    expect(iconsReader.getNames()).toEqual(['.icon-a', '.icon-b', '.icon-c', '.bgicon-a', '.bgicon-b', '.bgicon-c']);
  });
});
