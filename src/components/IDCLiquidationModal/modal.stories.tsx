import { IDCLiquidationModal } from '.';

export default {
  title: 'IDC业务组件/结算方式/弹窗',
  component: IDCLiquidationModal,
  parameters: {
    docs: {
      description: {
        component: `
        `
      }
    }
  },
  decorators: []
};

export const Modal1 = () => {
  return <IDCLiquidationModal visible />;
};
