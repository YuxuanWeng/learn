import { HighlightOption } from '@fepkg/components/BaseOptionsRender/HighlightOption';
import { User } from '@fepkg/services/types/common';

export const OptionRender = (broker: User, keyword: string) => {
  return (
    <HighlightOption
      keyword={keyword}
      label={broker?.name_cn ?? ''}
    />
  );
};
