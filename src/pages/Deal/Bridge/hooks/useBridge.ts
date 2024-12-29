/** 封装桥机构的相关增删改茶逻辑 */
import { message } from '@fepkg/components/Message';
import { ModalUtils } from '@fepkg/components/Modal';
import { BridgeInstAdd } from '@fepkg/services/types/bridge/inst-add';
import { omit } from 'lodash-es';
import { addBridgeInst } from '@/common/services/api/bridge/inst-add';
import { delBridgeInst } from '@/common/services/api/bridge/inst-del';
import { updateBridgeInst } from '@/common/services/api/bridge/inst-update';
import { useProductParams } from '@/layouts/Home/hooks';
import { BridgeErrorCode } from '../../../Spot/utils/bridge';
import { useBridgeContext } from '../providers/BridgeProvider';
import { BridgeFormData } from '../types';
import { useBridgeInstList } from './useBridgeInstList';

/** 封装桥相关的逻辑 */
export default function useBridge() {
  const { refetch: refetchBridgeInst } = useBridgeInstList();
  const { productType } = useProductParams();
  const {
    bridge,
    visible,
    setVisible,
    isModify,
    setIsModify,
    stickyList,
    setStickyList,
    visibleBridgeModal,
    setVisibleBridgeModal
  } = useBridgeContext();

  const onClose = () => {
    setVisible(false);
    setIsModify(false);
  };

  /** 更新请求 */
  const onModify = async (formData: BridgeFormData) => {
    await updateBridgeInst({ ...formData, product_type: productType });
    refetchBridgeInst();
    message.success('更新成功');
  };

  /** 添加请求 */
  const onAdd = async (formData: BridgeFormData) => {
    const params: BridgeInstAdd.Request = { ...omit(formData, ['bridge_inst_id']), product_type: productType };
    try {
      await addBridgeInst(params, {
        hideErrorMessage: true
      });
      refetchBridgeInst();
      message.success('添加成功');
    } catch (e: any) {
      if (e?.data?.base_response?.code === BridgeErrorCode.AddBridgeInstDuplicatedContact) {
        message.error('机构联系人不可与已有联系人重复！');
      }
      throw e;
    }
  };

  /** 删除操作 */
  const onDel = async (bridgeInstId: string) => {
    await delBridgeInst({ bridge_inst_id: bridgeInstId, product_type: productType });
    setStickyList(stickyList.filter(v => v.bridge_inst_id !== bridgeInstId));
    refetchBridgeInst();
    message.success('删除成功');
  };

  /** 桥机构编辑提交 */
  const onSubmit = async (formData: BridgeFormData) => {
    if (formData.bridge_inst_id) {
      // 编辑
      await onModify(formData);
    } else {
      // 新增
      await onAdd(formData);
    }
    onClose();
  };

  /** 桥编辑取消 */
  const onCancel = () => {
    onClose();
  };

  /** 打开新增窗口 */
  const addBridge = () => {
    setVisible(true);
  };

  /** 打开编辑窗口 */
  const updateBridge = () => {
    setVisible(true);
    setIsModify(true);
  };

  const delBridge = () => {
    const bridgeInstId = bridge?.bridge_inst_id || '';
    if (!bridgeInstId) return;

    ModalUtils.error({
      title: '删除桥机构',
      content: '桥机构删除后不可恢复，是否删除？',
      titleSize: 'sm',
      onOk: () => {
        onDel(bridgeInstId);
      }
    });
  };

  return {
    bridgeVisible: visible,
    setBridgeVisible: setVisible,
    bridgeModify: isModify,
    setBridgeModify: setIsModify,
    bridgeOnSubmit: onSubmit,
    bridgeOnCancel: onCancel,
    addBridge,
    updateBridge,
    delBridge,
    bridge,
    stickyList,
    setStickyList,
    visibleBridgeModal,
    setVisibleBridgeModal
  };
}
