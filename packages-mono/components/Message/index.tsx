import { ReactNode } from 'react';
import { message as antdMessage } from 'antd';
import { ArgsProps, ConfigOnClose } from 'antd/lib/message';
import { Button } from '@fepkg/components/Button';
import { IconAttentionFilled, IconCheckCircleFilled, IconClose, IconCloseCircleFilled } from '@fepkg/icon-park-react';

const warpContent = (
  content: ArgsProps | ReactNode,
  classNameSuffix: string,
  duration?: number,
  onClose?: ConfigOnClose
): ArgsProps => {
  const result =
    (content as ArgsProps)?.content == null
      ? {
          content
        }
      : { ...(content as ArgsProps) };

  return {
    className: `ant-message-notice-${classNameSuffix}`,
    icon: null,
    duration: duration ?? 3,
    onClose,
    ...result
  };
};

const getContentBlock = (content: ReactNode, icon: ReactNode, destroy: () => void) => {
  return (
    <div className="flex justify-between items-center h-[26px] text-white">
      {icon}
      <div className="flex items-center text-sm max-w-[580px] px-2">
        <div className="inline-block truncate">{content}</div>
      </div>

      <Button.Icon
        className="hover:!bg-white/10 border-none"
        icon={<IconClose />}
        type="gray"
        plain
        text
        onClick={destroy}
      />
    </div>
  );
};

const warning = (content: ReactNode, destroy: () => void, duration?: number, onClose?: ConfigOnClose) => {
  antdMessage.open(
    warpContent(
      getContentBlock(content, <IconAttentionFilled className="text-orange-100" />, destroy),
      'warning',
      duration,
      onClose
    )
  );
};

export const message = {
  ...antdMessage,
  success(content: ReactNode, duration?: number, onClose?: ConfigOnClose) {
    antdMessage.open(
      warpContent(
        getContentBlock(content, <IconCheckCircleFilled className="text-green-100" />, () => this.destroy()),
        'success',
        duration,
        onClose
      )
    );
  },
  warn(content: ReactNode, duration?: number, onClose?: ConfigOnClose) {
    warning(content, () => this.destroy(), duration, onClose);
  },
  warning(content: ReactNode, duration?: number, onClose?: ConfigOnClose) {
    warning(
      content,
      () => {
        this.destroy();
      },
      duration,
      onClose
    );
  },
  error(content: ReactNode, duration?: number, onClose?: ConfigOnClose) {
    antdMessage.open(
      warpContent(
        getContentBlock(content, <IconCloseCircleFilled className="text-danger-100" />, () => this.destroy()),
        'error',
        duration,
        onClose
      )
    );
  },
  info(content: ReactNode, duration?: number, onClose?: ConfigOnClose) {
    antdMessage.open(
      warpContent(
        getContentBlock(content, <IconAttentionFilled className="text-gray-200" />, () => this.destroy()),
        'info',
        duration,
        onClose
      )
    );
  }
};

// 限制同时展示的条数为1，后面的会把前面的message顶掉
antdMessage.config({
  maxCount: 1
});
