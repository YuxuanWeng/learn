import { useMemo } from 'react';
import { CheckboxGroup, CheckboxValue } from '@fepkg/components/Checkbox';
import { Modal } from '@fepkg/components/Modal';
import { RadioGroup } from '@fepkg/components/Radio';
import { Switch } from '@fepkg/components/Switch';
import { copyFormatOptions, remindMaxLengthOptions } from '../../constants';
import { useReminderConfig } from '../../provider';
import { CpHandicapEnum } from '../../types';
import { Header } from '../Header';
import { UserSettingProvider, useUserSetting } from './UserSettingProvider';

const Inner = () => {
  const { visible, formState, updateFormState, handleCancel, handleSubmit } = useUserSetting();
  return (
    <Modal
      visible={visible}
      width={520}
      title="用户设置"
      keyboard
      footerProps={{ centered: true }}
      mask={false}
      onCancel={handleCancel}
      onConfirm={handleSubmit}
      bodyStyle={{
        padding: '12px 14px',
        boxSizing: 'border-box'
      }}
    >
      <div className="bg-gray-600 border border-solid border-gray-500 rounded">
        <Header
          size="xs"
          title="复制最优盘口格式"
          className="!h-10"
          leftNode={
            <CheckboxGroup
              className="!bg-gray-600"
              options={copyFormatOptions}
              value={formState?.copyValues}
              onChange={val =>
                updateFormState(draft => {
                  if (!draft) return;
                  draft.copyValues = val;
                })
              }
            />
          }
        />
        <div className="component-dashed-x" />
        <Header
          size="xs"
          title="批量发送合并话术"
          className="!h-10"
          leftNode={
            <Switch
              checked={formState?.batchSend}
              onChange={val =>
                updateFormState(draft => {
                  if (!draft) return;
                  draft.batchSend = val;
                })
              }
            />
          }
        />
        <div className="component-dashed-x" />
        <Header
          size="xs"
          title="提醒展示上限"
          className="!h-10"
          leftNode={
            <RadioGroup
              type="radio"
              options={remindMaxLengthOptions}
              value={formState?.upperLimit}
              onChange={val =>
                updateFormState(draft => {
                  if (!draft) return;
                  draft.upperLimit = val;
                })
              }
            />
          }
        />
      </div>
    </Modal>
  );
};

export const UserSetting = () => {
  const { setting } = useReminderConfig();
  const defaultValues = useMemo(() => {
    const copyValues: CheckboxValue[] = [
      setting?.flag_issue_amount_for_cp_handicap ? CpHandicapEnum.issueAmount : '',
      setting?.flag_maturity_date_for_cp_handicap ? CpHandicapEnum.maturityDate : '',
      setting?.flag_valuation_for_cp_handicap ? CpHandicapEnum.valuation : ''
    ].filter(Boolean);
    const batchSend = setting?.merge_msg_for_batch;
    const upperLimit: CheckboxValue[] = [setting?.display_limit].filter(Boolean);
    return { copyValues, batchSend, upperLimit };
  }, [setting]);

  return (
    <UserSettingProvider
      key={JSON.stringify(defaultValues)}
      initialState={{ defaultValues }}
    >
      <Inner />
    </UserSettingProvider>
  );
};
