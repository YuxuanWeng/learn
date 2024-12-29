import { LayoutSettingsEnum } from 'app/types/layout-settings';
import { changeBoundsByParams } from 'app/utils/bounds-helper-v2';
import { LAYOUT_VERSION } from 'app/utils/layouts';
import { printLog, printWindowLayout } from 'app/utils/print-log';
import { createDialog } from 'app/windows/dialog/dialog';
import { ipcMain } from 'electron';
import { WindowManager } from '../models/windows-manager';
import { userInitConfigStorage } from '../store/user-init-config-storage';
import { windowOpenedStorage } from '../store/window-opened-storage';

const loadLayoutWindowV2 = () => {
  try {
    const keys = windowOpenedStorage.getKeys();
    const allLayout = keys.map(key => windowOpenedStorage.get(key));
    const userConfig = userInitConfigStorage.getUserInitConfig();
    const userId = userConfig?.userInfo?.user_id;
    const productType = userConfig?.productType;

    const layout = allLayout.filter(
      item => item.userId === userId && item.version === LAYOUT_VERSION && item.productType === productType
    );
    for (const item of layout) {
      printWindowLayout('开始恢复布局', item);
      const curWindow = WindowManager.get(item.name);
      if (curWindow === null) {
        // item.onReadyShow = win => {
        //   changeWindowBounds(win as WindowInstance, item.winBounds);
        //   win?.object?.show();
        // };
        createDialog(item, undefined, undefined, true);
      } else {
        curWindow.isRefreshing = true;
        curWindow.reload();
        curWindow.object?.once('ready-to-show', () => {
          changeBoundsByParams(curWindow, item.winBounds);
          curWindow.isRefreshing = false;
        });
      }
    }
  } catch (err) {
    printLog('布局恢复出现错误', 'loadLayoutWindowV2');
    console.log(`恢复布局出现错误：${err}`);
  }
};

const start = () => {
  ipcMain.handle(LayoutSettingsEnum.LoadLayoutWindowV2, loadLayoutWindowV2);
};

const end = () => {
  ipcMain.off(LayoutSettingsEnum.LoadLayoutWindowV2, loadLayoutWindowV2);
};

/** 布局设置相关 */
export default () => [start, end];
