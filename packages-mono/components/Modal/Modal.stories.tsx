import { useState } from 'react';
import { Button } from '@fepkg/components/Button';
import { Input } from '@fepkg/components/Input';
import { message } from '@fepkg/components/Message';
import { RadioButton, RadioGroup } from '@fepkg/components/Radio';
import { Modal } from './Modal';

export default {
  title: '业务组件/可拖拽模态框',
  component: Modal
};

export const Basic = () => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      <Button
        className="ml-3"
        onClick={() => {
          setModalVisible(true);
        }}
      >
        模态弹窗
      </Button>
      <p className="mt-2">默认的，即为模态窗口，锁定当前页面</p>
      <Modal
        visible={modalVisible}
        title="设置"
        onConfirm={() => {
          setModalVisible(false);
        }}
        onCancel={() => {
          setModalVisible(false);
        }}
      >
        <div className="pt-4 pb-4 pl-6 pr-6">展示内容</div>
      </Modal>
    </>
  );
};
Basic.storyName = '基本用法';

export const NoModal = () => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      <Button
        onClick={() => {
          setModalVisible(true);
        }}
      >
        非模态弹窗
      </Button>
      <Modal
        visible={modalVisible}
        title="设置"
        onConfirm={() => {
          setModalVisible(false);
        }}
        onCancel={() => {
          setModalVisible(false);
        }}
      >
        <div className="pt-4 pb-4 pl-6 pr-6">展示内容</div>
      </Modal>
      <p className="mt-2">此状态下，按Esc键、点击遮罩区域、点击关闭按扭都可关闭窗口</p>
    </>
  );
};
NoModal.storyName = '非模态';

export const LockModal = () => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      <Button
        onClick={() => {
          setModalVisible(true);
        }}
      >
        全局锁定弹窗
      </Button>
      <Modal
        visible={modalVisible}
        title="设置"
        // isModal={false} // 显示为模态（不可Esc关闭、显示遮罩、点击遮罩区域不关闭）
        lock // 添加 lock，即将当前弹窗所在窗口设置为全局锁定（禁用其他窗口）
        onCancel={() => {
          setModalVisible(false);
        }}
        onConfirm={() => {
          setModalVisible(false);
        }}
      >
        <div className="pt-4 pb-4 pl-6 pr-6">展示内容</div>
      </Modal>
      <p className="mt-2">
        添加 isLock，即将当前弹窗所在窗口设置为全局锁定（禁用其他窗口）；
        <br />
        此状态下，按Esc键、点击遮罩区域、点击关闭按扭都不关闭窗口
      </p>
    </>
  );
};
LockModal.storyName = '全局锁定模式';

const getGenderTxt = (gender: number) => {
  switch (gender) {
    case 1:
      return '男';
    case 2:
      return '女';
    default:
      return '未知';
  }
};

type FormData = {
  name: string;
  gender: number;
};
export const FormModal = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [displayGender, setDisplayGender] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '张三',
    gender: 1
  });

  const clearModifyTab = () => {
    setDisplayName('');
    setDisplayGender(1);
    setModalVisible(false);
  };
  const subModifyTabName = () => {
    if (!displayName) {
      message.error('页面名称不能为空');
      return;
    }
    if (displayName.length > 20) {
      message.error('页面名称最多20字');
      return;
    }
    setFormData({
      name: displayName,
      gender: displayGender
    });
    clearModifyTab();
  };
  const cancelModifyTabName = () => {
    clearModifyTab();
  };
  const onTabNameInput = (val: string) => {
    setDisplayName(val);
  };

  const showModal = () => {
    setDisplayName(formData.name);
    setDisplayGender(formData.gender);
    setModalVisible(true);
  };

  return (
    <>
      <Button
        className="ml-3"
        onClick={showModal}
      >
        编辑
      </Button>
      <Modal
        visible={modalVisible}
        title="界面名称自定义"
        onConfirm={subModifyTabName}
        onCancel={cancelModifyTabName}
        width={342}
      >
        <div className="py-4 px-6">
          <div className="modify-tab-wrap">
            <Input
              label="自定义名称"
              maxLength={20}
              value={displayName}
              onChange={onTabNameInput}
            />
          </div>
          <br />
          <div>
            <label htmlFor="genderGroup">性别：</label>
            <RadioGroup
              value={[displayGender]}
              onChange={val => setDisplayGender(val[0] as number)}
            >
              <RadioButton value={1}>男</RadioButton>
              <RadioButton value={2}>女</RadioButton>
            </RadioGroup>
          </div>
        </div>
      </Modal>
      <p className="mt-3">
        姓名：{formData.name}，性别：{getGenderTxt(formData.gender)}
      </p>
    </>
  );
};
FormModal.storyName = '带表单的Modal';

export const CustomWidth = () => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      <Button
        className="ml-3"
        onClick={() => {
          setModalVisible(true);
        }}
      >
        自定义宽度
      </Button>
      <div className="mt-2">通过width设置宽度，高度根据内容自适应即可；</div>
      <Modal
        width={700}
        visible={modalVisible}
        title="设置"
        onCancel={() => {
          setModalVisible(false);
        }}
        onConfirm={() => {
          setModalVisible(false);
        }}
      >
        <div className="py-4 px-6">展示内容</div>
      </Modal>
    </>
  );
};
CustomWidth.storyName = '自定义宽度';

export const Other = () => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      <Button
        onClick={() => {
          setModalVisible(true);
        }}
      >
        位置显示到距顶部20
      </Button>
      <div className="mt-2">
        更多设置，可参阅antd-Modal的官文：
        <a
          href="https://ant.design/components/modal-cn/"
          target="_blank"
          rel="noreferrer"
        >
          点这里
        </a>
      </div>
      <Modal
        centered={false}
        style={{ top: 20 }}
        visible={modalVisible}
        title="设置"
        onConfirm={() => {
          setModalVisible(false);
        }}
        onCancel={() => {
          setModalVisible(false);
        }}
      >
        <div className="py-4 px-6">展示内容</div>
      </Modal>
    </>
  );
};
Other.storyName = '其他';
