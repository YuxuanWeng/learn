import { MemoInfoEnum } from 'app/types/IPCEvents';
import { ipcMain } from 'electron';

const getMainMemoInfo = async () => {
  const memoInfo = await process.getProcessMemoryInfo();
  return { memoInfo, heap: process.getHeapStatistics() };
};

const start = () => {
  ipcMain.handle(MemoInfoEnum.GetMainMemoInfo, getMainMemoInfo);
};

const end = () => {
  ipcMain.off(MemoInfoEnum.GetMainMemoInfo, getMainMemoInfo);
};

/** 主进程内存状态监听 */
export default () => [start, end];
