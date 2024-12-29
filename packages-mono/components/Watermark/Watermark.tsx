import { forwardRef, useMemo } from 'react';
import cx from 'classnames';
import { WatermarkOptions } from './types';
import { useWatermark } from './useWatermark';

export const Watermark = forwardRef<HTMLDivElement, WatermarkOptions>(
  ({ className, content, fontSize, color, opacity, ...restProps }, ref) => {
    const { background } = useWatermark({ content, fontSize, color, opacity });

    const screenRect = useMemo(() => {
      const { width, height } = window.screen;
      return { width, height };
    }, []);

    return (
      <div
        ref={ref}
        className={cx('absolute-full pointer-events-none overflow-hidden', className)}
        {...restProps}
      >
        <div
          className="z-10 absolute bg-repeat pointer-events-none"
          style={{
            backgroundImage: `url('${background}')`,
            transform: 'rotate(-15deg)',
            width: screenRect.width * 2,
            height: screenRect.height * 2,
            left: -screenRect.width / 2,
            top: -screenRect.height / 2
          }}
        />
      </div>
    );
  }
);
