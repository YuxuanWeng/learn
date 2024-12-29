import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import cx from 'classnames';
import { Button } from '@fepkg/components/Button';
import { IconAmplify, IconClose, IconCopy, IconLoading, IconReduce } from '@fepkg/icon-park-react';
import { useMemoizedFn } from 'ahooks';
import { ToolbarRenderInfoType } from 'rc-image/lib/Preview';
import { TransformAction, TransformType } from 'rc-image/lib/hooks/useImageTransform';
import { ImageProps, Image as RCImage } from './Image';
import { getTriggerText, transformImageToBlob } from './utils';

const defaultPreviewProps = {
  scaleStep: 0.1,
  minScale: 0.1,
  maxScale: 5,
  closeIcon: <IconClose />
};

export type ViewOriginalImageProps = {
  /** 触发形式是否为文本, 若为文本，可传入需要显示的文本内容，text不传则取图片scr为文本显示 */
  triggerWithText?: boolean | { text?: string; className?: string };
  /** ReactImage原始属性 */
  imageProps?: ImageProps;
  /** 是否允许复制 */
  enableCopy?: boolean;
  /** 是否允许缩放 */
  enableZoom?: boolean;
};

const Placeholder = () => {
  return (
    <div className="text-gray-300 flex-center gap-2 h-8 rounded-lg bg-gray-700 w-[118px]">
      <IconLoading className="animate-spin" />
      <span>图片加载中</span>
    </div>
  );
};

const copyImage = async (src: string) => {
  const blob = await transformImageToBlob(src);
  const item = new ClipboardItem({ 'image/png': blob });
  navigator.clipboard.write([item]);
};

export type ViewOriginalImageInstance = {
  /** 复制图片 */
  copyImage?: (src: string) => void;
};

export const ViewOriginalImage = forwardRef<ViewOriginalImageInstance, ViewOriginalImageProps>((props, ref) => {
  const { triggerWithText = false, enableCopy = false, imageProps, enableZoom = true } = props;

  const [percent, setPercent] = useState(100);

  const triggerText = getTriggerText(triggerWithText, imageProps?.src);
  const [previewVisible, setPreviewVisible] = useState(false);

  const [hover, setHover] = useState(false);

  /** 图片加载失败 */
  const [failed, setFailed] = useState(false);

  useImperativeHandle(ref, () => ({ copyImage }));

  const handleVisibleChange = () => {
    setPreviewVisible(false);
    setPercent(100);
  };

  const toolbarRender = useMemoizedFn(
    (originalNode: React.ReactElement, info: Omit<ToolbarRenderInfoType, 'current' | 'total'>): React.ReactNode => {
      if (imageProps?.preview === false) return null;

      const { actions } = info;
      const { onZoomIn, onZoomOut } = actions;

      if (typeof imageProps?.preview === 'object' && imageProps.preview.toolbarRender) {
        return imageProps?.preview.toolbarRender(originalNode, info);
      }

      return (
        <div className="h-8 rounded-lg border border-solid border-gray-700 flex items-center px-3 py-1 gap-3 bg-gray-800">
          {enableZoom && (
            <div className="flex gap-3 items-center">
              <Button.Icon
                icon={<IconReduce size={16} />}
                onClick={onZoomOut}
              />
              <span className="w-[38px] text-center">{percent}%</span>
              <Button.Icon
                icon={<IconAmplify size={16} />}
                onClick={onZoomIn}
              />
            </div>
          )}
          {enableZoom && enableCopy && <div className="w-px h-full  bg-gray-700" />}
          {enableCopy && (
            <div className="flex gap-3 items-center">
              <Button.Icon
                icon={<IconCopy size={16} />}
                onClick={() => copyImage(imageProps?.src ?? '')}
              />
            </div>
          )}
        </div>
      );
    }
  );

  const onTransform = (val: { transform: TransformType; action: TransformAction }) => {
    setPercent(parseInt((val.transform.scale * 100).toString(), 10));
  };

  if (triggerText) {
    return (
      <>
        <span
          onClick={() => {
            setPreviewVisible(!previewVisible);
          }}
          className={cx('text-primary-100 underline cursor-pointer', triggerText.className)}
        >
          {triggerText.text}
        </span>
        <RCImage
          className="hidden"
          preview={{
            ...defaultPreviewProps,
            visible: previewVisible,
            onVisibleChange: handleVisibleChange,
            toolbarRender,
            onTransform
          }}
          {...imageProps}
        />
      </>
    );
  }

  return (
    <div
      className="flex items-center relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {hover && !previewVisible && !failed && (
        <Button.Icon
          className="absolute z-hightest top-0 left-0 right-0 bottom-0 m-auto w-6 h-6 rounded-[50%] bg-gray-800 opacity-80"
          icon={<IconAmplify size={16} />}
          onClick={() => {
            setPreviewVisible(!previewVisible);
          }}
        />
      )}
      <RCImage
        className="rounded-lg"
        placeholder={<Placeholder />}
        fallback="./assets/image/load-failed.svg"
        preview={{
          ...defaultPreviewProps,
          visible: previewVisible,
          onVisibleChange: handleVisibleChange,
          toolbarRender,
          onTransform
        }}
        {...imageProps}
        onError={evt => {
          imageProps?.onError?.(evt);
          setFailed(true);
        }}
      />
    </div>
  );
});
