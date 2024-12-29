import { Side } from '@fepkg/services/types/enum';
import { SideSwitch } from '@/components/SideSwitch';
import { useBatchQuoteOper } from '../../providers/BatchQuoteOperProvider';
import { OperItem } from './OperItem';

export const SideTabs = () => {
  const { selectedSide, setSelectedSide } = useBatchQuoteOper();

  return (
    <OperItem label="方向">
      <SideSwitch
        value={selectedSide ?? Side.SideNone}
        className="bg-gray-800"
        onChange={val => {
          if (val === Side.SideBid) setSelectedSide(prev => (prev === Side.SideBid ? void 0 : Side.SideBid));
          else setSelectedSide(prev => (prev === Side.SideOfr ? void 0 : Side.SideOfr));
        }}
      />
    </OperItem>
  );
};
