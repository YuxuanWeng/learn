// 简单内存监控
// 使用 performance.memory api 来获取当前已使用的内存
// chrome 会在某些时候进行 garbage collect， gc 之后的内存消耗会下降，若下降幅度较高则此时将下降后的内存视为当前必要的内存
// 如果此“必要内存”持续增长并符合预设的规则，则视为潜在的内存泄漏
// 采用 nodejs 库 memwatch 的规则，连续一定次数的内存增长后视为内存泄漏
// TODO: 这个策略似乎过于保守，尽管触发时基本可以确定存在内存泄漏，但是似乎并不能检测出相当一部分内存泄漏
import { useEffect } from 'react';
import { notification } from 'antd';
import { logger } from '@/common/utils/logger';

type MinMemoryRecord = {
  memory: number;
  time: Date;
};

const MAX_COUNT = 10;
const MIN_STABLE_COUNT = 3;
const MEM_INCREASE_THRESHOLD = 0.5;
const LOOP_TIME = 500;

let reachThresholdTime = 0;

export const useMemoryMonitor = () => {
  useEffect(() => {
    let timer;
    // 首次出现:
    // 内存历史数组满 MAX_COUNT 个
    // 所有记录与平均值的差不超过10%
    // 此时记录一次内存，视为基准内存
    // 超出该内存过多也视为潜在的内存泄漏

    const enableMonitor = ['dev', 'test'].includes(window.appConfig.env);

    if (enableMonitor) {
      let firstStableAverageMemory: number;
      const minMemories: MinMemoryRecord[] = [];

      let lastMemory: number;

      timer = setInterval(() => {
        const curMemory = (performance as any).memory.usedJSHeapSize as number;

        if (lastMemory && lastMemory * 0.95 > curMemory) {
          const record = {
            time: new Date(),
            memory: curMemory
          };

          minMemories.push(record);

          if (minMemories.length > MIN_STABLE_COUNT && firstStableAverageMemory == null) {
            const average = minMemories.reduce((prev, next) => prev + next.memory, 0) / minMemories.length;

            const isStable = minMemories.every(m => Math.abs((m.memory - average) / average) < 0.15);

            if (isStable) {
              firstStableAverageMemory = average;
            }
          }
          if (minMemories.length > MAX_COUNT) {
            minMemories.splice(0, 1);
            const isAlwaysIncrease = minMemories.every((val, index) => {
              if (index === MAX_COUNT - 1) return true;

              return minMemories[index + 1].memory > val.memory;
            });

            const isIncreasedTooMuch =
              firstStableAverageMemory &&
              curMemory > firstStableAverageMemory * (1 + MEM_INCREASE_THRESHOLD * (1 + reachThresholdTime));

            if (isIncreasedTooMuch || isAlwaysIncrease) {
              const message = `潜在的内存泄漏：${
                isAlwaysIncrease
                  ? '内存消耗持续上升'
                  : `内存消耗增长超过${MEM_INCREASE_THRESHOLD * (1 + reachThresholdTime) * 100}%`
              }`;

              const description = `前五次记录的最低内存： \n${minMemories
                .map(m => JSON.stringify(m))
                .join('\n')}\n初始内存估计：${firstStableAverageMemory}\n上次内存消耗：${curMemory}`;

              notification.warn({
                message,
                description,
                placement: 'bottomRight'
              });

              logger.w({ msg: `${message}\n${description}` });
            }

            if (isIncreasedTooMuch) {
              reachThresholdTime++;
            }
          }

          // console.log('gc now', record, lastMemory);
          // console.log(minMemories, fisrtStableAverageMemory);
        }
        lastMemory = curMemory;
      }, LOOP_TIME);
    }

    return () => {
      clearInterval(timer);
    };
  }, []);
};
