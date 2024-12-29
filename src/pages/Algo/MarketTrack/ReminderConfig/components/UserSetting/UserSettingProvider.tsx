import { CheckboxValue } from '@fepkg/components/Checkbox';
import { useAtom } from 'jotai';
import { createContainer } from 'unstated-next';
import { useImmer } from 'use-immer';
import { GLOBAL_SCOPE } from '@/common/atoms';
import { userSettingMdlOpen } from '../../../atom';
import { useMutationSetting } from '../../hooks/useMutationSetting';
import { CpHandicapEnum } from '../../types';

type InitialState = {
  defaultValues: { copyValues: CheckboxValue[]; batchSend?: boolean; upperLimit: CheckboxValue[] };
};

const UserSettingContainer = createContainer((initialState?: InitialState) => {
  const [visible, setVisible] = useAtom(userSettingMdlOpen, GLOBAL_SCOPE);
  const { update } = useMutationSetting();

  const [formState, updateFormState] = useImmer(initialState?.defaultValues);

  const handleCancel = () => {
    updateFormState(initialState?.defaultValues);
    setVisible(false);
  };

  const handleSubmit = () => {
    const params = {
      merge_msg_for_batch: formState?.batchSend,
      flag_valuation_for_cp_handicap: formState?.copyValues?.includes(CpHandicapEnum.valuation),
      flag_issue_amount_for_cp_handicap: formState?.copyValues?.includes(CpHandicapEnum.issueAmount),
      flag_maturity_date_for_cp_handicap: formState?.copyValues?.includes(CpHandicapEnum.maturityDate),
      display_limit: formState?.upperLimit.at(0) as number
    };
    update(params);
    setVisible(false);
  };

  return {
    visible,
    formState,
    updateFormState,
    handleCancel,
    handleSubmit
  };
});

export const UserSettingProvider = UserSettingContainer.Provider;
export const useUserSetting = UserSettingContainer.useContainer;
