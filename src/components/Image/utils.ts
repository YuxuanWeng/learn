export const getTransitionName = (rootPrefixCls: string, motion: string, transitionName?: string) => {
  if (transitionName !== undefined) {
    return transitionName;
  }
  return `${rootPrefixCls}-${motion}`;
};

export const getPrefixCls = (suffixCls?: string, customizePrefixCls?: string) => {
  if (customizePrefixCls) {
    return customizePrefixCls;
  }
  return suffixCls ? `ant-${suffixCls}` : 'ant';
};

export const getTriggerText = (
  triggerWithText?: boolean | { text?: string; className?: string },
  defaultText?: string
) => {
  if (triggerWithText === false) return triggerWithText;
  if (typeof triggerWithText === 'object') {
    return { text: triggerWithText.text ?? defaultText, className: triggerWithText.className };
  }
  return { text: defaultText };
};

export const getScaleThreshold = (scaleStep?: number, minScale?: number, maxScale?: number) => {
  return { scaleStep: (scaleStep ?? 0) * 100, max: (maxScale ?? 0) * 100, min: (minScale ?? 0) * 100 };
};

/** 将图片src转换成Blob */
export const transformImageToBlob = (src: string): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.crossOrigin = 'anonymous';
    img.addEventListener('load', () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, img.width, img.height);
      canvas.toBlob(blob => {
        if (!blob) reject();
        else resolve(blob);
      });
    });
  });
};

/** 将图片 Blob 转换成 File */
export const transformBlob2File = (blob: Blob, filename: string) => {
  return new File([blob], filename, { type: 'image/png' });
};

export const getImageMatrix = (img: Element) => {
  const computedStyle = getComputedStyle(img);
  const transform = computedStyle.getPropertyValue('transform');
  return new DOMMatrix(transform);
};

export const getImageScale = (img: Element) => {
  const matrix = getImageMatrix(img);
  return matrix.a;
};
