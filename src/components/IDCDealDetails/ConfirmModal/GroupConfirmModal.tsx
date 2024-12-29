import { Input, InputProps } from '@fepkg/components/Input';
import { Modal } from '@fepkg/components/Modal';
import { TypeGroupItem } from '@/components/IDCDealDetails/type';

type FormData = TypeGroupItem & { isAdd?: boolean };

type Props = {
  /** 弹窗开关 */
  visible: boolean;
  /** 表单默认值 */
  formData: FormData;
  /** 表单input改变触发 */
  onChange: InputProps['onChange'];
  /** 确认提交 */
  onSubmit: (val: FormData) => void;
  /** 取消 */
  onCancel?: () => void;
  /** 弹窗宽度 */
  width?: number;
};

export default function ConfirmModal({ width, visible, onCancel, formData, onSubmit, onChange }: Props) {
  if (!visible) return null;
  return (
    <Modal
      visible={visible}
      title={formData?.isAdd ? '添加分组' : '修改分组'}
      width={width}
      keyboard
      // 为什么在input中通过onEnterPress将modal关闭后，enter还会触发聚焦元素的click
      focusTriggerAfterClose={false}
      bodyStyle={{
        backgroundColor: 'var(--color-gray-100)',
        padding: '16px 24px'
      }}
      footerProps={{ background: 'bg-white', centered: true }}
      onCancel={() => {
        onCancel?.();
      }}
      onConfirm={() => onSubmit(formData)}
    >
      <Input
        theme="light"
        label="分组名称"
        value={formData.name}
        placeholder="请输入"
        onChange={onChange}
        onEnterPress={() => onSubmit(formData)}
        autoFocus
      />
    </Modal>
  );
}
