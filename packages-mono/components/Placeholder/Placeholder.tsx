import { useMemo } from 'react';
import cx from 'classnames';
import loadingAPng from './assets/loading.apng';
import noDataSvg from './assets/no-data.svg';
import noNetworkSvg from './assets/no-network.svg';
import noSearchResultSvg from './assets/no-search-result.svg';
import noSettingSvg from './assets/no-setting.svg';
import { PlaceholderProps } from './types';

const SizeClsMap = {
  md: 'w-50 h-50',
  sm: 'w-40 h-40',
  xs: 'w-25 h-25'
} as const;

const usePlaceholder = (type: PlaceholderProps['type'], size: PlaceholderProps['size'] = 'sm') => {
  // 这里用 useMemo 是为了防止 img 重新加载 src 后进行闪烁
  return useMemo(() => {
    let src: string | undefined;
    let alt: string | undefined;
    const sizeCls = SizeClsMap[size];

    switch (type) {
      case 'no-search-result':
        src = noSearchResultSvg;
        alt = '无搜索结果';
        break;
      case 'no-network':
        src = noNetworkSvg;
        alt = '无网络连接';
        break;
      case 'no-setting':
        src = noSettingSvg;
        alt = '暂未配置';
        break;
      case 'no-data':
        src = noDataSvg;
        alt = '无数据';
        break;
      case 'loading':
        src = loadingAPng;
        alt = '加载中...';
        break;
      default:
        break;
    }

    const node = (
      <img
        src={src}
        alt={alt}
        className={sizeCls}
      />
    );

    return { node, alt };
  }, [type, size]);
};

export const Placeholder = ({ type, label, size, className }: PlaceholderProps) => {
  const { node, alt } = usePlaceholder(type, size);
  return (
    <div
      className={cx(
        's-placeholder flex-center flex-col flex-1 text-sm text-gray-200 font-normal select-none',
        className
      )}
    >
      {node}
      {label ?? alt}
    </div>
  );
};
