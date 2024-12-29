import { useEffect, useState } from 'react';
import { Button } from '@fepkg/components/Button';
import { Caption } from '@fepkg/components/Caption';
import { UserSettingFunction } from '@fepkg/services/types/enum';
import { v4 } from 'uuid';
import BrokerSelect from '../../../BrokerSelect';
import { IBrokerInfo, IUserSettingValue } from '../../types';

type Props = {
  data: IUserSettingValue;
  onChange: (value: IUserSettingValue) => void;
};

export const TeamWork = ({ data, onChange }: Props) => {
  const brokerListSetting = data[UserSettingFunction.UserSettingTeamCollaboration] as IBrokerInfo[];

  const [brokerList, setBrokerList] = useState<IBrokerInfo[]>([]);

  const brokerSelectOnchange = (index: number, item?: IBrokerInfo) => {
    const tmp = [...brokerList];
    if (item) {
      tmp.splice(index, 1, item);
    } else {
      tmp.splice(index, 1);
    }

    setBrokerList(tmp);

    onChange({ [UserSettingFunction.UserSettingTeamCollaboration]: tmp });
  };

  useEffect(() => {
    const list = Array.isArray(brokerListSetting) ? brokerListSetting : [];
    setBrokerList(list);
  }, [brokerListSetting]);

  return (
    <div className="relative mt-6 w-[680px]">
      <Caption type="secondary">
        <span className="text-sm select-none font-bold">团队协作</span>
      </Caption>

      <div className="flex flex-wrap gap-x-[72px] gap-y-6 mt-6 pl-6 ">
        {brokerList?.map((item, index) => {
          return (
            <BrokerSelect
              key={item.id ?? index}
              value={item}
              onChange={(obj?: IBrokerInfo) => {
                brokerSelectOnchange(index, obj);
              }}
              deleteFlag={brokerList.length > 1}
              brokerList={brokerList}
            />
          );
        })}
        {brokerList?.length < 5 && (
          <Button
            tabIndex={-1}
            className="h-7"
            ghost
            onClick={() => {
              const tmp = [...brokerList, { id: v4() }];

              setBrokerList(tmp);
              onChange({ [UserSettingFunction.UserSettingTeamCollaboration]: tmp });
            }}
          >
            添加成员
          </Button>
        )}
      </div>
    </div>
  );
};
