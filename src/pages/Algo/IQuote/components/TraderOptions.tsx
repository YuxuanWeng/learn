import { HighlightOption } from '@fepkg/components/BaseOptionsRender/HighlightOption';
import { Trader } from '@fepkg/services/types/common';

export const traderOptionRender = (original: Trader, keyword: string) => {
  const instName = original?.inst_info?.short_name_zh ? `(${original?.inst_info?.short_name_zh})` : '';
  let tagPrefix = '';
  if (original.tags?.length) tagPrefix = original.tags?.[0];
  const text = `${original.name_zh}${tagPrefix}${instName}`;

  return (
    <HighlightOption
      keyword={keyword}
      label={text}
    />
  );
};
