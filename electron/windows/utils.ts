import { AppEnv } from '@fepkg/common/types';
import { app } from 'electron';
import { readdirSync, statSync, unlinkSync } from 'fs';
import net from 'net';
import { join } from 'path';
import { getAppConfig } from '../utils/get-app-config';

const hostMap: Record<AppEnv, string> = {
  test: 'https://api-test.zoople.cn',
  dev: 'https://api-dev.zoople.cn',
  uat: '',
  prod: ''
};

/** 返回应用程序目录的完整路径 */
export const getAppLocalPath = () => {
  return `${app.getAppPath()}/`;
};

/**
 * 准备打开传递的URL。如果它以“/”开头，它将以app目录作为前缀路径。
 * 如果它包含“{appBase}”，这个值也会被替换为应用程序路径。
 * */
export const readyURL = (url: string) => {
  if (url.startsWith('/')) return getAppLocalPath();
  return url.replace('{appBase}', getAppLocalPath() || '');
};

/**
 * 检测端口是否可用
 */
export const isPortAvailable = (port: number) => {
  return new Promise<boolean>(resolve => {
    const server = net.createServer().listen(port);
    server.on('listening', () => {
      server.close();
      resolve(true);
    });
    server.on('error', () => {
      server.close();
      resolve(false);
    });
  });
};

/**
 * 获取可用的端口
 * @port 最小尝试端口
 */
export const getAvailablePort = async (port: number): Promise<number> => {
  const res = await isPortAvailable(port);
  if (res) {
    return port;
  }
  port++;
  return getAvailablePort(port);
};

/**
 * 删除文件夹下所有问价及将文件夹下所有文件清空
 * @param path
 */
export const emptyDir = (path: string) => {
  const files = readdirSync(path);
  for (const file of files) {
    const filePath = join(path, file);
    const stats = statSync(filePath);
    if (stats.isDirectory()) {
      emptyDir(filePath);
    } else {
      unlinkSync(filePath);
    }
  }
};

/** 传入当前系统环境，获取trace/logger的host */
export const getApiHost = (env: AppEnv = 'dev') => {
  const appConfig = getAppConfig();

  if (env === 'prod') return appConfig.apiHost;
  return hostMap[env];
};
