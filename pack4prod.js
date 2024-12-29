const { spawn, execSync } = require('child_process');
const builder = require('electron-builder');
const packageSettings = require('./package.json');
const { getAppConfig } = require('./get-app-config');
const consola = require('consola');

const execWithLog = script => {
  return new Promise((resolve, reject) => {
    const ls = spawn(script, [], { shell: true });
    ls.on('error', err => {
      consola.error(`command error: ${JSON.stringify(err)}`);
      reject(err);
    });

    ls.on('exit', code => {
      consola.success(`exit with code ${code}`);
      if (code === 0) resolve();
      else reject(new Error(`exit with code ${code}`));
    });

    ls.stdout.on('data', data => {
      consola.info(`stdout: ${data?.toString()}`);
    });

    ls.stderr.on('data', data => {
      consola.error(`stderr: ${data?.toString()}`);
    });
  });
};

const appConfig = getAppConfig();

if (appConfig.env === 'prod') {
  const nodeVersion = execSync('node --version').toString();

  const match = nodeVersion.match(/v(\d+)\.\d+\.\d+/);

  // win7兼容性只针对Windows系统
  if ((match == null || match[1] !== '16') && process.platform === 'win32') {
    throw new Error('构建生产包请使用node16以保证win7兼容性');
  }
}

// 实际上是 "上海矢合科技有限公司"
// electron-builder 对中文字符的支持有问题
const certificateSubjectName = appConfig.signComp ?? '�Ϻ�ʸ�ϿƼ����޹�˾';

const options = { ...packageSettings.build };
options.electronDownload = {
  mirror: 'https://mirrors.huaweicloud.com/electron/'
};

if (appConfig.env === 'prod') {
  options.win.certificateSubjectName = certificateSubjectName;
}

if (appConfig.channel === 'xintang-uat') {
  options.productName = 'OMS UAT';
}

(async () => {
  const start = Date.now();
  await execWithLog('pnpm run build');

  // electron-builder
  await builder.build({
    config: options
  });

  const end = Date.now();
  const total = new Date(end - start);
  consola.success(`总计用 ${total.getUTCHours()}时 ${total.getMinutes()}分 ${total.getSeconds()}秒`);

  if (appConfig.env === 'prod') {
    await execWithLog('node .uploadoss.js');
  }
})();
