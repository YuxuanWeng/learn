import { createContainer } from 'unstated-next';
import { useAccess } from '@/common/providers/AccessProvider';
import { OmsAccessCodeSuffix } from '@/common/types/access';
import { getOmsAccessCodeEnum } from '@/common/utils/access';
import { useProductParams } from '@/layouts/Home/hooks';

const DetailPanelContainer = createContainer(() => {
  const { access } = useAccess();
  const { productType } = useProductParams();

  const accessCache = {
    quote: access?.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.MktQuote)),
    deal: access?.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.MktDeal)),
    log: access.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.MktLog))
  };

  return { accessCache };
});

export const DetailPanelProvider = DetailPanelContainer.Provider;
export const useDetailPanel = DetailPanelContainer.useContainer;
