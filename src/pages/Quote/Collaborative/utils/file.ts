import { message } from '@fepkg/components/Message';
import { checkDataTransferItemType, checkFileSize, checkFileType, getFilePickerAccept } from '@packages/utils/file';

type FileCheck = {
  /** check 条件 */
  condition: () => boolean;
  /** 错误信息 */
  errorMessage: string;
};

export const filePickerAccepts = new Set(['image/jpg', 'image/jpeg', 'image/png']);
export const filePickerOpts = { types: [{ description: 'Images', accept: getFilePickerAccept(filePickerAccepts) }] };

const getFileChecks = (file: File | null, item: DataTransferItem | undefined): FileCheck[] => [
  {
    condition: () => checkFileType(file, filePickerAccepts) || checkDataTransferItemType(item, filePickerAccepts),
    errorMessage: '仅支持jpg、jpeg、png格式图片'
  },
  { condition: () => checkFileSize(file, 1), errorMessage: '图片过大，仅限于1MB以内图片上传识别' }
];

export const checkFile = (file: File, toast: boolean) => {
  const checks = getFileChecks(file, undefined);

  for (const check of checks) {
    if (!check.condition()) {
      if (toast) message.error(check.errorMessage);
      return check.errorMessage;
    }
  }

  return null;
};

export const checkDataTransferItems = (items: DataTransferItem[], toast: boolean) => {
  let errorMessage = '';

  const [item] = items ?? [];
  const file = item?.getAsFile();

  const [first, second] = getFileChecks(file, item);

  const checks: FileCheck[] = [
    { condition: () => !!file || item?.kind === 'file', errorMessage: '仅支持本地/本系统图片' },
    { condition: () => items.length <= 1, errorMessage: '仅支持单个文件上传' },
    first
  ];

  // 如果有传入文件，需要对文件大小进行检测
  if (file) checks.push(second);

  for (const check of checks) {
    if (!check.condition()) {
      errorMessage = check.errorMessage;
      if (toast) message.error(errorMessage);
      break;
    }
  }

  return { file, errorMessage };
};
