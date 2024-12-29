import { Button } from '@fepkg/components/Button';
import { message } from '@fepkg/components/Message';
import { captureMessage } from '@sentry/react';
import { useTableState } from '@/pages/Quote/Collaborative/providers/TableStateProvider';
import { useUpload } from '@/pages/Quote/Collaborative/providers/UploadProvider';
import { filePickerOpts } from '@/pages/Quote/Collaborative/utils/file';

export const UploadButton = () => {
  const { updateKeepingTimestamp } = useTableState();
  const { uploadState, changeUploadState, parseImage } = useUpload();

  const handleClick = async () => {
    let file: File | undefined;
    let isAbortError = false;

    // 打开文件，用这种方法是因为 OMS 内已支持且无需兼容版本
    try {
      changeUploadState('selecting', true);

      const [fileHandle] = await window.showOpenFilePicker(filePickerOpts);
      file = await fileHandle.getFile();
    } catch (err) {
      isAbortError = (err as Error)?.name === 'AbortError';
      // 如果不是用户手动取消抛出的错误，需要收集错误信息
      if (!isAbortError) {
        captureMessage('Open file error.', { extra: { err } });
        message.error('获取文件资源失败，请重试');
        console.error(err);
      }
    } finally {
      changeUploadState('selecting', false);
    }

    await parseImage(file);
    updateKeepingTimestamp({ reset: true });
  };

  return (
    <Button
      className="w-[78px] h-7 px-0"
      plain
      loading={uploadState.uploading}
      disabled={uploadState.selecting || uploadState.uploading}
      onClick={handleClick}
    >
      {uploadState.uploading ? '上传中' : '上传图片'}
    </Button>
  );
};
