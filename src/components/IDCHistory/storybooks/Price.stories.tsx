import { PriceRender } from '../Price';

export default {
  title: 'IDC业务组件/历史记录/价格',
  component: PriceRender
};

export const Basic = () => {
  return (
    <div className="flex flex-col">
      <PriceRender
        price="30"
        rebate="1"
        editable
        price_type={1}
        onChangePrice={() => {}}
        onChangeRebate={() => {}}
      />
    </div>
  );
};
Basic.storyName = '基本用法';
