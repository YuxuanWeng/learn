import { logger } from '@/common/utils/logger';

type ILog = { key: string; value?: any; time?: number };

const stack: ILog[] = [];

export default {
  log(key: string, value?: any) {
    stack.push({ key, value, time: performance.now() });
  },
  send() {
    logger.i(
      {
        // main入口渲染时长
        keyword: 'app-entry',
        msg: stack
      },
      {
        // 启动中loading.html页面，需要立即上报才能捕获
        immediate: true
      }
    );
  }
};
