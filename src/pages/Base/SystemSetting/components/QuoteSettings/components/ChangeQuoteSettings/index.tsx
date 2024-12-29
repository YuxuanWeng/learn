import { Caption } from '@fepkg/components/Caption';
import { UserSettingFunction } from '@fepkg/services/types/enum';
import CommonSwitch from '../../../CommonSwitch';
import { IUserSettingValue } from '../../types';

type ChangeQuoteSettingsProps = {
  data: IUserSettingValue;
  onChange: (value: IUserSettingValue) => void;
};

const ChangeQuoteSettings = ({ data, onChange }: ChangeQuoteSettingsProps) => {
  return (
    <div className="mt-6">
      <Caption>
        <span className="text-sm select-none font-bold">报价修改</span>
      </Caption>

      <div className="flex gap-x-[72px] mt-6 ml-6">
        <CommonSwitch
          label="价格快捷修改等待时间"
          value={data[UserSettingFunction.UserSettingQuoteShortcutWaitTime]}
          onChange={val => {
            onChange({
              [UserSettingFunction.UserSettingQuoteShortcutWaitTime]: val
            });
          }}
        />
        <CommonSwitch
          label="数量快捷修改等待时间"
          value={data[UserSettingFunction.UserSettingAmountShortcutWaitTime]}
          onChange={val => {
            onChange({
              [UserSettingFunction.UserSettingAmountShortcutWaitTime]: val
            });
          }}
        />
      </div>
    </div>
  );
};

export default ChangeQuoteSettings;
