import { forwardRef } from 'react';
import { Button, ButtonProps } from '@fepkg/components/Button';

const GTContent = () => {
  return (
    <span style={{ height: 22 }}>
      <span className="font-heavy">G</span>
      <span style={{ fontSize: 10 }}>vn</span>
      <span style={{ fontSize: 10 }}>/</span>
      <span className="font-heavy">T</span>
      <span style={{ fontSize: 10 }}>kn</span>
    </span>
  );
};

export const GTButton = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  return (
    <Button
      tabIndex={-1}
      ref={ref}
      type="orange"
      throttleWait={500}
      {...props}
    >
      <GTContent />
    </Button>
  );
});
