import { useState } from 'react';
import { createContainer } from 'unstated-next';
import { useAccess } from '@/common/providers/AccessProvider';
import { dealDiffMarkRead } from '@/common/services/api/deal/diff-mark-read';
import { OmsAccessCodeSuffix } from '@/common/types/access';
import { getOmsAccessCodeEnum } from '@/common/utils/access';
import { DealContainerData, DiffDealType } from '@/components/IDCDealDetails/type';
import { useProductParams } from '@/layouts/Home/hooks';
import { miscStorage } from '@/localdb/miscStorage';

export const DealPanelContainer = createContainer(() => {
  const { access } = useAccess();
  const { productType } = useProductParams();
  const [agentVisible, setAgentVisible] = useState(false); // 代付机构
  const [groupSettingVisible, setGroupSettingVisible] = useState(false); // 分组设置
  const [editBridgeVisible, setEditBridgeVisible] = useState(false); // 桥编辑
  const [messageEditValue, setMessageEditValue] = useState<DealContainerData | undefined>(undefined);
  const [selectedBrokerId, setSelectedBrokerId] = useState(miscStorage.userInfo?.user_id); // 当前面板选中的经纪人id

  const [bridgeListVisible, setBridgeListVisible] = useState(true); // 桥列表是否展示

  const [diff, setDiff] = useState<({ dealId: string } & DiffDealType) | undefined>();

  const closeDiffModal = () => {
    setDiff(undefined);
  };

  const accessCache = {
    bridgeEdit: access?.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.DealDetailBridgeEdit)),
    sendEdit: access?.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.DealDetailSendEdit)),
    send: access?.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.DealDetailSend)),
    buzz: access?.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.DealDetailBuzz)),
    bridgeInstAdd: access?.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.DealDetailBridgeInstAdd)),
    log: access?.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.DealDetailLog)),
    payforRate: access?.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.DealDetailPayforRate))
  };

  const handleDiffModalConfirm = async () => {
    if (!diff?.dealId) return;
    await dealDiffMarkRead({ deal_id_list: [diff.dealId] });
    closeDiffModal();
  };

  return {
    accessCache,
    selectedBrokerId,
    setSelectedBrokerId,

    diff,
    setDiff,
    closeDiffModal,
    handleDiffModalConfirm,

    /** 代付机构 */
    agentVisible,
    setAgentVisible,

    /** 分组配置 */
    groupSettingVisible,
    setGroupSettingVisible,

    /** 桥编辑 */
    editBridgeVisible,
    setEditBridgeVisible,

    /** 发单信息编辑 */
    messageEditValue,
    setMessageEditValue,

    /** 桥列表是否展示 */
    bridgeListVisible,
    setBridgeListVisible
  };
});

/** 明细面板的一些全局状态 */
export const DealPanelProvider = DealPanelContainer.Provider;
export const useDealPanel = DealPanelContainer.useContainer;
