import { User } from '@fepkg/services/types/bdm-common';

export type useLiveAccessQueryProps = {
  userId?: string;
  enable?: boolean;
  onSuccess?: (data?: User) => void;
};
