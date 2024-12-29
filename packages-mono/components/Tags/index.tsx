import cx from 'classnames';
import { Tag, TagProps } from 'antd';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { Tooltip } from '@fepkg/components/Tooltip';
import { omit } from 'lodash-es';
import styles from './style.module.less';

export enum StatusTagsType {
  unConfirm,
  deleted,
  unSubmit,
  doing,
  auditing,
  submitted,
  passed,
  unPass,
  destroyed
}

// tag通用的字体样式
const baseFontStyle: React.CSSProperties = {
  fontStyle: 'normal',
  fontWeight: 700,
  fontSize: '12px',
  // lineHeight: '12px',
  textAlign: 'center',
  letterSpacing: '0.02em',
  textTransform: 'uppercase',
  color: 'var(--color-gray-000)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const statusTagTypeMaps = Object.freeze({
  [StatusTagsType.unConfirm]: {
    title: '待确认',
    color: 'var(--color-auxiliary-200)',
    background: 'var(--color-auxiliary-600)'
  },
  [StatusTagsType.deleted]: { title: '已删除', color: 'var(--color-gray-200)', background: 'var(--color-gray-500)' },
  [StatusTagsType.unSubmit]: {
    title: '待提交',
    color: 'var(--color-auxiliary-200)',
    background: 'var(--color-auxiliary-600)'
  },
  [StatusTagsType.doing]: { title: '处理中', color: 'var(--color-trd-500)', background: 'var(--color-trd-200)' },
  [StatusTagsType.auditing]: { title: '送审中', color: 'var(--color-trd-200)', background: 'var(--color-trd-500)' },
  [StatusTagsType.submitted]: { title: '已提交', color: 'var(--color-ofr-200)', background: 'var(--color-ofr-600)' },
  [StatusTagsType.passed]: {
    title: '已通过',
    color: 'var(--color-primary-200)',
    background: 'var(--color-primary-500)'
  },
  [StatusTagsType.unPass]: { title: '未通过', color: 'var(--color-danger-200)', background: 'var(--color-danger-600)' },
  [StatusTagsType.destroyed]: { title: '已毁单', color: 'var(--color-gray-200)', background: 'var(--color-gray-500)' }
});

interface StatusTagType extends TagProps {
  type: StatusTagsType;
}
// 状态标签
export const StatusTag: React.FC<StatusTagType> = ({ type, ...restProps }) => {
  const { title, ...rest } = statusTagTypeMaps[type];
  return (
    <Tag
      {...restProps}
      style={{ ...baseFontStyle, ...rest }}
      className="w-16 h-6 flex-center rounded-3"
    >
      {title}
    </Tag>
  );
};

interface NumberBadgeType extends TagProps {
  num: number;
}
// 数字徽标
export const NumberBadge: React.FC<NumberBadgeType> = ({ num, ...restProps }) => {
  return (
    <Tag
      {...restProps}
      style={{
        ...omit(baseFontStyle, 'color')
        // color: 'var(--color-gray-700)'
      }}
      className={cx('box-border h-4 p-1 leading-4 rounded bg-primary-100 text-gray-700 min-w-4', restProps.className)}
    >
      {num}
    </Tag>
  );
};

// 状态徽标
export const StatusBadge: React.FC<{
  type: 'success' | 'error' | 'warning' | 'partial';
  className?: string;
  size?: SizeType;
}> = ({ type, size = 'small', className }) => {
  const sizeCls =
    {
      small: 'w-[10px] h-[10px] rounded',
      middle: 'w-4 h-4 rounded-md',
      large: 'w-6 h-6 rounded-lg'
    }[size] ?? '';

  const bgCls =
    {
      success: 'bg-primary-100',
      warning: 'bg-orange-100',
      error: 'bg-danger-100'
    }[type] ?? '';

  return <span className={cx('cursor-pointer rotate-45 inline-block', sizeCls, bgCls, className)} />;
};

interface TextBadgeType extends TagProps {
  text: string | number;
  type: 'DAY' | 'HOL' | 'BOND' | 'QUOTE_TYPE' | '';
  num?: string;
  tooltips?: string;
  disabled?: boolean;
}
// 文字徽标
export const TextBadge: React.FC<TextBadgeType> = ({ text, type, num, tooltips, disabled, ...restProps }) => {
  let bg = disabled ? 'bg-danger-200' : 'bg-danger-400';
  if (type === 'BOND') {
    if (text === 'S') bg = disabled ? 'bg-danger-400' : 'bg-danger-100';
    if (text === 'D') bg = disabled ? 'bg-secondary-400' : 'bg-secondary-100';
    if (text === 'L') bg = disabled ? 'bg-orange-400' : 'bg-orange-100';
    if (text === 'DR') bg = disabled ? 'bg-green-400' : 'bg-green-100';
    if (text === 'N') bg = disabled ? 'bg-purple-400' : 'bg-purple-100';
    if (text === '') return null;
  }
  // 数据的长度  DR 内容是大于1个字符的宽度不能写死
  const textLen = typeof text === 'number' ? 1 : text.length;
  return (
    <>
      {type === 'DAY' && (
        <Tag
          {...restProps}
          className={cx(
            'rounded h-4 w-4 px-1 py-0.5',
            disabled ? 'bg-primary-400' : 'bg-primary-100',
            restProps?.className
          )}
          style={{
            ...baseFontStyle,
            color: 'var(--color-gray-700)'
          }}
        >
          {text}
        </Tag>
      )}
      {type === 'HOL' && !num && (
        <Tag
          {...restProps}
          className={cx('rounded h-4 w-4 px-1 py-0.5', disabled ? 'bg-orange-400' : 'bg-orange-100')}
          style={{
            ...baseFontStyle,
            color: 'var(--color-gray-700)'
          }}
        >
          {text}
        </Tag>
      )}
      {type === 'HOL' && num && (
        <Tag
          {...restProps}
          className={cx('p-0 m-0 bg-transparent rounded h-4 leading-4', restProps?.className)}
          style={{
            ...baseFontStyle,
            width: `${32 + (num.length - 1) * 6}px`,
            lineHeight: '16px'
          }}
        >
          <span
            className={cx(
              'w-4 h-full leading-[14px] text-center border border-solid rounded-l',
              disabled ? 'text-orange-400 border-orange-400' : 'text-orange-100 border-orange-100'
            )}
          >
            {text}
          </span>
          <span
            className={cx(
              'min-w-[16px] flex-1 text-center text-gray-700 h-full rounded-r',
              disabled ? 'bg-orange-400' : 'bg-orange-100'
            )}
            style={{
              letterSpacing: num.length > 1 ? '1px' : '2px'
            }}
          >
            {num}
          </span>
        </Tag>
      )}

      {type === 'BOND' && (
        <Tag
          {...restProps}
          className={cx('rounded h-4 px-1 py-0.5', bg, textLen === 1 ? 'w-4' : '', restProps?.className)}
          style={{
            ...baseFontStyle,
            color: disabled ? 'var(--color-gray-300)' : 'var(--color-gray-000)'
          }}
        >
          {text}
        </Tag>
      )}

      {type === 'QUOTE_TYPE' && (
        <Tooltip content={<span className="heir:not-italic heir:text-white select-none">{tooltips}</span>}>
          <Tag
            {...restProps}
            className={cx('rounded h-4 w-4 bg-primary-900 !font-normal', restProps?.className)}
            style={{
              ...baseFontStyle,
              color: disabled ? 'var(--color-primary-400)' : 'var(--color-primary-100)'
            }}
          >
            {text}
          </Tag>
        </Tooltip>
      )}
    </>
  );
};

type BaseTagProps = {
  children?: React.ReactNode;
};
// 可删除的tag容器
export const TagContainer: React.FC<BaseTagProps> = props => {
  const { children } = props;
  return (
    <div
      style={{ display: 'flex' }}
      className={styles.baseTagContainer}
    >
      {children}
    </div>
  );
};
