import { MenuItem, MenuItemConstructorOptions, app } from 'electron';
import { omsApp } from '../../models/oms-application';
import { isMac } from '../../utils/utools';
import { isDevToolsDisabled } from '../windows-tools';

const getViewMenuItem = (): MenuItemConstructorOptions[] => {
  const viewMenuItems: MenuItemConstructorOptions[] = [
    {
      label: '切换开发者工具',
      accelerator: isMac ? 'Alt+Command+I' : 'Ctrl+Shift+I',
      click(_item: unknown, focusedWindow: Electron.BrowserWindow | undefined) {
        if (!isDevToolsDisabled() && !focusedWindow?.isDestroyed()) {
          focusedWindow?.webContents?.toggleDevTools();
        }
      }
    },
    {
      type: 'separator'
    }
  ];
  // ..用来调试ui start
  const devViewMenuItems: MenuItemConstructorOptions[] = [
    {
      label: '重置缩放',
      accelerator: 'CmdOrCtrl+0',
      role: 'resetZoom'
    },
    {
      label: '放大窗口',
      accelerator: 'CmdOrCtrl+=',
      role: 'zoomIn'
    },
    {
      label: '缩小窗口',
      accelerator: 'CmdOrCtrl+-',
      role: 'zoomOut'
    }
  ];
  return !app.isPackaged ? viewMenuItems.concat(devViewMenuItems) : viewMenuItems;
  // ..用来调试ui end
};

export const getMenuTemplate = () => {
  const template: (MenuItemConstructorOptions | MenuItem)[] = [
    {
      label: '编辑',
      submenu: [
        {
          label: '撤销',
          accelerator: 'CmdOrCtrl+Z',
          role: 'undo'
        },
        {
          label: '重做',
          accelerator: 'Shift+CmdOrCtrl+Z',
          role: 'redo'
        },
        {
          type: 'separator'
        },
        {
          label: '剪切',
          accelerator: 'CmdOrCtrl+X',
          role: 'cut'
        },
        {
          label: '复制',
          accelerator: 'CmdOrCtrl+C',
          role: 'copy'
        },
        {
          label: '粘贴',
          accelerator: 'CmdOrCtrl+V',
          role: 'paste'
        },
        {
          label: '全选',
          accelerator: 'CmdOrCtrl+A',
          role: 'selectAll'
        }
      ]
    },
    {
      label: '查看',
      submenu: getViewMenuItem()
    },
    {
      label: '窗口',
      role: 'window',
      submenu: [
        {
          label: '最小化',
          accelerator: 'CmdOrCtrl+M',
          role: 'minimize'
        },
        {
          type: 'separator'
        }
      ]
    }
  ];

  if (isMac) {
    const name = app.getName();
    template.unshift({
      label: name,
      submenu: [
        {
          label: `关于 ${name}`,
          role: 'about'
        },
        {
          type: 'separator'
        },
        {
          label: '服务',
          role: 'services',
          submenu: []
        },
        {
          type: 'separator'
        },
        {
          label: `隐藏 ${name}`,
          accelerator: 'Command+H',
          role: 'hide'
        },
        {
          label: '隐藏其它',
          accelerator: 'Command+Alt+H',
          role: 'hideOthers'
        },
        {
          label: '显示全部',
          role: 'unhide'
        },
        {
          type: 'separator'
        },
        {
          label: '退出',
          accelerator: 'Command+Q',
          click: () => {
            omsApp.quit();
          }
        }
      ]
    });
  }

  return template;
};
