import { forwardRef, useImperativeHandle, useRef } from 'react';
import cx from 'classnames';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { Button } from '@fepkg/components/Button';

type FProps = {
  /** 组件尺寸 */
  size?: SizeType;
  /** 是否选中 */
  checked?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 额外的样式 */
  className?: string;
  /** 点击后的回调函数 */
  onClick?: (v: boolean) => void;
};

export type FInstance = { clickF?: () => void };

const sizeMap = {
  large: 'w-8 h-8',
  middle: 'w-7 h-7',
  small: 'w-6 h-6'
};

const F = forwardRef<FInstance, FProps>((props, ref) => {
  const { checked, disabled = false, size = 'middle', className = '', onClick } = props;

  const fRef = useRef<HTMLButtonElement>(null);

  const clickF = () => {
    fRef.current?.click();
  };

  useImperativeHandle(ref, () => ({
    clickF
  }));

  return (
    <Button.Icon
      ref={fRef}
      type="orange"
      bright
      checked={checked}
      disabled={disabled}
      tabIndex={-1}
      className={cx(sizeMap[size], className)}
      onClick={() => {
        onClick?.(!checked);
      }}
    >
      F
    </Button.Icon>
  );
});

export default F;
