import { HighlightOption } from '@fepkg/components/BaseOptionsRender/HighlightOption';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { InstitutionTiny } from '@fepkg/services/types/common';
import { getInstName } from '../../../utils/get-name';

const instGridTemplateColumns = '148px 148px 156px';
export const InstOptionRender = (productType?: ProductType) => (original: InstitutionTiny, keyword: string) => {
  const renderText = [
    getInstName({ inst: original, productType }),
    original.short_name_zh ?? '',
    original.full_name_zh ?? ''
  ];

  return (
    <HighlightOption
      className="gap-3"
      keyword={keyword}
      label={renderText}
      highlight
      gridTemplateColumns={instGridTemplateColumns}
    />
  );
};
