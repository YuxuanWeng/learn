import { SendInput } from '../SendInput';

export default {
  title: 'IDC业务组件/历史记录/【发给】input',
  component: SendInput
};

export const Basic = () => {
  const defaultValue = '【请求】浦东银行(杨敏)';
  return (
    <div className="flex flex-col">
      <span>不过桥</span>
      <SendInput
        bidValue={defaultValue}
        onBidConfirm={console.log}
      />
      <span>过桥</span>
      <SendInput
        isBridge
        bidValue={defaultValue}
        ofrValue={defaultValue}
        ofrInputReadonly
        onOfrConfirm={console.log}
      />
    </div>
  );
};
Basic.storyName = '基本用法';
