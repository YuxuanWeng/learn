import { createContext, useContext, useMemo } from 'react';
import { WatermarkOptions } from './types';

export const WatermarkContext = createContext<WatermarkOptions | null>(null);
export const WatermarkProvider = WatermarkContext.Provider;

export const useWatermark = ({ content = '', fontSize = 14, color = 'white', opacity = 0.05 }: WatermarkOptions) => {
  const ctxOptions = useContext(WatermarkContext);

  content = ctxOptions?.content ?? content;
  fontSize = ctxOptions?.fontSize ?? fontSize;
  color = ctxOptions?.color ?? color;
  opacity = ctxOptions?.opacity ?? opacity;

  const background = useMemo(() => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (context) {
      const textWidth = context.measureText(content).width;

      canvas.width = textWidth + 80;
      canvas.height = (fontSize * 1.2 + 60) * 2;

      context.font = context.font.replace(/\d+px/g, `${fontSize}px`);

      context.globalAlpha = opacity;
      context.fillStyle = color;
      context.fillText(content, 0, fontSize);
      context.fillText(content, canvas.width / 2, fontSize + fontSize * 1.2 + 60);
      context.fillText(content, -canvas.width / 2, fontSize + fontSize * 1.2 + 60);
    }

    return canvas.toDataURL();
  }, [color, content, fontSize, opacity]);

  return { background };
};
