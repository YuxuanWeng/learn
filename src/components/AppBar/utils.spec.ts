import { describe, expect, it, vi } from 'vitest';
import { getAvatarName } from './utils';

describe('测试AppBar组件中的工具函数', () => {
  it('测试头像展示的文本', () => {
    const enName = ['Jack Chen', '(Jack) Chen', 'Jack-Chen', 'Jack.Chen', 'J-ackChen'];
    const zhName = ['王小明', '小明', '王华(李小明)', '王小(明)', '王-小-明', '王 小 明', '王%小@明', '王-Xiao-小明'];
    for (const name of enName) {
      const res = getAvatarName(name);
      expect(res).toBe('J');
    }
    for (const name of zhName) {
      const res = getAvatarName(name);
      expect(res).toBe('小明');
    }
  });
});
