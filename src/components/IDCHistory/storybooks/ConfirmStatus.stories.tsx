import { fakeTradeInfo } from '@fepkg/mock/utils/fake';
import { BrokerStatus } from '../BrokerStatus';

export default {
  title: 'IDC业务组件/历史记录/经纪人确认状态',
  component: BrokerStatus
};

export const Basic = () => {
  return (
    <div className="flex flex-col">
      <BrokerStatus broker={fakeTradeInfo()} />
    </div>
  );
};
Basic.storyName = '基本用法';
