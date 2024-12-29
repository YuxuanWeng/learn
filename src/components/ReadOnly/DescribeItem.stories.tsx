import DescribeItem from './DescribeItem';

export default {
  title: '基础组件/描述列表',
  component: DescribeItem
};

export const Basic = () => {
  return (
    <div>
      <DescribeItem
        label="Label"
        value="Value"
      />
    </div>
  );
};
Basic.storyName = '基本用法';

export const Copyable = () => {
  return (
    <div>
      <DescribeItem
        label="Label"
        value="可复制文本"
        enableCopy
      />
    </div>
  );
};
Copyable.storyName = '点击文本复制用法';

export const NoTruncate = () => {
  return (
    <div>
      <DescribeItem
        label="Label"
        value="
        光大证券股份有限公司 华泰证券股份有限公司 华西证券股份有限公司 江西银行股份有限公司 交通银行股份有限公司 上海浦东发展银行股份有限公司 兴业银行股份有限公司 招商银行股份有限公司 中国工商银行股份有限公司 中国国际金融股份有限公司 中国建设银行股份有限公司 中国农业银行股份有限公司 中国银行股份有限公司 中信建投证券股份有限公司 中信证券股份有限公司"
        isTruncate={false}
      />
    </div>
  );
};
NoTruncate.storyName = '折行用法';
