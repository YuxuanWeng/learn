import { HighlightOption } from '@fepkg/components/BaseOptionsRender/HighlightOption';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { getInstName } from '../../../utils/get-name';
import { TraderWithPref } from './types';

const traderGridTemplateColumns = '108px 136px';
export const TraderOptionRender = (productType?: ProductType) => (trader: TraderWithPref, keyword: string) => {
  const preferenceCls = trader?.preference ? '!text-orange-100' : undefined;
  const instName = getInstName({ inst: trader?.inst_info, productType });

  const renderText = [trader?.name_zh ?? '', instName];

  return (
    <HighlightOption
      className={`gap-3 ${preferenceCls}`}
      keyword={keyword}
      label={renderText}
      highlight
      gridTemplateColumns={traderGridTemplateColumns}
    />
  );
};
