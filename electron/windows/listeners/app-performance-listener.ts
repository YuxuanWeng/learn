// TODO: 收集electron相关ready时间，集成更好的性能分析方案后，可酌情删除；
import { InitEventEnum } from 'app/types/IPCEvents';
import { ipcMain } from 'electron';
import { omsApp } from '../../models/oms-application';

export interface AppPerformanceModule {
  appStartTime: number;
  appReadyTime: number;
  createWindowStartTime: number;
  createWindowReadyTime: number;
}

export const appPerformance: AppPerformanceModule = {
  appStartTime: 0,
  appReadyTime: 0,
  createWindowStartTime: 0,
  createWindowReadyTime: 0
};

export const setWindowStartTime = (time: number) => {
  appPerformance.createWindowStartTime = time;
};
export const setWindowReadyTime = (time: number) => {
  appPerformance.createWindowReadyTime = time;
};

const getAppPerformance = () => {
  return { ...appPerformance, appStartTime: omsApp.startTime, appReadyTime: omsApp.readyTime };
};

const start = () => {
  ipcMain.handle(InitEventEnum.AppPerformance, getAppPerformance);
};

const end = () => {
  ipcMain.off(InitEventEnum.AppPerformance, getAppPerformance);
};

/** 一些关于app性能的事件 */
export default () => [start, end];
