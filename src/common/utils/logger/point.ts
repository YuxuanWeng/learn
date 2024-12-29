import { logger } from '.';

export const trackPoint = (name: string, keyword?: string, params?: object, immediate = true) => {
  if (!name) return;
  logger.i({ remark: name, type: 'track-point', keyword, params }, { immediate });
};

export const trackDuration = (keyword: string, duration: number, samplingRate = 1) => {
  logger.i({ keyword, duration }, { samplingRate, immediate: false });
};
