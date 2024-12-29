const { execSync } = require('child_process');
const packageSettings = require('./package.json');
const { readChannelConfig } = require('./generate-build-env');

const defaultConfig = {
  version: '',
  staticVersion: '',
  shortHash: '',
  env: 'dev',
  channel: '',
  branch: '',
  cacheCleanupRequired: false
};

const getAppConfig = () => {
  const result = { ...defaultConfig };

  const defaultVersion = packageSettings.version;

  result.shortHash = execSync('git rev-parse --short HEAD').toString().trim();

  // dev 环境下总是显示当前提交的哈希
  const devHash = result.env === 'dev' ? result.shortHash : null;

  const branch = process.env.CI_COMMIT_BRANCH ?? execSync('git rev-parse --abbrev-ref HEAD').toString().trim();

  result.env = process.env.env ?? (process.env.CI ? 'test' : result.env);

  const channelConfig = readChannelConfig();
  if (!channelConfig.isDefault) {
    result.env = 'prod';
  }

  result.version = ['dev', 'test'].includes(result.env)
    ? devHash ?? process.env.CI_COMMIT_SHORT_SHA ?? defaultVersion
    : packageSettings.version;

  result.branch_channel = branch === 'dev' ? '' : branch.replace(/_/g, '-').replace(/\//g, '-');
  result.channel = process.env.channel;
  result.branch = branch;

  Object.keys(result).forEach(key => {
    if (key === 'env') return;

    result[key] = process.env[key] ?? result[key];
  });

  result.staticVersion = packageSettings.version;
  result.cacheCleanupRequired = packageSettings.config.cacheCleanupRequired;
  result.localServer = packageSettings.localServer;

  return { ...result, ...channelConfig };
};

module.exports = { getAppConfig };
