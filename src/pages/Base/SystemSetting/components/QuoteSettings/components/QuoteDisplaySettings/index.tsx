import { Caption } from '@fepkg/components/Caption';
import { UserSettingFunction } from '@fepkg/services/types/enum';
import CommonRadio from '../../../CommonRadio';
import CommonSwitch from '../../../CommonSwitch';
import { IUserSettingValue, TypeItem } from '../../types';
import { TeamWork } from '../TeamWork';
import OptimalQuoteDisplayAmount from './OptimalQuoteDisplayAmount';

type QuoteDisplaySettingsProps = {
  data: IUserSettingValue;
  onChange: (value: IUserSettingValue) => void;
};

const bondOptions: TypeItem[] = [
  { label: '联动', value: 1 },
  { label: '不联动', value: 0 }
];
const QuoteDisplaySettings = ({ data, onChange }: QuoteDisplaySettingsProps) => {
  return (
    <div className="mt-6">
      <Caption type="orange">
        <span className="text-sm select-none font-bold">报价展示</span>
      </Caption>

      <div className="flex flex-wrap gap-x-[72px] mt-6 pl-6">
        <OptimalQuoteDisplayAmount
          data={data}
          onChange={onChange}
        />
      </div>
      <div className="flex flex-wrap gap-x-[72px] mt-6 pl-6">
        <CommonSwitch
          label="实时盘口-报价悬浮窗"
          value={data[UserSettingFunction.UserSettingDisplaySetting]}
          onChange={value => {
            onChange({ [UserSettingFunction.UserSettingDisplaySetting]: value });
          }}
        />
        <CommonRadio
          className="w-[280px]"
          label="搜券联动带入"
          value={data[UserSettingFunction.UserSettingInitSearchBond]}
          list={bondOptions}
          key="搜券联动带入"
          onChange={value => {
            onChange({ [UserSettingFunction.UserSettingInitSearchBond]: value });
          }}
        />
      </div>

      <TeamWork
        data={data}
        onChange={onChange}
      />
    </div>
  );
};

export default QuoteDisplaySettings;
