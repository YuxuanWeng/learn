const { copyFileSync, existsSync, readFileSync, writeFileSync } = require('fs');

const readChannelConfig = () => {
  const channel = process.env.channel;

  if (channel != null && channel !== '') {
    const fileName = `config.${channel}.json`;
    const channelExists = existsSync(fileName);

    if (!channelExists) {
      console.warn(`未找到渠道"${channel}"的配置文件，将以默认渠道构建`);
      console.warn(`请检查根目录下是否有配置文件${fileName}`);
    } else {
      const fileContent = readFileSync(fileName).toString();

      return JSON.parse(fileContent);
    }
  }

  const fileName = 'config.default.json';
  const channelExists = existsSync(fileName);

  if (!channelExists) {
    console.warn('未找到默认配置config.default.json');
  } else {
    const fileContent = readFileSync(fileName).toString();

    return { ...JSON.parse(fileContent), isDefault: true };
  }

  return undefined;
};

const generateBuildEnv = () => {
  const config = readChannelConfig();

  if (config != null) {
    const baseConfigs = ['PORT', 'VITE_API_ALGO_BASE', 'VITE_API_COMMON_BASE'];

    const defaultEnvLines = readFileSync('.env')
      .toString()
      .split('\n')
      .filter(line => baseConfigs.some(key => line.startsWith(key)));

    const result = [...defaultEnvLines].join('\n');
    writeFileSync('.env.local', result);
  } else {
    copyFileSync('.env', '.env.local');
  }
};

generateBuildEnv();

module.exports = { readChannelConfig };
