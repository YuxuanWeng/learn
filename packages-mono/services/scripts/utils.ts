import camelcase from 'camelcase';
import chalk from 'chalk';
import consola from 'consola';
import glob from 'fast-glob';
import fs from 'fs';
import path from 'path';
import type { BuiltInParserName } from 'prettier';
import { format } from 'prettier';
import prettierrc from '../.prettierrc';
import { pathOMSRoot } from './constants';
import {
  apiBaseAuthModuleRegex,
  apiCrmModuleRegex,
  apiDeprecated,
  apiDescRegex,
  apiLocalServerModuleRegex,
  apiMessageBeginRegex,
  apiMessageBeginSimpleRegex,
  apiMethodRegex,
  apiModuleRegex,
  apiUrlRegex,
  endRegex,
  enumBeginRegex,
  enumFieldRegex,
  getApiNameRegex,
  messageBeginRegex,
  messageFieldRegex
} from './regex';

export const getIdlPath = (project = 'bdm') => {
  const idlProjectName = 'idl';
  const pathIdl = path.resolve(pathOMSRoot, `../${idlProjectName}`);

  if (!fs.existsSync(pathIdl)) {
    throw new Error('Should provide the absolute path of proto project！');
  }

  return path.resolve(pathIdl, project);
};

export const getCommonPath = () => {
  const commonProjectName = 'common';
  const pathCommon = path.resolve(pathOMSRoot, `../${commonProjectName}`);

  if (!fs.existsSync(pathCommon)) {
    throw new Error('Should provide the absolute path of common project！');
  }

  return pathCommon;
};

/**
 * @description 获取 proto 文件信息
 * @param inputPath bdm-idl 项目路径
 */
export const getProtoPaths = async (inputPath: string, source = '(bdm_bds_*|common|enum_type).proto') => {
  const pathBdmIdlApiV1 = path.resolve(inputPath, 'api/v1');
  const protoPaths = await glob(source, { cwd: pathBdmIdlApiV1 });
  return protoPaths.map(p => path.resolve(pathBdmIdlApiV1, p));
};

/**
 * @description 格式化代码
 * @param code 代码
 */
export const formatCode = (code: string, parser: BuiltInParserName = 'typescript') => {
  return format(code, { parser, ...prettierrc });
};

/**
 * @description 匹配 message 开端
 * @param line 单行文件数据切片
 * @param match 正则匹配数组
 */
export const matchMessageBegin = (line: string, match: RegExpMatchArray) => {
  const result: string[] = [];
  const [, protoType, , , , comment] = match;
  let type = protoType;
  if (protoType.endsWith('Struct')) {
    type = protoType.substring(0, protoType.length - 'Struct'.length);
  }

  if (comment) result.push(`// ${comment.trim()}`);
  result.push(`export type ${type} = {`);

  // 如果直接以 } 结尾，需要直接补上 }
  if (line.endsWith('}')) {
    result.push('// None in here...', '\n', '};', '');
  }

  return { result, type };
};

/**
 * @description 将 go 数据类型转换为 js 数据类型
 * @param goType go 数据类型
 */
export const goType2JSType = (goType: string) => {
  if (goType.startsWith('int') || goType.startsWith('float') || goType.startsWith('double')) {
    return 'number';
  }
  if (goType.startsWith('bytes')) return 'string';
  if (goType.startsWith('bool')) return 'boolean';
  if (goType.startsWith('string')) return 'string';
  return 'string';
};

/**
 * @description 匹配 message 字段
 * @param line 解析行原文
 * @param match 正则匹配数组
 * @param enumImportCallback 需要 enum 类型引入回调
 * @param commonTypeImportCallback 需要 common 类型引入回调
 */
export const matchMessageField = (
  line: string,
  match: RegExpMatchArray,
  enumImportCallback?: (type: string) => void,
  commonTypeImportCallback?: (type: string) => void
) => {
  const result: string[] = [];
  const [, optionalOrRepeated, protoType, mapFirstType, mapSecondType, field, , , , deprecated, , , , comment] = match;

  // 是否为可选字段
  const isOptional = optionalOrRepeated?.startsWith('optional');
  // 是否为数组类型
  const isRepeated = optionalOrRepeated?.startsWith('repeated');
  // 是否已废弃
  const isDeprecated = deprecated === 'true' || line.includes('deprecated');

  const optionFlag = isOptional || isRepeated || isDeprecated ? '?' : '';
  const repeatedFlag = isRepeated ? '[]' : '';

  // 如果该字段被废弃，则添加 @deprecated 注释
  if (isDeprecated) result.push('/** @deprecated */');

  let type = protoType;
  if (protoType.startsWith('int') || protoType.startsWith('float') || protoType.startsWith('double')) {
    type = goType2JSType(protoType);
  } else if (protoType.startsWith('bytes')) {
    type = goType2JSType(protoType);
  } else if (protoType.startsWith('bool')) {
    type = goType2JSType(protoType);
  } else if (protoType.startsWith('map')) {
    type = `Record<${goType2JSType(mapFirstType)}, ${goType2JSType(mapSecondType)}>`;
  } else if (protoType.endsWith('Enum')) {
    type = protoType.substring(0, protoType.length - 'Enum'.length);
    enumImportCallback?.(type);
  } else if (protoType.endsWith('Struct')) {
    type = protoType.substring(0, protoType.length - 'Struct'.length);
    commonTypeImportCallback?.(type);
  } else if (type !== 'string') {
    commonTypeImportCallback?.(type);
  }

  let content = `${field}${optionFlag}: ${type}${repeatedFlag};`;
  if (comment) content += ` // ${comment.trim()}`;

  result.push(content);
  return result;
};

/**
 * @description 匹配 message 单行注释
 * @param line 单行文件数据切片
 */
export const matchMessageCommentLine = (line: string) => {
  const messageCommentLineRegex = /^\s*\/\//;
  const match = line.match(messageCommentLineRegex);
  if (match?.input) {
    return [match.input.replace(/(?<=\/\/)(\S)/, ' $1')];
  }
  return [];
};

/**
 * @description 匹配 message 末端
 * @param lines 文件数据切片
 * @param line 单行文件数据切片
 * @param index 文件数据切片索引
 */
export const matchMessageEnd = (lines: string[], line: string, index: number) => {
  const match = line.match(endRegex);

  if (match) {
    if (lines[index - 1]?.endsWith('{')) {
      return ['// None in here...', '\n', '};', ''];
    }
    return ['};', ''];
  }
  return [];
};

/**
 * @description 根据文件路径读取文件
 * @param filePath 文件路径
 */
export const readFile = (filePath: string) => {
  if (!fs.existsSync(filePath)) {
    consola.error(`不存在路径为：“${filePath}” 的文件`);
    return undefined;
  }

  const data = fs.readFileSync(filePath, 'utf8');
  return data;
};

/**
 * @description 根据文件路径解析文件
 * @param filePath 文件路径
 * @param transformer 文件转换器
 */
export const parseFile = async (filePath: string, transformer: (fileData: string) => Promise<string>) => {
  consola.info(chalk.magenta(`Start parsing ${filePath}...`));

  const data = readFile(filePath);
  if (!data) return undefined;

  const code = await transformer(data);
  return code;
};

/**
 * @description 生成类型文件
 * @param filePath 文件路径
 * @param transformer 文件转换器
 * @param pathOutput 文件输出路径
 */
export const generateFile = async (
  filePath: string,
  transformer: (fileData: string) => Promise<string>,
  pathOutput: string
) => {
  const code = await parseFile(filePath, transformer);
  if (code) {
    fs.writeFileSync(pathOutput, code, 'utf8');
  }
};

export const apiTypesTransformer = async (fileData: string) => {
  const selfEnums = new Set<string>();
  const selfCommonTypes = new Set<string>();
  const enumImports = new Set<string>();
  const commonTypeImports = new Set<string>();

  const requestComments = ['/**'];

  const contents: string[] = [];
  const lines = fileData.split(/\r?\n/);

  let apiModule = '';
  let crmApiModule = '';
  let exportFileName = '';

  let isTransformingEnum = false;

  for (const [index, line] of lines.entries()) {
    let match = line.match(apiDescRegex);
    if (match) {
      const [desc] = match;
      requestComments.push(` * @description${desc}`);
      continue;
    }

    match = line.match(apiMethodRegex);
    if (match) {
      const [method] = match;
      requestComments.push(` * @method${method}`);
      continue;
    }

    match = line.match(apiUrlRegex);
    if (match) {
      const [url] = match;
      requestComments.push(` * @url${url}`);

      match = url.match(apiModuleRegex);
      if (match) {
        const [, module] = match;
        apiModule = module;
      }

      const baseMatch = url.match(apiBaseAuthModuleRegex);

      if (baseMatch) {
        apiModule = 'auth';
      }

      const crmMatch = url.match(apiCrmModuleRegex);
      if (crmMatch) {
        const [, module] = crmMatch;
        crmApiModule = module;
        apiModule = 'crm';
      }

      continue;
    }

    match = line.match(apiDeprecated);
    if (match) {
      const [deprecated] = match;
      requestComments.push(` * @deprecated${deprecated}`);
      continue;
    }

    match = line.match(enumBeginRegex);
    if (match) {
      const [, type] = match;
      contents.push(`export enum ${type} {`);

      selfEnums.add(type);
      isTransformingEnum = true;

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

    match = line.match(messageBeginRegex);
    if (match) {
      const { result, type } = matchMessageBegin(line, match);
      selfCommonTypes.add(type);
      contents.push(...result);
      continue;
    }

    match = line.match(apiMessageBeginRegex) ?? line.match(apiMessageBeginSimpleRegex);
    if (match) {
      const [apiName, messageType] = match;
      const namespace = camelcase(apiName, { pascalCase: true });

      if (messageType === 'request') {
        // 为上一行新增相关的注释
        requestComments.push('*/');
        contents.push(...requestComments, `export declare namespace ${namespace} {`);
      }

      const type = camelcase(messageType, { pascalCase: true });
      contents.push(` type ${type} = {`);

      // 如果直接以 } 结尾，需要直接补上 }
      if (line.endsWith('}') && !isTransformingEnum) {
        contents.push('// None in here...', '\n', '};', '');
      }

      if (apiModule === 'crm') match = line.match(getApiNameRegex(crmApiModule));
      else match = line.match(getApiNameRegex(apiModule));

      if (match) {
        const [fileName] = match;
        const localServerMatch = fileName.match(apiLocalServerModuleRegex);
        if (localServerMatch) {
          const [name] = localServerMatch;
          apiModule = 'local-server';
          exportFileName = name;
        } else {
          exportFileName = fileName;
        }
      }
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

    if (endRegex.test(line)) {
      if (!isTransformingEnum) {
        contents.push(...matchMessageCommentLine(line), ...matchMessageEnd(lines, line, index));

        isTransformingEnum = false;
      } else {
        contents.push('};', '');
        continue;
      }
    }
  }
  contents.push('}');

  let resultContents: string[] = [];

  const enumImportsArr = [...enumImports].filter(e => {
    return !selfEnums.has(e);
  });

  const commonTypeImportsArr = [...commonTypeImports].filter(type => {
    return !selfCommonTypes.has(type);
  });

  if (commonTypeImportsArr.length) {
    const commonTypeImportContents = [`import type { ${commonTypeImportsArr.join(',')} } from '../common';`, ''];
    resultContents = [...resultContents, ...commonTypeImportContents];
  }

  if (enumImportsArr.length) {
    const enumImportContents = ['import {', [...enumImportsArr].join(','), "} from '../enum';", ''];
    resultContents = [...resultContents, ...enumImportContents];
  }

  resultContents = [...resultContents, ...contents];

  let code: string;
  try {
    code = await formatCode(resultContents.join('\n'));
  } catch {
    code = resultContents.join('\n');
  }

  return { code, apiModule, exportFileName };
};

/**
 * 清理类型目录
 * @param dirPath 目录地址
 * @param isAlgo 是否为algo的目录
 */
export const cleanTypesDir = async (dirPath: string, isAlgo = false) => {
  const files = fs.readdirSync(dirPath);
  for await (const f of files) {
    const p = `${dirPath}/${f}`;
    const remove = isAlgo ? f === 'algo' : f !== 'algo';
    if (fs.statSync(p).isDirectory() && remove && f !== 'data-localization-manual') {
      fs.rmSync(p, { recursive: true, force: true });
    }
  }
};
