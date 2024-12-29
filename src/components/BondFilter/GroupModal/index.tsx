import cx from 'classnames';
import { Button } from '@fepkg/components/Button';
import { Modal } from '@fepkg/components/Modal';
import { Placeholder } from '@fepkg/components/Placeholder';
import { SettingLayout } from '@fepkg/components/SettingLayout';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { useAdvanceGroupQuery } from '@/common/services/hooks/useAdvanceGroupQuery';
import { AddGroupModal } from '@/components/AddGroupModal';
import { NCDFiltersParsingTextArea } from '@/components/BondFilter/NCDFiltersParsing';
import { FilterBody } from './FilterBody';
import { FilterHeader } from './FilterHeader';
import { GroupBody } from './GroupBody';
import { GroupHeader } from './GroupHeader';
import { PanelGroupConfigProvider, usePanelGroupConfig } from './provider';

type GroupConfigModalProps = {
  visible?: boolean;
  onClose?: () => void;
};

const bodyHeight = {
  [ProductType.NCD]: 'h-[472px]',
  [ProductType.BCO]: 'h-[532px]'
};

const Inner = () => {
  const { groups, groupContainerRef, productType, handleParsing, setAddGroupModalVisible } = usePanelGroupConfig();
  const height = bodyHeight[productType];

  if (!groups.length) {
    return (
      <div className={cx('bg-gray-750 relative flex items-center w-full', height)}>
        <Placeholder
          type="no-setting"
          size="sm"
          label={
            <div className=" flex items-center text-gray-200 flex-col gap-3">
              <span>暂未配置分组</span>
              <Button
                className="w-[116px]"
                onClick={() => {
                  setAddGroupModalVisible(true);
                }}
              >
                添加分组
              </Button>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div
      className={cx('flex justify-between focus:outline-none', height)}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      ref={groupContainerRef}
    >
      <SettingLayout
        containerCls="h-full"
        aside={
          <div className="w-40 min-w-[160px] border-solid border-0 border-r border-r-gray-600 pl-3 flex flex-col">
            <GroupHeader />
            <div className="component-dashed-x-600 mr-3" />
            <GroupBody />
          </div>
        }
        header={<FilterHeader />}
      >
        <div className="flex flex-col flex-auto select-none gap-2">
          <NCDFiltersParsingTextArea onChange={handleParsing} />
          <FilterBody />
        </div>
      </SettingLayout>
    </div>
  );
};

const Wrapper = ({ visible, onClose }: GroupConfigModalProps) => {
  const { addGroupModalVisible, addGroup, setAddGroupModalVisible } = usePanelGroupConfig();

  return (
    <>
      <Modal
        keyboard
        confirmByEnter
        visible={visible}
        width={880}
        title="行情分组配置"
        onCancel={onClose}
        footer={null}
      >
        <Inner />
      </Modal>
      <AddGroupModal
        visible={addGroupModalVisible}
        onOk={addGroup}
        onCancel={() => {
          setAddGroupModalVisible(false);
        }}
      />
    </>
  );
};

export const GroupConfigModal = (props: GroupConfigModalProps) => {
  const { data } = useAdvanceGroupQuery();
  if (!props.visible || !data) return null;
  return (
    <PanelGroupConfigProvider>
      <Wrapper {...props} />
    </PanelGroupConfigProvider>
  );
};
