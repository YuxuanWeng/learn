import { HTMLProps, ReactNode } from 'react';
import cx from 'classnames';

type IProps = HTMLProps<HTMLDivElement> & {
  headRender?: ReactNode;
  isDetailPage?: boolean;
  isSimplifyMode?: boolean;
  showSubOptimal?: boolean;
};

/**
 * IDC报价板
 */
export default function IDCPanelWrapper({
  showSubOptimal,
  headRender,
  isDetailPage,
  isSimplifyMode,
  children = []
}: IProps) {
  const count = Array.isArray(children) ? children.length : 1;
  const childrenArr = count > 1 ? children : [children];
  const wrapperStyle = isDetailPage ? 'bg-gray-800 rounded-lg px-2' : '';

  const width = showSubOptimal ? 'calc((100% - 24px) / 4)' : 'calc((100% - 4px) / 2)';

  return (
    <div className={wrapperStyle}>
      {headRender}
      <div className={cx('flex', isSimplifyMode ? 'gap-1' : 'gap-2')}>
        {(childrenArr as ReactNode[]).map((item, index) => (
          <div
            key={JSON.stringify(`${item}_${index}`)}
            style={{ width }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
