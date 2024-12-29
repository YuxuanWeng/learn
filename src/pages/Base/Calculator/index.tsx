import { BondSearchProvider } from '@fepkg/business/components/Search/BondSearch';
import { Side } from '@fepkg/services/types/enum';
import { PriceGroupProvider } from '@/components/business/PriceGroup';
import { useProductParams } from '@/layouts/Home/hooks';
import { defaultPrice } from './common';
import { Panel } from './panel';
import { CalcProvider } from './providers/CalcProvider';

const side = Side.SideNone;

const CalculatorWindow = () => {
  const { productType } = useProductParams();

  return (
    <BondSearchProvider initialState={{ productType }}>
      <PriceGroupProvider initialState={{ side, defaultValue: defaultPrice }}>
        <CalcProvider initialState={{ side }}>
          <Panel />
        </CalcProvider>
      </PriceGroupProvider>
    </BondSearchProvider>
  );
};

export default CalculatorWindow;
