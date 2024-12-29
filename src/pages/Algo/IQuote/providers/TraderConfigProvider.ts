import { BargainFlagType, BigVolumeType, ClearSpeedType, InternalType } from '@fepkg/services/types/algo-enum';

export type UpdateFnProps = { traderId: string } & (
  | {
      key: 'clear_speed_type';
      value: ClearSpeedType;
    }
  | {
      key: 'big_volume_type';
      value: BigVolumeType;
    }
  | {
      key: 'internal_type';
      value: InternalType;
    }
  | {
      key: 'bargain_flag_type';
      value: BargainFlagType;
    }
);
