import { HighlightOption } from '@fepkg/components/BaseOptionsRender/HighlightOption';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { FiccBondBasic } from '@fepkg/services/types/common';

const needRatingProductTypeList = new Set([ProductType.BCO, ProductType.NCD]);

export const BondOptionRender =
  (productType?: ProductType, showRating?: boolean) => (bond: FiccBondBasic, keyword: string) => {
    showRating = showRating ?? needRatingProductTypeList.has(productType ?? ProductType.ProductTypeNone);

    let gridTemplateColumns = '148px 148px 176px';
    const renderText = [bond.display_code, bond.short_name, bond.time_to_maturity ?? ''];
    if (showRating) {
      gridTemplateColumns = '148px 148px 68px 96px';
      renderText.splice(2, 0, bond.issuer_rating ?? '');
    }

    return (
      <HighlightOption
        className="gap-3"
        keyword={keyword}
        label={renderText}
        highlight={[true, true]}
        gridTemplateColumns={gridTemplateColumns}
      />
    );
  };
