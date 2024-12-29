import { useDialogLayout } from '@/layouts/Dialog/hooks';
import { useProductParams } from '@/layouts/Home/hooks';
import { MarketRecommend } from './components/MarketRecommend';
import { usePanelParams } from './hook/usePanelParams';

const MarketDealRecommend = () => {
  const dialogLayout = useDialogLayout();
  const params = usePanelParams();
  const { productType } = useProductParams();

  if (!dialogLayout) return null;
  if (!params) return null;

  const key = `${productType}`;

  return <MarketRecommend key={key} />;
};

export default MarketDealRecommend;
