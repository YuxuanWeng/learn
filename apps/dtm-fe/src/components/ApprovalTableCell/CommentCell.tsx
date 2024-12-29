import { Tooltip } from '@fepkg/components/Tooltip';

type CommentCellProp = {
  comment: string[];
};

export const CommentCell = ({ comment }: CommentCellProp) => {
  const content = (
    <div className="flex items-center whitespace-nowrap truncate">
      {comment.at(0)}
      <span className="valuation-cell shrink-0 w-px mx-2 h-2.5 bg-gray-300" />
      {comment.at(1)}
    </div>
  );

  return (
    <Tooltip
      truncate
      content={content}
    >
      {content}
    </Tooltip>
  );
};
