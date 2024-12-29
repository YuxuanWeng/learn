import { exec } from 'child_process';
import { createWriteStream, existsSync, mkdirSync, readdirSync, rmdirSync, statSync, unlinkSync } from 'fs';
import https from 'https';
import { join } from 'path';
import { argv } from 'process';
import packageSettings from '../../package.json';

let isMac = process.platform === 'darwin';

switch (argv.at(2)) {
  case '--win':
    isMac = false;
    break;
  case '--mac':
    isMac = true;
    break;
  default:
    break;
}

const { version, shortHash } = packageSettings.localServer;

const targetVersion = shortHash || version || 'latest';

const macURL = `https://tools.zoople.cn/local_server/${targetVersion}/nowin_darwin_amd64_v1/local_server`;
const winURL = `https://tools.zoople.cn/local_server/${targetVersion}/win_windows_amd64_v1/local_server.exe`;

const resourcesRoot = 'resources/exes';
const path = join(resourcesRoot, targetVersion);

const macPath = join(path, 'OMS_LocalServer');
const winPath = join(path, 'OMS_LocalServer.exe');

async function download(url: string, target: string) {
  return new Promise((resolve, reject) => {
    try {
      console.log(`下载更新local_server ${isMac ? 'MAC' : 'WIN'} ${targetVersion}...`);
      const writeStream = createWriteStream(target);
      https.get(url, response => {
        response.pipe(writeStream);
        response.on('end', () => {
          console.log('OMS_LocalServer下载成功');
          resolve(void 0);
        });
      });
    } catch (e) {
      console.log('local_serve更新失败');
      reject(e);
    }
  });
}

const removeDir = (uri: string) => {
  const files = readdirSync(uri);
  for (const file of files) {
    const filePath = join(uri, file);
    const stats = statSync(filePath);
    if (stats.isDirectory()) {
      removeDir(filePath);
    } else {
      unlinkSync(filePath);
    }
  }
  rmdirSync(uri);
};

if (!existsSync(isMac ? macPath : winPath)) {
  if (existsSync(resourcesRoot)) {
    removeDir(resourcesRoot);
  }
  mkdirSync(resourcesRoot);
  mkdirSync(path);
  if (isMac) {
    download(macURL, macPath).then(() => {
      exec(`chmod 777 ${macPath}`);
    });
  } else {
    download(winURL, winPath);
  }
}
