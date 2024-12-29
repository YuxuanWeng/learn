import chalk from 'chalk';
import consola from 'consola';
import fs from 'fs';
import path from 'path';
import { pathRoot } from './constants';
import { formatCode, generateFile, getCommonPath, parseFile } from './utils';

const getAccessPath = () => {
  const pathCommon = getCommonPath();
  const pathAccess = path.resolve(pathCommon, 'constant/access/access.go');

  if (!fs.existsSync(pathAccess)) {
    throw new Error('Should provide the absolute path of access file！');
  }

  return pathAccess;
};

const enumBeginRegex = /^const\s*\(/;
const enumEndRegex = /^\)\s*/;
const codeRegex = /^\s+([\dA-Za-z]+)\s*((\s*)(\/\/)(\s)?(.*))?$/;

const deprecatedRegex = /deprecated/;

const transformer = async (fileData: string) => {
  const contents = ['export enum AccessCode {', 'DefaultCodeEnum,'];
  const lines = fileData.split(/\r?\n/);

  for (const line of lines) {
    const match = line.match(codeRegex);
    if (match) {
      const [, field, , , , , comment] = match;

      if (comment) {
        if (deprecatedRegex.test(comment)) {
          contents.push(`/** @deprecated ${comment.replace(deprecatedRegex, '').replaceAll(/\s/g, '')} */`);
        } else {
          contents.push(`/** ${comment.replaceAll(/\s/g, '')} */`);
        }
      }
      contents.push(`${field},`);
      continue;
    }
  }

  contents.push('};');

  const code = formatCode(contents.join('\n'));
  return code;
};

const checkEnumLength = async (pathOriginAccess: string, pathAccess: string) => {
  let goEnumBeginIdx = 0;
  let goEnumEndIdx = 0;
  let goEnumLength = 0;
  let goBlankLength = 0;

  await parseFile(pathOriginAccess, async fileData => {
    const lines = fileData.split(/\r?\n/);

    for (let i = 0, len = lines.length; i < len; i++) {
      const line = lines[i];

      let match = line.match(enumBeginRegex);
      // 这里加一是因为文件内行数序号是从 1 开始的，开始行序号会少 1
      if (match) goEnumBeginIdx = i + 1;

      // 移除文件中的空白行
      if (!line.trim() && goEnumBeginIdx && i > goEnumBeginIdx) {
        goBlankLength += 1;
      }

      match = line.match(enumEndRegex);
      if (match) {
        goEnumEndIdx = i;
        break;
      }
    }

    // 这里使用开始行 idx 减去结束行 idx 与空白行得出枚举值数量，是因为怕识别 Code 的正则出现错误而识别漏了
    goEnumLength = goEnumEndIdx - goEnumBeginIdx - goBlankLength;

    return '';
  });

  const { AccessCode } = (await import(pathAccess)) as { AccessCode: any };

  let enumLength = 0;

  for (const [, code] of Object.entries(AccessCode)) {
    if (!Number.isNaN(Number(code))) {
      enumLength++;
    }
  }

  if (goEnumLength !== enumLength) {
    throw new Error(
      `与 ${pathOriginAccess} 文件中枚举值数量对应不上，access.go 中枚举值数量为：${goEnumLength}，access-code.ts 中枚举值数量为：${enumLength}`
    );
  }
};

(async () => {
  const pathOriginAccess = getAccessPath();

  consola.info(chalk.magenta('Start generating access code...'));

  const pathAccess = path.resolve(pathRoot, 'access-code.ts');

  await generateFile(pathOriginAccess, transformer, pathAccess);

  consola.info(chalk.magenta('Checking access code enum length...'));

  await checkEnumLength(pathOriginAccess, pathAccess);

  consola.info(chalk.magenta('Done!'));
})();
