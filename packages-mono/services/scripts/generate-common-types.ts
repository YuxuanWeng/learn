import chalk from 'chalk';
import consola from 'consola';
import fs from 'fs';
import path from 'path';
import { pathTypes } from './constants';
import { messageBeginRegex, messageFieldRegex } from './regex';
import {
  formatCode,
  generateFile,
  getIdlPath,
  getProtoPaths,
  matchMessageBegin,
  matchMessageCommentLine,
  matchMessageEnd,
  matchMessageField
} from './utils';

const transformer = (fileData: string) => {
  const selfCommonTypes = new Set<string>();
  const enumImports = new Set<string>();
  const commonTypeImports = new Set<string>();

  const contents: string[] = [];
  const lines = fileData.split(/\r?\n/);

  for (const [index, line] of lines.entries()) {
    let match = line.match(messageBeginRegex);
    if (match) {
      const { result, type } = matchMessageBegin(line, match);
      selfCommonTypes.add(type);
      contents.push(...result);
      continue;
    }

    match = line.match(messageFieldRegex);
    if (match) {
      const result = matchMessageField(
        line,
        match,
        type => {
          enumImports.add(type);
        },
        type => {
          commonTypeImports.add(type);
        }
      );

      contents.push(...result);
      continue;
    }

    contents.push(...matchMessageCommentLine(line), ...matchMessageEnd(lines, line, index));
  }

  let resultContents: string[] = [];

  const selfCommonTypesArr = new Set(selfCommonTypes);
  const commonTypeImportsArr = [...commonTypeImports].filter(item => {
    return !selfCommonTypesArr.has(item);
  });
  // 其他的 common 引用项理论上都是来自 bdm-common
  if (commonTypeImportsArr.length) {
    const commonTypeImportContents = ['import {', commonTypeImportsArr.join(','), "} from './bdm-common'", ''];
    resultContents = [...resultContents, ...commonTypeImportContents];
  }

  if (enumImports.size) {
    const enumImportContents = ['import {', [...enumImports].join(','), "} from './enum';", ''];
    resultContents = [...resultContents, ...enumImportContents];
  }

  resultContents = [...resultContents, ...contents];

  const code = formatCode(resultContents.join('\n'));
  return code;
};

const generateEntry = async () => {
  const code = await formatCode(`
    export * from './bdm-common';
    export * from './bds-common';
    export * from './algo-common';
  `);

  fs.writeFileSync(path.resolve(pathTypes, 'common.ts'), code, 'utf8');
};

(async () => {
  const pathBdmIdl = getIdlPath();

  const [bdmCommonTypesPath] = await getProtoPaths(pathBdmIdl, 'common.proto');
  const [bdsCommonTypesPath] = await getProtoPaths(pathBdmIdl, 'bdm_bds_common.proto');

  consola.info(chalk.magenta('Start generating common types...'));

  await generateFile(bdmCommonTypesPath, transformer, path.resolve(pathTypes, 'bdm-common.ts'));
  await generateFile(bdsCommonTypesPath, transformer, path.resolve(pathTypes, 'bds-common.ts'));

  await generateEntry();

  consola.info(chalk.magenta('Done!'));
})();
