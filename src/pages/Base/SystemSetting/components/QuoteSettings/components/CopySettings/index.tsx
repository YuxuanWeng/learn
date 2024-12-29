import { Caption } from '@fepkg/components/Caption';
import { UserSettingFunction } from '@fepkg/services/types/enum';
import CommonCheckBox from '../../../CommonCheckBox';
import CommonRadio from '../../../CommonRadio';
import { IUserSettingValue, TypeItem } from '../../types';

type CopySettingsProps = {
  data: IUserSettingValue;
  onChange: (value: IUserSettingValue) => void;
};

const copyTypeOptions: TypeItem[] = [
  { label: 'Alt+点击复制暗盘', value: 0 },
  { label: '点击即复制暗盘', value: 1 }
];

const CopySettings = ({ data, onChange }: CopySettingsProps) => {
  return (
    <div className="pt-6">
      <Caption>
        <span className="text-sm select-none font-bold">行情复制</span>
      </Caption>

      <div className="w-[632px] h-7 mt-6 ml-6 border border-solid border-gray-600 rounded-lg">
        <CommonRadio
          border={false}
          label="盘口复制方式"
          value={data[UserSettingFunction.UserSettingOptimalQuoteCopyMethod]}
          list={copyTypeOptions}
          onChange={value => {
            onChange({ [UserSettingFunction.UserSettingOptimalQuoteCopyMethod]: value });
          }}
        />
      </div>

      <div className="w-[632px] mt-6 ml-6 pl-3 border border-solid border-gray-600 rounded-lg">
        <div className="flex h-[26px]">
          <div className="text-sm mr-4 text-gray-200 font-medium flex items-center">复制内容设置</div>
          <div className="flex items-center gap-x-4">
            <CommonCheckBox
              label="含估值"
              value={data[UserSettingFunction.UserSettingIncludeValuation]}
              onChange={value => {
                onChange({ [UserSettingFunction.UserSettingIncludeValuation]: value });
              }}
            />
            <CommonCheckBox
              label="久期"
              value={data[UserSettingFunction.UserSettingIncludeDuration]}
              onChange={value => {
                onChange({ [UserSettingFunction.UserSettingIncludeDuration]: value });
              }}
            />
            <CommonCheckBox
              label="含发行量"
              value={data[UserSettingFunction.UserSettingIncludeIssueAmount]}
              onChange={value => {
                onChange({ [UserSettingFunction.UserSettingIncludeIssueAmount]: value });
              }}
            />
            <CommonCheckBox
              label="含到期日"
              value={data[UserSettingFunction.UserSettingIncludeMaturityDate]}
              onChange={value => {
                onChange({ [UserSettingFunction.UserSettingIncludeMaturityDate]: value });
              }}
            />
            <CommonCheckBox
              label="按期限排序"
              value={data[UserSettingFunction.UserSettingSortByTerm]}
              onChange={value => {
                onChange({ [UserSettingFunction.UserSettingSortByTerm]: value });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CopySettings;
