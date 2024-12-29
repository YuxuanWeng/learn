import { Input } from '@fepkg/components/Input';
import { IconSearch } from '@fepkg/icon-park-react';
import { useReminderChannel } from './ReminderChannelProvider';

export const TraderSettingFilter = () => {
  const { inputValue, setInputValue } = useReminderChannel();
  return (
    <Input
      className="!w-60"
      placeholder="请输入交易员姓名/机构名称"
      suffixIcon={<IconSearch />}
      padding={[2, 12]}
      value={inputValue}
      onChange={setInputValue}
    />
  );
};
