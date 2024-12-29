import { useEffect, useRef, useState } from 'react';
import { useLocalStorage } from '@fepkg/business/hooks/useLocalStorage';
import { BridgeInstInfo, ReceiptDealDetail } from '@fepkg/services/types/bds-common';
import { SettlementLabel } from '@fepkg/services/types/bds-enum';
import { createContainer } from 'unstated-next';
import { LSKeys, getLSKeyWithoutProductType } from '@/common/constants/ls-keys';
import { useAccess } from '@/common/providers/AccessProvider';
import { OmsAccessCodeSuffix } from '@/common/types/access';
import { getOmsAccessCodeEnum } from '@/common/utils/access';
import { useProductParams } from '@/layouts/Home/hooks';
import { ArrowAreaEnum, TypeBridgeId } from '../types';

const BridgeContextContainer = createContainer(() => {
  const { access } = useAccess();
  const { productType } = useProductParams();

  const accessCache = {
    bridge: access?.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.BridgePage)),
    bridgeRecordEdit: access?.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.BridgeRecordEdit)),
    bridgeInstEdit: access?.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.BridgeInstEdit)),
    bridgeInstAdd: access?.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.DealDetailBridgeInstAdd)),
    log: access?.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.BridgeLog)),
    bridgeEdit: access?.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.BridgeRecordEdit))
  };

  // 订单明细的容器
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);
  // 单条订单
  const [activeKey, setActiveKey] = useState<string>();

  // 单条编辑visible
  const [parentDealIds, setParentDealIds] = useState<string[]>();
  const [batchModalVisible, setBatchModalVisible] = useState(false);

  const innerReceiptDealDetailRef = useRef<ReceiptDealDetail[]>();

  // 桥的容器
  const bridgeInstContainerRef = useRef<HTMLDivElement>(null);
  const bridgeInstItemRef = useRef<HTMLDivElement>(null);
  // 桥
  const [activeKeyBridgeInst, setActiveKeyBridgeInst] = useState<string>();

  const [visible, setVisible] = useState(false);
  const [isModify, setIsModify] = useState(false);

  const stickyKey = getLSKeyWithoutProductType(LSKeys.AlwaysOnTopBridgeList);
  const [stickyList, setStickyList] = useLocalStorage<TypeBridgeId[]>(stickyKey, []);

  // 当前选中的tab
  const [activeTab, setActiveTab] = useState(SettlementLabel.SettlementLabelToday);

  /** 键盘事件监听的活动区域  */
  const [activeArea, setActiveArea] = useState(ArrowAreaEnum.Other);

  /** 当前选中的桥 */
  const [bridge, setBridge] = useState<BridgeInstInfo>();

  // 换桥相关逻辑
  const [visibleBridgeModal, setVisibleBridgeModal] = useState(false);

  useEffect(() => {
    if (containerRef.current != null) {
      containerRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  return {
    productType,
    accessCache,

    innerReceiptDealDetailRef,

    parentDealIds,
    setParentDealIds,

    batchModalVisible,
    setBatchModalVisible,

    activeKey,
    setActiveKey,
    containerRef,
    itemRef,
    bridgeInstContainerRef,
    bridgeInstItemRef,
    activeKeyBridgeInst,
    setActiveKeyBridgeInst,
    activeTab,
    setActiveTab,
    activeArea,
    setActiveArea,
    bridge,
    setBridge,
    visible,
    setVisible,
    isModify,
    setIsModify,
    stickyList,
    setStickyList,
    visibleBridgeModal,
    setVisibleBridgeModal
  };
});

export const BridgeProvider = BridgeContextContainer.Provider;
export const useBridgeContext = BridgeContextContainer.useContainer;
