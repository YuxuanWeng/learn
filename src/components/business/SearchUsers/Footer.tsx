import { Button } from '@fepkg/components/Button';
import { FooterProps } from './types';

const Footer = ({ onConfirm, onCancel }: FooterProps) => {
  return (
    <div className="h-12 bg-gray-800 flex items-center px-6 justify-center">
      <Button
        type="gray"
        className="w-[76px] h-7 mr-3"
        ghost
        onClick={onCancel}
      >
        取消
      </Button>
      <Button
        type="primary"
        className="w-[76px] h-7 "
        onClick={onConfirm}
      >
        确定
      </Button>
    </div>
  );
};

export default Footer;
