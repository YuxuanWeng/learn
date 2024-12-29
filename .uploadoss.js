/*
 * @Date: 2022-06-24 11:20:05
 * @LastEditors: lyj yongjiang.liu@zoople.cn
 * @LastEditTime: 2022-06-27 09:24:42
 * @FilePath: /bds-fe/.uploadoss.js
 */
const OSS = require('ali-oss');
const path = require('path');
const packageSettings = require('./package.json');

const fs = require('fs');

const jsyaml = require('js-yaml');
const { default: axios } = require('axios');
const { getAppConfig } = require('./get-app-config');

const { version: packageVersion } = packageSettings;
const { artifactName, productName } = packageSettings.build;
const { OSS_STS_INFO } = require('./oss.config');

const appConfig = getAppConfig();

const extReg = new RegExp(
  `^${artifactName
    .replace('${productName}', appConfig.channel === 'xintang-uat' ? 'OMS UAT' : productName)
    .replace('${version}', packageVersion)
    .replace('.${ext}', '\\.(exe|dmg)')}$`
);

const windowsYaml = 'latest.yml';
const macYaml = 'latest-mac.yml';

const applicationNames = [];
const yamlFileNames = [];

const files = fs.readdirSync('./dist');

const getOssPrefix = () => {
  const companyPrefix = appConfig.channel ? `${appConfig.channel}-dist/` : '';

  const envSuffix = appConfig.env === 'test' ? '' : `_${appConfig.env}`;

  return `${companyPrefix}dist${envSuffix}`;
};

const ossPrefix = getOssPrefix();

files.forEach(item => {
  const match = item.match(extReg);

  if (match) {
    applicationNames.push(item);
  }

  if (item === windowsYaml || item === macYaml) {
    yamlFileNames.push(item);
  }
});

let client = new OSS(appConfig.ossSts ?? OSS_STS_INFO);

const logProgress = (p, fileName) => {
  // Object的上传进度。
  console.log(`Uploading File: ${fileName}; Progress: ${(p * 100).toFixed(1)}%`);
};

const version = appConfig.version;

// 清理旧版本
async function clearOldVersion() {
  const allFiles = (
    await client.list(
      {
        prefix: ossPrefix + '/',
        'max-keys': 1000
      },
      {}
    )
  ).objects;

  const getTime = obj => new Date(obj.lastModified).getTime();
  allFiles.sort((a, b) => getTime(b) - getTime(a));

  const filesToDelete = allFiles
    .slice(200, -1)
    .filter(f => !f.name.includes('latest.yml'))
    .map(f => f.name);

  if (filesToDelete.length !== 0) {
    await client.deleteMulti(filesToDelete);
  }
}

const getKeySuffix = () => {
  const company = appConfig.channel === '' || appConfig.channel == null ? '' : `__${appConfig.channel}`;

  return `${company}`;
};

const latestKey = `auto-update-version-latest__${appConfig.env}${getKeySuffix()}`;

const baseURL = 'https://package.zoople.cn/api/v1/bdm/base/api/config/';

// 开始分片上传。
async function multipartUpload() {
  const getNewName = name => {
    const nameMatch = name.match(extReg);

    if (nameMatch == null) return name;

    if (appConfig.branch_channel && appConfig.env !== 'prod') {
      return `${appConfig.branch_channel}_${productName}-v${version}.${nameMatch[1]}`;
    }

    return `${appConfig.channel === 'xintang-uat' ? 'OMS UAT' : productName}-v${version}-installer.${nameMatch[1]}`;
  };

  let result;

  try {
    for (const name of yamlFileNames) {
      result = jsyaml.load(fs.readFileSync(`dist/${name}`));

      result.path = getNewName(result.path);

      result.files.forEach(f => (f.url = getNewName(f.url)));

      result.version = version;

      fs.writeFileSync(
        `dist/${name}`,
        jsyaml.dump(result, {
          lineWidth: 1000
        })
      );

      const newName = `${name.split('.yml')[0]}_${version}.yml`;

      fs.copyFileSync(`dist/${name}`, `dist/${newName}`);

      await client.multipartUpload(`${ossPrefix}/${newName}`, path.normalize(`./dist/${newName}`), {
        progress: p => logProgress(p, newName)
      });
      await client.head(`${ossPrefix}/${newName}`);

      try {
        await axios.get(client.signatureUrl(`${ossPrefix}/latest.yml`));
      } catch {
        await client.multipartUpload(`${ossPrefix}/latest.yml`, path.normalize(`./dist/${newName}`), {
          progress: p => logProgress(p, 'latest.yml')
        });
        await client.head(`${ossPrefix}/latest.yml`);
      }
    }

    for (const name of applicationNames) {
      const newName = getNewName(name);

      if (name.endsWith('.exe')) {
        console.log('checking version and overload');
        try {
          const curVersion = await axios.post(`${baseURL}get`, {
            namespace: 'bds_client',
            key: latestKey
          });

          const versionInfo = JSON.parse(curVersion.data.value);
          console.log('curVersion:', versionInfo.version);

          if (versionInfo.version === appConfig.version) {
            console.log('setting version');

            await axios.post(`${baseURL}set`, {
              namespace: 'bds_client',
              key: latestKey,
              value: JSON.stringify(result)
            });
          }
        } catch (e) {
          console.log('set version error:');
          console.log(e);
        }
      }

      await client.multipartUpload(`${ossPrefix}/${newName}`, path.normalize(`./dist/${name}`), {
        progress: p => logProgress(p, newName)
      });
      await client.head(`${ossPrefix}/${newName}`);
    }
  } catch (e) {
    // 捕获超时异常。
    if (e.code === 'ConnectionTimeoutError') {
      console.log('TimeoutError');
      // do ConnectionTimeoutError operation
    }
    console.log(e);
  }
}

(async () => {
  await clearOldVersion();
  await multipartUpload();
})();
