import { ReactElement } from 'react';
import { Placeholder, PlaceholderProps } from '@fepkg/components/Placeholder';

type EmptyPlaceholderProps = {
  label?: string;
  noSearchResult?: boolean;
  empty: boolean;
  size?: PlaceholderProps['size'];
  className: string;
};

export const EmptyPlaceholder = ({ noSearchResult, empty, size, label, className }: EmptyPlaceholderProps) => {
  let content: ReactElement | null = null;

  if (noSearchResult) {
    content = (
      <Placeholder
        type="no-search-result"
        size={size}
      />
    );
  } else if (empty) {
    content = (
      <Placeholder
        type="no-data"
        size={size}
        label={label}
      />
    );
  }

  return content ? <div className={className}>{content}</div> : null;
};
