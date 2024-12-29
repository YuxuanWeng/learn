import cx from 'classnames';
import { Modal as AntModal, ModalFuncProps } from 'antd';
import { Cache } from '@fepkg/common/utils/cache';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { ThemeProps } from '@fepkg/components/types';
import { IconAttentionFilled, IconCheckCircleFilled, IconDeleteFilled } from '@fepkg/icon-park-react';
import styles from './style.module.less';

export type ModalUtilProps = ModalFuncProps &
  ThemeProps & {
    /** Title 尺寸 */
    titleSize?: 'md' | 'sm';
    /** Title 是否居中 */
    titleCentered?: boolean;
    /** 按钮组是否居中 */
    buttonsCentered?: boolean;
    /** 是否展示cancel按钮 */
    showCancel?: boolean;
    /** 是否展示ok按钮 */
    showOk?: boolean;
    /** 是否展示icon */
    showIcon?: boolean;
    /** 是否展示标题 */
    showTitle?: boolean;
    /** 自定义Icon外围样式 */
    iconContainerCls?: string;
    /** 自定义content样式 */
    contentCls?: string;
    /** 阻塞当前进程其他模态窗弹出 */
    blockAll?: boolean;
  };

const titleSizeClsMap = {
  md: 'text-md',
  sm: 'text-sm'
};

enum Type {
  Warn = 'warn',
  Error = 'error',
  Info = 'info'
}

const ModalCacheKey = 'modal-cache';

const modalCache = new Cache<{ blockAll: boolean }>({});

const handleKeydown = (evt: KeyboardEvent) => {
  const wrapperEl = document.querySelector('.ant-modal-wrap.ant-modal-confirm-centered.ant-modal-centered');
  const confirmBtnEl: HTMLElement | null = document.querySelector('#btn-confirm-modal-confirm');
  const cancelBtnEl: HTMLElement | null = document.querySelector('#btn-confirm-modal-cancel');

  switch (evt.key) {
    case KeyboardKeys.Tab:
      if (cancelBtnEl && document.activeElement === confirmBtnEl) {
        evt.preventDefault();
        cancelBtnEl.focus();
      } else if (confirmBtnEl && (document.activeElement === cancelBtnEl || document.activeElement === wrapperEl)) {
        evt.preventDefault();
        confirmBtnEl.focus();
      }
      break;
    case KeyboardKeys.Enter:
      if (confirmBtnEl && document.activeElement === wrapperEl) {
        evt.preventDefault();
        evt.stopPropagation();
        confirmBtnEl.focus();
      } else if (confirmBtnEl && document.activeElement === confirmBtnEl) {
        evt.stopPropagation();
      }
      break;
    default:
      break;
  }
};

const iconMap = {
  info: <IconCheckCircleFilled className="text-green-100" />,
  warn: <IconAttentionFilled className="text-orange-100" />,
  error: <IconDeleteFilled className="text-danger-100" />
};

const textMap = {
  info: { ok: '确定 ', cancel: '取消 ' },
  warn: { ok: '确定 ', cancel: '取消 ' },
  error: { ok: '删除 ', cancel: '取消 ' }
};

const bgClsMap = {
  info: 'bg-green-600',
  warn: 'bg-orange-600',
  error: 'bg-danger-600'
};

const baseBtnCls = 'text-sm font-normal border border-solid';

const infoBtnCls =
  '!bg-transparent !text-primary-100 border-primary-100 hover:!text-primary-000 hover:border-primary-000 hover:!bg-primary-700';

const ButtonClsMap = {
  cancel: cx(
    baseBtnCls,
    'bg-transparent border-gray-100 text-gray-100 hover:bg-gray-100/24 hover:border-gray-100 hover:text-gray-100'
  ),
  confirm: {
    error: cx(baseBtnCls, '!bg-danger-100 border-none text-gray-000 hover:!bg-danger-000'),
    warn: cx(baseBtnCls, infoBtnCls),
    info: cx(baseBtnCls, infoBtnCls)
  }
};

const confirm = (props: ModalUtilProps, type = Type.Info) => {
  if (modalCache.get(ModalCacheKey)?.blockAll) {
    return void 0;
  }
  if (props.blockAll) {
    AntModal.destroyAll();
    modalCache.set(ModalCacheKey, { blockAll: true });
  }
  const {
    theme,
    icon,
    title,
    width = 360,
    titleSize = 'sm',
    okText,
    cancelText,
    buttonsCentered = false,
    showIcon = true,
    iconContainerCls = '',
    showTitle = true,
    centered = true,
    contentCls = '',
    blockAll,
    ...rest
  } = props;

  const hasContent = props.content != null;

  const titleCentered = props.titleCentered ?? !hasContent;

  let titleResult;

  let mergeOkText = okText;
  let mergeCancelText = cancelText;

  if (showTitle) {
    titleResult = title;
    if (!hasContent) {
      titleResult = (
        <div className={cx('flex items-center gap-3 font-medium', titleSizeClsMap[titleSize])}>
          {type && showIcon && (
            <div
              className={cx('w-6 h-6 rounded-[50%] flex justify-center items-center', bgClsMap[type], iconContainerCls)}
            >
              {icon ?? iconMap[type]}
            </div>
          )}
          <span>{titleResult}</span>
        </div>
      );
    }

    if (hasContent && type) {
      titleResult = (
        <div className="flex items-center gap-3">
          {showIcon && (
            <div
              className={cx('w-6 h-6 rounded-[50%] flex justify-center items-center', bgClsMap[type], iconContainerCls)}
            >
              {icon ?? iconMap[type]}
            </div>
          )}
          <span>{titleResult}</span>
        </div>
      );
      mergeOkText = mergeOkText ?? textMap[type].ok;
      mergeCancelText = mergeCancelText ?? textMap[type].cancel;
    }
  }

  document.addEventListener('keydown', handleKeydown);

  return AntModal.confirm({
    icon: null,
    centered,
    keyboard: true,
    autoFocusButton: 'ok',
    zIndex: 9999,
    ...rest,
    content: (
      <div className={cx('text-gray-200 [&_.ant-modal-confirm-content]:!mt-0', contentCls)}>{props.content}</div>
    ),

    okText: mergeOkText,
    cancelText: mergeCancelText,
    width,
    className: cx(
      props.className,
      props.content == null && 'modal-center',
      titleCentered && '[&_.ant-modal-confirm-title]:flex-center',
      '!border-none',
      'shadow-[0_8px_40px_rgba(0,0,0,0.8)]',
      theme === 'light' && '[&_.ant-modal-body]:bg-white',
      '[&_.ant-modal-confirm-title]:!h-6',
      '[&_.ant-modal-title]:!h-0:!h-6',
      buttonsCentered ? '[&_.ant-modal-confirm-btns]:!flex-center' : '[&_.ant-modal-confirm-btns]:!justify-end'
    ),
    title: titleResult,
    transitionName: '',
    maskStyle: { borderRadius: 8 },
    maskTransitionName: '',
    okButtonProps: {
      id: 'btn-confirm-modal-confirm',
      ...props.okButtonProps,
      className: cx(props.okButtonProps?.className, ButtonClsMap.confirm[type]),
      style: props.showOk === false ? { display: 'none' } : undefined
    },
    cancelButtonProps: {
      id: 'btn-confirm-modal-cancel',
      onKeyDown: evt => {
        if (evt.key === KeyboardKeys.Enter) evt.stopPropagation();
      },
      ...props.cancelButtonProps,
      className: cx(props.cancelButtonProps?.className, ButtonClsMap.cancel),
      style: props.showCancel === false ? { display: 'none' } : undefined
    },
    onOk: () => {
      document.removeEventListener('keydown', handleKeydown);
      if (blockAll) {
        modalCache.set(ModalCacheKey, { blockAll: false });
      }
      return props.onOk?.();
    },
    onCancel: () => {
      document.removeEventListener('keydown', handleKeydown);
      if (blockAll) {
        modalCache.set(ModalCacheKey, { blockAll: false });
      }
      return props.onCancel?.();
    }
  });
};

const show = (props: ModalUtilProps) => {
  if (modalCache.get(ModalCacheKey)?.blockAll) {
    return void 0;
  }
  if (props.blockAll) {
    AntModal.destroyAll();
    modalCache.set(ModalCacheKey, { blockAll: true });
  }
  return AntModal.info({
    closable: false,
    icon: null,
    centered: true,
    transitionName: '',
    maskTransitionName: '',
    maskStyle: { borderRadius: 8 },
    ...props,
    className: cx(props.className, styles.raw),
    title: null,
    onOk: () => {
      if (props.blockAll) {
        modalCache.set(ModalCacheKey, { blockAll: false });
      }
      return props.onOk?.();
    },
    onCancel: () => {
      if (props.blockAll) {
        modalCache.set(ModalCacheKey, { blockAll: false });
      }
      return props.onCancel?.();
    }
  });
};

const warning = (props: ModalUtilProps) => {
  return confirm(props, Type.Warn);
};

const error = (props: ModalUtilProps) => {
  return confirm(props, Type.Error);
};

export const ModalUtils = {
  ...AntModal,
  error,
  confirm,
  warning,
  warn: warning,
  show
};
