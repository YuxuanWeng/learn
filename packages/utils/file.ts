import { AppEnv } from '@fepkg/common/types';

/** 基本全面的MIME与文件扩展类型的映射 */
export const MimeExtensionMap = {
  'application/pdf': 'pdf',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/bmp': 'bmp',
  'image/webp': 'webp',
  'audio/mpeg': 'mp3',
  'audio/wav': 'wav',
  'audio/ogg': 'ogg',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/quicktime': 'mov',
  'application/zip': 'zip',
  'application/x-rar-compressed': 'rar',
  'application/x-tar': 'tar',
  'application/x-7z-compressed': '7z',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/vnd.ms-powerpoint': 'ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
  'text/plain': 'txt',
  'text/html': 'html',
  'application/json': 'json'
};

export const FileExtensions = new Set(Object.values(MimeExtensionMap));

/** 获得 DataTransferItemList 中为 item.kind 为 file 的 DataTransferItem */
export const getDataTransferFileItems = (transfer: DataTransfer | null) => {
  const res: DataTransferItem[] = [];
  const items = transfer?.items ?? [];

  if (!items?.length) return res;

  for (const item of items) {
    if (item.kind === 'file' && item.type) res.push(item);
  }

  return res;
};

/** 获取文件扩展名 */
export const getFileExtension = (filetype: string) => MimeExtensionMap[filetype] || '';

/**
 * @description 获取 file picker 接受的文件类型
 * @param accepts 接受类型集合，集合中每项格式与 File type 格式一致
 *  */
export const getFilePickerAccept = (accepts: Set<string>) => {
  const accept: FilePickerAcceptType['accept'] = {};

  for (const item of accepts) {
    const [, extension] = item.split('/');
    accept[item] = [`.${extension}`];
  }

  // 返回值会得到一个类似这样的对象 -> { 'image/jpg': ['.jpg'], 'image/png': ['.png'] } }]
  return accept;
};

/**
 * @description 检查文件大小是否符合限制
 * @param file 文件
 * @param limit 限制大小，默认为 20，单位 mb
 */
export const checkFileSize = (file: File | null, limit = 20) => {
  if (!file) return false;

  const { size } = file ?? {};
  const kbSize = size / 1024;
  const mbSize = kbSize / 1024;

  return limit > mbSize;
};

/**
 * @description 检查文件类型是否符合限制
 * @param file 文件
 * @param accepts 接受类型集合，集合中每项格式与 File type 格式一致
 */
export const checkFileType = (file: File | null, accepts: Set<string>) => {
  if (!file) return false;

  const { type } = file ?? {};

  return accepts.has(type ?? '');
};

/**
 * @description 检查 DataTransferItem 类型是否符合限制
 * @param item DataTransferItem
 * @param accepts 接受类型集合，集合中每项格式与 File type 格式一致
 */
export const checkDataTransferItemType = (item: DataTransferItem | undefined, accepts: Set<string>) => {
  if (!item) return false;

  const { type } = item ?? {};

  return accepts.has(type ?? '');
};

/** 转换 minio 上传 url */
export const transformMinioUploadUrl = (uploadUrl: string, apiEnv?: AppEnv) => {
  // 本地开发环境需要由 vite server 代理请求
  if (window.location.host.startsWith('localhost')) {
    const url = new URL(uploadUrl);
    const proxyUrl = `/${apiEnv}${url.pathname}${url.search}`;
    return proxyUrl;
  }

  // 打包后无需处理，直接使用即可
  return uploadUrl;
};
