import { DragEvent, useRef, useState } from 'react';
import cx from 'classnames';
import { message } from '@fepkg/components/Message';
import { IconAttentionFilled, IconDownloadFilled } from '@fepkg/icon-park-react';
import { FloatingPortal } from '@floating-ui/react';
import { useEventListener } from 'usehooks-ts';
import { FileExtensions, getDataTransferFileItems } from '@packages/utils/file';
import { DataTransferFormat } from '@/common/constants/data-transfer';
import { transformBlob2File, transformImageToBlob } from '@/components/Image/utils';
import { useTableState } from '@/pages/Quote/Collaborative/providers/TableStateProvider';
import { useUpload } from '@/pages/Quote/Collaborative/providers/UploadProvider';
import { checkDataTransferItems, checkFile } from '@/pages/Quote/Collaborative/utils/file';

const getCqImageName = (imgUrl: string) => {
  let name = imgUrl?.split('.')?.at(-1) ?? '';

  if (!FileExtensions.has(name)) name = '图片';

  return name;
};

export const DropArea = () => {
  const { updateKeepingTimestamp } = useTableState();
  const { uploadState, parseImage } = useUpload();

  const maskRef = useRef<HTMLDivElement>(null);

  const [visible, setVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleAreaDrop = async (evt: DragEvent<HTMLDivElement>) => {
    evt.preventDefault();

    if (uploadState.uploading) {
      message.error('上传失败，当前已有图片正在识别');
      return;
    }

    let file: File | null = null;

    const iQuoteImgUrl = evt.dataTransfer.getData(DataTransferFormat.IQuoteDraggingImageUrl);

    if (iQuoteImgUrl) {
      // 如果有 iquote img url 说明是从 iquote 聊天室拖拽图片过来识别
      const blob = await transformImageToBlob(iQuoteImgUrl);

      const filename = getCqImageName(iQuoteImgUrl);
      file = transformBlob2File(blob, filename);

      const invalid = checkFile(file, true);
      if (invalid) return;
    } else {
      // 如果没有，说明是本地拖拽识别
      const items = getDataTransferFileItems(evt.dataTransfer);
      // 如果已经展示了错误信息，不再 toast
      const checked = checkDataTransferItems(items, !errorMessage);

      if (checked.errorMessage) return;
      file = checked.file;
    }

    await parseImage(file);
    updateKeepingTimestamp({ reset: true });
  };

  // window dragenter
  useEventListener(
    'dragenter',
    evt => {
      evt.preventDefault();

      if (visible) return;
      setVisible(true);

      const items = getDataTransferFileItems(evt.dataTransfer);

      // 如果没有 file 的 items，不在拖拽时进行检测
      if (items.length) {
        const checked = checkDataTransferItems(items, false);
        // 不 toast，show message
        setErrorMessage(checked.errorMessage || undefined);
      } else {
        setErrorMessage(undefined);
      }
    },
    undefined,
    true
  );

  if (!visible) return null;

  return (
    <FloatingPortal>
      <div
        ref={maskRef}
        className="absolute-full z-floating"
        onMouseDown={() => setVisible(false)}
        onDragLeave={evt => {
          evt.preventDefault();
          evt.stopPropagation();

          if (evt.target !== maskRef.current || evt.relatedTarget !== null) return;

          setVisible(false);
        }}
        onDragOver={evt => {
          evt.preventDefault();
          evt.stopPropagation();
        }}
        onDrop={evt => {
          evt.preventDefault();
          evt.stopPropagation();

          setVisible(false);
        }}
      >
        <div
          className={cx(
            'absolute flex-center rounded-l-lg border border-dashed',
            errorMessage
              ? 'text-danger-100 bg-danger-700 border-danger-100'
              : 'text-primary-100 bg-primary-700 border-primary-100'
          )}
          style={{ top: 114, left: 17, right: 217, height: 94 }}
          onDrop={handleAreaDrop}
        >
          <div className="flex-center flex-col gap-1">
            {errorMessage ? <IconAttentionFilled size={24} /> : <IconDownloadFilled size={24} />}
            <span className="text-sm">{errorMessage ?? '将图片移至该区域'}</span>
          </div>
        </div>
      </div>
    </FloatingPortal>
  );
};
