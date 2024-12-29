import { message } from '@fepkg/components/Message';
import { fetchPreSign } from '@fepkg/services/api/upload/pre-sign-put';
import { OperationSource, UploadFileScene } from '@fepkg/services/types/enum';
import { captureMessage } from '@sentry/react';
import { useMemoizedFn } from 'ahooks';
import { createContainer } from 'unstated-next';
import { useImmer } from 'use-immer';
import { getFileExtension, transformMinioUploadUrl } from '@packages/utils/file';
import { addBondQuoteDraft } from '@/common/services/api/bond-quote-draft/add';
import { useProductParams } from '@/layouts/Home/hooks';
import { miscStorage } from '@/localdb/miscStorage';
import { checkFile } from '../utils/file';

const UploadContainer = createContainer(() => {
  const { productType } = useProductParams();

  const [uploadState, updateUploadState] = useImmer({
    selecting: false,
    uploading: false
  });

  const changeUploadState = useMemoizedFn(
    <T extends keyof typeof uploadState>(key: T, value: (typeof uploadState)[T]) => {
      updateUploadState(draft => {
        draft[key] = value;
      });
    }
  );

  const upload = useMemoizedFn(async (file?: File | null, scene = UploadFileScene.UploadFileSceneImage) => {
    if (!file) return undefined;

    changeUploadState('uploading', true);

    const invalid = checkFile(file, true);
    if (invalid) {
      changeUploadState('uploading', false);
      return undefined;
    }

    const extension = getFileExtension(file.type);

    const { upload_url, file_url } = await fetchPreSign({ scene, extension });

    if (!upload_url) {
      message.error('获取上传链接失败，请重试');
    } else {
      const url = transformMinioUploadUrl(upload_url, miscStorage?.apiEnv);
      // 上传文件，这里用 fetch 比内置的 request 更方便，因为不需要鉴权
      const { ok } = await fetch(url, { mode: 'cors', method: 'PUT', body: file });
      return ok ? file_url : undefined;
    }

    return undefined;
  });

  const parseImage = useMemoizedFn(
    async (file?: File | null, source = OperationSource.OperationSourceQuoteDraft, errorMsg = '上传失败，请重试') => {
      try {
        const fileUrl = await upload(file);
        if (!fileUrl) return;

        // 识别报价
        await addBondQuoteDraft({
          product_type: productType,
          img_url: fileUrl,
          img_name: file?.name,
          source
        });
      } catch (err) {
        captureMessage('Parsing image error.', { extra: { err } });
        message.error(errorMsg);
        console.error(err);
      } finally {
        changeUploadState('uploading', false);
      }
    }
  );

  return { uploadState, updateUploadState, changeUploadState, upload, parseImage };
});

export const UploadProvider = UploadContainer.Provider;
export const useUpload = UploadContainer.useContainer;
