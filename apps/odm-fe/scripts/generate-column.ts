import { formatCode, generateFile, getCommonPath } from '@fepkg/services/scripts/utils';
import chalk from 'chalk';
import consola from 'consola';
import fs from 'fs';
import path from 'path';

const getFilePath = () => {
  const pathCommon = getCommonPath();
  const pathFields = path.resolve(pathCommon, 'constant/market_notify_tag.go');

  if (!fs.existsSync(pathFields)) {
    throw new Error('Should provide the absolute path of Fields file！');
  }

  return pathFields;
};

const enumRegex = /^\s+([\dA-Za-z]*)\s*=\s*(\d+)((\s*)(\/\/)(\s)?(.*))$/;

const enumTransformer = async (fileData: string) => {
  const contents = ['export enum ColumnFieldsEnum {'];
  const lines = fileData.split(/\r?\n/);

  for (const line of lines) {
    const match = line.match(enumRegex);
    if (match) {
      const [, field, value, , , , , comment] = match;
      if (comment) {
        contents.push(`/** ${comment.replaceAll(/\s/g, '')} */`);
      }
      contents.push(`${field}=${value},`);
      continue;
    }
  }
  contents.push('};');

  const code = formatCode(contents.join('\n'));
  return code;
};

(async () => {
  const pathOriginFields = getFilePath();

  consola.info(chalk.magenta('Start generating ColumnFieldsEnum code...'));

  const pathFields = path.resolve('./src/common/types', 'column-fields-enum.ts');

  await generateFile(pathOriginFields, enumTransformer, pathFields);

  consola.info(chalk.magenta('Done!'));
})();
