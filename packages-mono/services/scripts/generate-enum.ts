import chalk from 'chalk';
import consola from 'consola';
import fs from 'fs';
import path from 'path';
import { pathTypes } from './constants';
import { endRegex, enumBeginRegex, enumFieldRegex } from './regex';
import { formatCode, generateFile, getIdlPath, getProtoPaths } from './utils';

const transformer = (fileData: string) => {
  const contents: string[] = [];
  const lines = fileData.split(/\r?\n/);

  // 处理文件每一行数据，转换为对应的 TypeScript 类型
  for (const line of lines) {
    let match = line.match(enumBeginRegex);
    if (match) {
      const [, type] = match;
      contents.push(`export enum ${type} {`);

      // 如果直接以 } 结尾，需要直接补上 }
      if (line.endsWith('}')) {
        contents.push('// None in here...', '\n', '};', '');
      }
      continue;
    }

    match = line.match(enumFieldRegex);
    if (match) {
      const [, field, seq, , , , comment] = match;
      if (!field.endsWith('Unknown')) {
        let content = `${field} = ${seq},`;
        if (comment) content += ` // ${comment.trim()}`;

        const isDeprecated = line.includes('deprecated');
        if (isDeprecated) contents.push('/** @deprecated */');

        contents.push(content);
      }
      continue;
    }

    match = line.match(endRegex);
    if (match) contents.push('};', '');
  }

  const code = formatCode(contents.join('\n'));
  return code;
};

const generateEntry = async () => {
  const code = await formatCode(`
    export * from './bdm-enum';
    export * from './bds-enum';
    export * from './algo-enum';
  `);

  fs.writeFileSync(path.resolve(pathTypes, 'enum.ts'), code, 'utf8');
};

(async () => {
  const pathBdmIdl = getIdlPath();

  const [bdmEnumPath] = await getProtoPaths(pathBdmIdl, 'enum_type.proto');
  const [bdsEnumPath] = await getProtoPaths(pathBdmIdl, 'bdm_bds_enum_type.proto');

  consola.info(chalk.magenta('Start generating enum...'));

  await generateFile(bdmEnumPath, transformer, path.resolve(pathTypes, 'bdm-enum.ts'));
  await generateFile(bdsEnumPath, transformer, path.resolve(pathTypes, 'bds-enum.ts'));

  await generateEntry();

  consola.info(chalk.magenta('Done!'));
})();
