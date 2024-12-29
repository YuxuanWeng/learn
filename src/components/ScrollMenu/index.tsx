import cx from 'classnames';
import { Header } from './Header';
import { Options } from './Options';
import { QuotationGroupProps } from './types';

export const ScrollMenu = (props: QuotationGroupProps) => {
  const { title, className = '', activeKey, options, onClick, onChange, anchorId, icon } = props;

  return (
    <div
      className={cx('px-2 py-1 w-full h-full flex flex-col', className)}
      onContextMenu={evt => {
        evt.preventDefault();
      }}
    >
      <Header
        title={title}
        icon={icon}
      />
      <Options
        anchorId={anchorId}
        data={options}
        activeKey={activeKey}
        onClick={onClick}
        onChange={onChange}
      />
    </div>
  );
};
