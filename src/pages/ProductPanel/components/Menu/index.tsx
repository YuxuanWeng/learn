import { useState } from 'react';
import cx from 'classnames';
import { isNCD } from '@fepkg/business/utils/product';
import { ModalUtils } from '@fepkg/components/Modal';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { User } from '@fepkg/services/types/common';
import { MultiQuotationGroup } from '@/components/MultiQuotationGroup';
import { QuotationGroup } from '@/components/QuotationGroup';
import { ContextMenuItemType } from '@/components/QuotationGroup/types';
import { useProductParams } from '@/layouts/Home/hooks';
import { miscStorage } from '@/localdb/miscStorage';
import { useProductPanel } from '@/pages/ProductPanel/providers/PanelProvider';
import { useMainGroupData } from '../../providers/MainGroupProvider';
import { GroupShareModal } from '../GroupShare';
import { GroupShareProvider, useGroupShare } from '../GroupShare/provider';
import { transBrokersToUsers } from '../utils';

const MENU_WIDTH = 176;
// // 加 2 是因为设计稿为 176px，但左边框也会占据 1 px，计算后元素内内容才为设计稿的 176px 宽
const COMPUTED_WIDTH = MENU_WIDTH + 1;

type MenuProps = {
  /** 是否为悬浮模式的菜单 */
  floatingMode?: boolean;
};

const Inner = (props: MenuProps) => {
  const { floatingMode } = props;
  const {
    groupState,
    openedGroupIdList,
    replaceGroup,
    changeActiveGroup,
    isGroupReachLimit,
    createNewGroup,
    openNewDialog,
    copyGroup,
    deleteGroup,
    isShareGroupModified,
    continueShare,
    saveGroup
  } = useMainGroupData();
  const { productType } = useProductParams();

  const { open } = useGroupShare();

  const { groupOpen, toggleGroupOpen } = useProductPanel();

  const { activeGroupId: activeKey, groupList: options } = groupState;

  const [shareGroupId, setShareGroupId] = useState('');

  const [defaultShareUsers, setDefaultSelectedUsers] = useState<User[]>([]);

  const [contextProductType, setContextProductType] = useState(ProductType.ProductTypeNone);

  const handleContextMenuClick = (_, type: ContextMenuItemType, val?: string) => {
    if (!val) return;
    if (type === ContextMenuItemType.copy) copyGroup(val);
    if (type === ContextMenuItemType.delete) deleteGroup(val);
    if (type === ContextMenuItemType.share) {
      const shareUsers = groupState.groupList.find(v => v.groupId === val);
      const isShare = shareUsers?.creatorId !== miscStorage.userInfo?.user_id;
      setShareGroupId(val);

      const shareBrokers = shareUsers?.sharedBrokerList;
      setDefaultSelectedUsers(transBrokersToUsers(shareBrokers || []));
      if (isShare) {
        ModalUtils.warning({
          title: '分享失败！',
          content: '当前看板为他人分享，您可复制为新看板进行分享',
          okText: '复制',
          cancelText: '取消',
          onOk: async () => {
            await copyGroup(val);
          }
        });
      } else if (isShareGroupModified(val)) {
        ModalUtils.warning({
          title: '分享失败！',
          content: '当前看板筛选项未保存，是否保存为默认看板并分享？',
          onOk: async () => {
            await saveGroup(val);
            open();
          }
        });
      } else open();
    }
  };

  return (
    <div
      className={cx(
        'h-full pt-1 pb-1 bg-gray-700 overflow-hidden transition-margin duration-200 ease-linear',
        // 浮动模式不需要额外的圆角和边框
        floatingMode ? '' : 'rounded-tl-2xl border border-r-0 border-b-0 border-gray-600 border-solid'
      )}
      // 悬浮模式不需要偏移
      style={{ width: COMPUTED_WIDTH, marginLeft: groupOpen ? 0 : -(floatingMode ? 0 : COMPUTED_WIDTH) }}
    >
      {isNCD(productType) ? (
        <MultiQuotationGroup
          hiddenOpenIconIds={openedGroupIdList}
          visible
          floatingMode={floatingMode}
          title="行情看板"
          options={options}
          activeKey={activeKey}
          onChecked={changeActiveGroup}
          onExtendClick={() => toggleGroupOpen()}
          onDrop={async (drag, drop) => {
            await replaceGroup(drag, drop);
          }}
          isGroupReachLimit={isGroupReachLimit}
          onAddClick={addProductType => {
            createNewGroup(addProductType);
          }}
          onOpen={openNewDialog}
          onContextMenuClick={(evt, type, val, clickProductType) => {
            setContextProductType(clickProductType || ProductType.ProductTypeNone);
            handleContextMenuClick?.(evt, type, val);
          }}
        />
      ) : (
        <QuotationGroup
          hiddenOpenIconIds={openedGroupIdList}
          visible
          floatingMode={floatingMode}
          title="行情看板"
          options={options}
          activeKey={activeKey}
          onChecked={changeActiveGroup}
          onExtendClick={() => toggleGroupOpen()}
          onDrop={async (drag, drop) => {
            await replaceGroup(drag, drop);
          }}
          isGroupReachLimit={isGroupReachLimit}
          onAddClick={newProductType => {
            createNewGroup(newProductType);
          }}
          onOpen={openNewDialog}
          onContextMenuClick={(evt, type, val, clickProductType) => {
            setContextProductType(clickProductType || ProductType.ProductTypeNone);
            handleContextMenuClick?.(evt, type, val);
          }}
        />
      )}

      <GroupShareModal
        productType={contextProductType}
        onOk={async users => {
          await continueShare(shareGroupId, users);
        }}
        defaultShareUsers={defaultShareUsers}
      />
    </div>
  );
};

export const Menu = (props: MenuProps) => {
  return (
    <GroupShareProvider>
      <Inner {...props} />
    </GroupShareProvider>
  );
};
