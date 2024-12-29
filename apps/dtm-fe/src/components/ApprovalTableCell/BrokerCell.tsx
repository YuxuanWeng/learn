import { Tooltip } from '@fepkg/components/Tooltip';

type Props = {
  content?: string;
};

export const BrokerCell = ({ content }: Props) => {
  return (
    <Tooltip
      truncate
      content={content}
    >
      <span className="truncate-clip">{content}</span>
    </Tooltip>
  );
};
