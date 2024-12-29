import cx from 'classnames';
import { Tooltip } from '@fepkg/components/Tooltip';
import { IconInfo } from '@fepkg/icon-park-react';

const Title = ({ title }: { title: string }) => {
  return <span className="!text-xs text-gray-300">{title}</span>;
};

const Icon = ({ isTkn, content }: { isTkn: boolean; content?: React.ReactNode }) => (
  <Tooltip content={content}>
    <IconInfo
      className={cx(isTkn ? 'text-secondary-000' : 'text-orange-000')}
      size={12}
    />
  </Tooltip>
);

export default { Title, Icon };
