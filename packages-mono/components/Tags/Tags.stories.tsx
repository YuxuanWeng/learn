import { Tag } from 'antd';
import { NumberBadge, StatusBadge, StatusTag, StatusTagsType, TagContainer, TextBadge } from './index';

export default {
  title: '业务组件/标签',
  component: StatusTag
};

export const Status = () => {
  return (
    <div className="flex">
      <StatusTag
        type={StatusTagsType.submitted}
        onClick={e => alert(e)}
      />
      <StatusTag type={StatusTagsType.unConfirm} />
      <StatusTag type={StatusTagsType.unPass} />
      <StatusTag type={StatusTagsType.unConfirm} />
      <StatusTag type={StatusTagsType.destroyed} />
      <StatusTag type={StatusTagsType.auditing} />
      <StatusTag type={StatusTagsType.deleted} />
      <StatusTag type={StatusTagsType.doing} />
      <StatusTag type={StatusTagsType.passed} />
    </div>
  );
};
Status.storyName = '状态标签';

export const Num = () => (
  <>
    <div className="flex flex-row justify-start">
      <NumberBadge
        num={2}
        onClick={e => alert(e)}
      />
      <NumberBadge
        num={10}
        className="ml-4"
      />
    </div>
    <br />
    <div className="flex flex-row justify-start">
      <NumberBadge
        num={2}
        className="!text-gray-000 !bg-danger-100"
      />
      <NumberBadge
        num={23}
        className="ml-4 !text-gray-000 !bg-danger-100"
      />
    </div>
  </>
);
Num.storyName = '数字徽标';

export const StatusBadgeTag = () => (
  <>
    <StatusBadge
      type="success"
      size="small"
    />
    <StatusBadge
      type="error"
      size="middle"
      className="ml-2"
    />
    <StatusBadge
      type="warning"
      size="large"
      className="ml-3"
    />
    {/* <StatusBadge
      type="partial"
      size="large"
    /> */}
  </>
);
StatusBadgeTag.storyName = '状态徽标';

export const TextBadgeTag = () => (
  <>
    <TextBadge
      text="日"
      type="DAY"
    />
    <br />
    <TextBadge
      text="DR"
      type="DAY"
    />
    <br />
    <TextBadge
      text="休"
      type="HOL"
    />
    <br />
    <TextBadge
      text="休"
      type="HOL"
      num="1/2"
    />
    <br />
    <TextBadge
      text="休"
      type="HOL"
      num="1"
    />
    <br />
    <TextBadge
      className=""
      text="S"
      type="BOND"
    />
    <br />
    <TextBadge
      className=""
      text="D"
      type="BOND"
    />
    <br />
    <TextBadge
      className=""
      text="L"
      type="BOND"
    />
    <br />
    <TextBadge
      text="DR"
      type="BOND"
      onClick={e => alert(e)}
    />
    <br />
    <TextBadge
      className=""
      text="N"
      type="BOND"
    />
  </>
);
TextBadgeTag.storyName = '文字徽标';

/**
 * 将Tag标签使用TagContainer包起来，自动排列颜色
 * @returns
 */
export const BaseTag = () => {
  return (
    <TagContainer>
      <Tag>标签</Tag>
      <Tag
        closable
        onClose={e => alert(e)}
      >
        标签
      </Tag>
      <Tag>标签</Tag>
      <Tag>标签</Tag>
      <Tag>标签</Tag>
      <Tag>标签</Tag>
      <Tag>标签</Tag>
    </TagContainer>
  );
};
BaseTag.storyName = '颜色排列';
