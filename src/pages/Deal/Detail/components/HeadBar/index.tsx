import { Button } from '@fepkg/components/Button';
import { useDialogWindow } from '@/common/hooks/useDialog';
import { useProductParams } from '@/layouts/Home/hooks';
import { getIDCBridgeConfig } from '@/pages/Spot/utils/openDialog';
import { useDealPanel } from '../../provider';
import { AgentModal } from '../AgentModal';
import { GroupSettingModal } from '../GroupSettingModal';

export const SettingGroup = () => {
  const { accessCache, setAgentVisible, setGroupSettingVisible } = useDealPanel();
  const { productType } = useProductParams();

  const { openDialog } = useDialogWindow();
  return (
    <div className="flex gap-4">
      <Button
        type="gray"
        ghost
        text
        className="h-7"
        disabled={!accessCache.payforRate}
        onClick={() => {
          setAgentVisible(true);
        }}
      >
        需代付机构
      </Button>
      <Button
        type="gray"
        ghost
        text
        className="h-7"
        onClick={() => {
          setGroupSettingVisible(true);
        }}
      >
        分组配置
      </Button>
      <Button
        type="gray"
        ghost
        text
        className="h-7"
        onClick={() => {
          openDialog(getIDCBridgeConfig(productType));
        }}
      >
        过桥
      </Button>
      <AgentModal />
      <GroupSettingModal />
    </div>
  );
};
