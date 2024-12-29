import { useDialogLayout } from '@/layouts/Dialog/hooks';
import { useProductParams } from '@/layouts/Home/hooks';
import { MarketRecommendSetting } from './components/MarketRecommendSetting';
import { useSettingPanelParams } from './hook/usePanelParams';

const MarketRecommendSettingDialogInner = () => {
  return <MarketRecommendSetting />;
};

const Setting = () => {
  const dialogLayout = useDialogLayout();
  const params = useSettingPanelParams();
  const { productType } = useProductParams();

  if (!dialogLayout) return null;
  if (!params) return null;

  const key = `${productType}`;

  return <MarketRecommendSettingDialogInner key={key} />;
};

export default Setting;
