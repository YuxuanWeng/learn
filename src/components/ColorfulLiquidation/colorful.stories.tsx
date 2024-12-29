import { LiquidationSpeedTag } from '@fepkg/services/types/enum';
import ColorfulLiquidation from '.';

export default {
  title: '业务组件/可区分远期样式的结算方式',
  component: ColorfulLiquidation
};

const liquidation_speed_list = [
  {
    tag: LiquidationSpeedTag.Today,
    offset: 0
  },
  {
    tag: LiquidationSpeedTag.Today,
    offset: 1
  },
  {
    tag: LiquidationSpeedTag.Tomorrow,
    offset: 0
  },
  {
    date: '2023-05-05',
    offset: 1
  }
];

export const Color1 = () => {
  return (
    <ColorfulLiquidation
      liquidation_speed_list={liquidation_speed_list}
      fra_className="bg-auxiliary-400 px-1 rounded"
    />
  );
};
Color1.storyName = '定义远期样式';

export const Color2 = () => {
  return <ColorfulLiquidation liquidation_speed_list={liquidation_speed_list} />;
};
Color2.storyName = '忽略远期样式';
