import chalk from 'chalk';
import consola from 'consola';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import { pathTypes } from './constants';
import { enumBeginRegex, enumFieldRegex, messageBeginRegex, messageFieldRegex } from './regex';
import {
  apiTypesTransformer,
  formatCode,
  getIdlPath,
  getProtoPaths,
  matchMessageBegin,
  matchMessageCommentLine,
  matchMessageEnd,
  matchMessageField,
  readFile
} from './utils';

enum MatchingType {
  None,
  Enum,
  Type
}

const getIsApiFile = (filePath: string) => !filePath.endsWith('common.proto') && !filePath.endsWith('enum_type.proto');

// 算法侧idl由于重名而需要改名的内容
// [修改前名称，修改后名称]
const algoRenames: [string, string][] = [];

const commonTypeEnumImports = new Set<string>();

const transformer = async (fileData: string, filePath: string) => {
  const isApiFile = getIsApiFile(filePath);

  const selfCommonTypes = new Set<string>();
  const enumImports = new Set<string>();
  const commonTypeImports = new Set<string>();

  const enumContents: string[] = [];
  const typeContents: string[] = [];
  const lines = fileData.split(/\r?\n/);

  let matchingType = MatchingType.None;

  // 处理文件每一行数据，转换为对应的 TypeScript 类型
  for (const [index, line] of lines.entries()) {
    let match = line.match(enumBeginRegex);
    if (match) {
      matchingType = MatchingType.Enum;

      const [, type] = match;
      enumContents.push(`export enum ${type} {`);

      // 如果直接以 } 结尾，需要直接补上 }
      if (line.endsWith('}')) {
        enumContents.push('// None in here...', '\n', '};', '');
      }
      continue;
    }

    match = line.match(enumFieldRegex);
    if (match) {
      const [, field, seq, , , , comment] = match;
      if (!field.endsWith('Unknown')) {
        let content = `${field} = ${seq},`;
        if (comment) content += ` // ${comment.trim()}`;

        enumContents.push(content);
      }
      continue;
    }

    match = line.match(messageBeginRegex);
    if (match) {
      matchingType = MatchingType.Type;
      const { result, type } = matchMessageBegin(line, match);
      selfCommonTypes.add(type);
      typeContents.push(...result);
      continue;
    }

    match = line.match(messageFieldRegex);
    if (match) {
      const result = matchMessageField(
        line,
        match,
        type => {
          if (isApiFile) {
            enumImports.add(type);
          } else {
            commonTypeEnumImports.add(type);
          }
        },
        type => {
          if (isApiFile) {
            commonTypeImports.add(type);
          }
        }
      );

      typeContents.push(...result);
      continue;
    }

    typeContents.push(...matchMessageCommentLine(line));

    const endMatch = matchMessageEnd(lines, line, index);

    if (endMatch.length !== 0) {
      if (matchingType === MatchingType.Enum) {
        enumContents.push(...endMatch, '\n');
      }

      if (matchingType === MatchingType.Type) {
        typeContents.push(...endMatch);
        enumContents.push('\n');
      }

      matchingType = MatchingType.None;
    }
  }

  const enumCode = enumContents.join('\n');
  const typeCode = typeContents.join('\n');

  return {
    enumCode,
    typeCode,
    apiCode: !isApiFile ? undefined : (await apiTypesTransformer(fileData)).code,
    filePath
  };
};

const splitToParts = (code: string) => {
  const splitter = '\n\n';
  return code.split(splitter);
};

const getEnumOrTypeNameInPart = (part: string) => {
  const enumReg = /export enum (.*) {/;
  const typeReg = /export type (.*) = {/;

  const enumMatch = part.match(enumReg);
  const typeMatch = part.match(typeReg);

  return enumMatch?.[1] ?? typeMatch?.[1];
};

const parseForNameSpaceConflict = (content: string, bdmContents: string[]) => {
  const splittedAlgoTypes = splitToParts(content);

  const filtered: string[] = [];
  const imports: string[] = [];

  const typeNameWhiteList = new Set(['LiquidationSpeedTag']);

  splittedAlgoTypes
    // 若生成的type完全一致，则去除对应的type
    .forEach(part => {
      const name = getEnumOrTypeNameInPart(part);
      if (
        !bdmContents.map(i => i.replaceAll('\n', '')).includes(part.replaceAll('\n', '')) &&
        name &&
        !typeNameWhiteList.has(name)
      ) {
        filtered.push(part);
      } else if (name) {
        imports.push(name);
      }
    });

  // 若生成的type名称重复，则在type前增加“Algo”
  filtered.map(part => {
    const typeName = getEnumOrTypeNameInPart(part);

    if (typeName == null) return '';

    if (typeName != null && bdmContents.map(getEnumOrTypeNameInPart).includes(typeName)) {
      algoRenames.push([typeName, `Algo${typeName}`]);
    }

    return part;
  });

  return { contents: filtered.join('\n\n'), imports };
};

(async () => {
  const enumOutPut = path.resolve(pathTypes, 'algo-enum.ts');
  const bdsEnumPath = path.resolve(pathTypes, 'bds-enum.ts');
  const bdmEnumPath = path.resolve(pathTypes, 'bdm-enum.ts');

  const typeOutPut = path.resolve(pathTypes, 'algo-common.ts');
  const bdsTypePath = path.resolve(pathTypes, 'bds-common.ts');
  const bdmTypePath = path.resolve(pathTypes, 'bdm-common.ts');

  let enumContents = '';
  let typeContents = '';

  const pathBdmIdl = getIdlPath('algo');

  const protoPaths = await getProtoPaths(
    pathBdmIdl,
    '(algo_helper*|algo_bond_rec*|algo_abase_message_flow*|bond_recommend_api*|common).proto'
  );

  consola.info(chalk.magenta('Start generating algo type and enums...'));

  const transformedData = protoPaths.map(p => {
    consola.info(chalk.magenta(`transforming ${p}`));

    const data = readFile(p);

    if (data == null)
      return Promise.resolve({
        enumCode: '',
        typeCode: '',
        filePath: p,
        apiCode: undefined
      });

    return transformer(data, p);
  });

  (await Promise.all(transformedData)).forEach(d => {
    // enum 都整理进同一个文件
    enumContents += d.enumCode;

    // api类型归入各自文件，common类型则并入common
    if (d.apiCode) {
      const pathApiModule = path.resolve(pathTypes, 'algo');
      if (!existsSync(pathApiModule)) {
        mkdirSync(pathApiModule);
      }

      writeFileSync(
        path.resolve(
          pathApiModule,
          `${d.filePath
            .replace(/.*\/(algo_abase_|algo_bond_rec_recommend_api_|bond_recommend_api_)/, '')
            .replace(/.*\/(algo_helper_quick_chat_)/, 'quick-chat-')
            .replace('.proto', '')
            .replace(/_/g, '-')}.d.ts`
        ),
        d.apiCode,
        'utf8'
      );
    } else {
      typeContents += '\n';
      typeContents += d.typeCode;
    }
  });

  enumContents = await formatCode(enumContents);
  typeContents = await formatCode(typeContents);

  const bdsEnumCode = readFile(bdsEnumPath);
  const bdmEnumCode = readFile(bdmEnumPath);

  const splittedBdsEnum = bdsEnumCode == null ? [] : splitToParts(bdsEnumCode);
  const splittedBdmEnum = bdmEnumCode == null ? [] : splitToParts(bdmEnumCode);

  enumContents = parseForNameSpaceConflict(enumContents, [...splittedBdsEnum, ...splittedBdmEnum]).contents;

  algoRenames.forEach(rename => {
    enumContents = enumContents.replaceAll(rename[0], rename[1]);
  });

  enumContents = await formatCode(enumContents);
  writeFileSync(enumOutPut, enumContents, 'utf8');
  consola.info(chalk.magenta('Algo enums done!'));

  const bdsTypeCode = readFile(bdsTypePath);
  const bdmTypeCode = readFile(bdmTypePath);

  const splittedBdsType = bdsTypeCode == null ? [] : splitToParts(bdsTypeCode);
  const splittedBdmType = bdmTypeCode == null ? [] : splitToParts(bdmTypeCode);

  const typeParse = parseForNameSpaceConflict(typeContents, [...splittedBdsType, ...splittedBdmType]);
  typeContents = typeParse.contents;

  if (commonTypeEnumImports.size) {
    const enumImportContents = ['import {', [...commonTypeEnumImports].join(','), "} from './enum';", ''];
    typeContents = `${typeContents}\n`.concat(enumImportContents.join('\n'));
  }

  typeContents = `${typeContents}\n`.concat(
    ['import {', [...typeParse.imports].join(','), "} from './bds-common';", ''].join('\n')
  );

  algoRenames.forEach(rename => {
    typeContents = typeContents.replaceAll(rename[0], rename[1]);
    typeContents = typeContents.replaceAll(/(Algo){2,}/g, 'Algo');
  });

  typeContents = await formatCode(typeContents);
  writeFileSync(typeOutPut, typeContents, 'utf8');
  consola.info(chalk.magenta('Algo common types done!'));

  consola.info(chalk.magenta('Done!'));
})();
