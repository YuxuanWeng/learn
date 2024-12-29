import { atomWithReset } from 'jotai/utils';

// 用于获取首次从路由带过来的context默认值
export const contextAtom = atomWithReset<unknown>(undefined);
