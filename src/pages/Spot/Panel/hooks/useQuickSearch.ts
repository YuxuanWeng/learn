import { useEffect, useState } from 'react';
import { FiccBondBasic } from '@fepkg/services/types/common';
import { useDialogWindow } from '@/common/hooks/useDialog';
import { trackPoint } from '@/common/utils/logger/point';
import useListData from '@/components/IDCBoard/Panel/useListData';
import { getBondDetailDialogConfig } from '@/components/IDCBoard/utils';
import { useProductParams } from '@/layouts/Home/hooks';

export default function useQuickSearch() {
  const [globalSchBond, setGlobalSchBond] = useState<FiccBondBasic | undefined>();
  const { data: globalSchData } = useListData({
    bond: globalSchBond,
    showSubOptimal: true
  });

  const { openDialog } = useDialogWindow();
  const { productType } = useProductParams();

  const config = getBondDetailDialogConfig(productType, {
    bond: globalSchBond,
    data: globalSchData
  });

  useEffect(() => {
    if (!globalSchBond || !globalSchData) return;
    openDialog(config, { onCancel: () => setGlobalSchBond(void 0) });
  }, [config, globalSchBond, globalSchData, openDialog]);

  const onQuickSearch = (bond?: FiccBondBasic) => {
    trackPoint('quick-search');
    setGlobalSchBond(bond);
  };

  return { onQuickSearch };
}
