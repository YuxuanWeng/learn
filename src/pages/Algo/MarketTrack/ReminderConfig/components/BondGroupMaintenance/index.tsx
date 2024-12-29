import { useMemo } from 'react';
import cx from 'classnames';
import { useLocalStorage } from '@fepkg/business/hooks/useLocalStorage';
import { isUndefined } from 'lodash-es';
import { getTermRemainDaysConfigMap } from '@/common/utils/date';
import { GeneralFilterValue } from '@/components/BondFilter/types';
import { Filter } from '@/components/Filter';
import { useProductParams } from '@/layouts/Home/hooks';
import { miscStorage } from '@/localdb/miscStorage';
import {
  CONTAINER_CLS,
  IS_HOLIDAY_ALL,
  bondGroupDefaultValue,
  bondShortNameEtc,
  bondTypeEtc,
  remainDaysList
} from '../../constants';
import { useMutationSetting } from '../../hooks/useMutationSetting';
import { useReminderConfig } from '../../provider';
import { Header } from '../Header';

const getHoliday = (holiday?: boolean, all = false) => {
  if (all) return [true, false];
  if (isUndefined(holiday)) return [];
  return [holiday];
};

export const BondGroupMaintenance = () => {
  const { expanded, setting } = useReminderConfig();
  const user_id = miscStorage.userInfo?.user_id;
  // 避免同一台电脑换账号登录后状态仍然相同
  const [isAll, setIsAll] = useLocalStorage(`${IS_HOLIDAY_ALL}-${user_id}`, false);

  const { productType } = useProductParams();

  const bondGroupSetting = setting?.bond_filter_logic;
  const allValue = useMemo(() => {
    const remain_days_list = bondGroupSetting?.remain_days_list
      ?.map(i => getTermRemainDaysConfigMap().find(v => JSON.stringify(v.value) === JSON.stringify(i))?.label)
      .filter(Boolean);
    return bondGroupSetting
      ? ({
          ...bondGroupSetting,
          remain_days_list,
          maturity_is_holiday: getHoliday(bondGroupSetting?.maturity_is_holiday, isAll)
        } as GeneralFilterValue)
      : bondGroupDefaultValue;
  }, [bondGroupSetting, isAll]);

  const { updateBondGroup } = useMutationSetting();

  return (
    <div>
      <Header
        title="债券组维护管理"
        className={expanded ? 'rounded-b' : ''}
        // leftNode={
        // <ExpendIcon
        //   expanded={expanded}
        //   handleExpand={() => setExpanded(i => !i)}
        // />
        // }
      />
      <div className={cx(expanded ? 'hidden' : 'visible', 'flex flex-col p-3 gap-3', CONTAINER_CLS)}>
        <Filter
          productType={productType}
          configs={bondTypeEtc}
          value={allValue}
          onChange={({ currentState }) => updateBondGroup(currentState)}
        />
        <Filter
          productType={productType}
          configs={remainDaysList}
          value={allValue}
          onChange={({ currentState }) => updateBondGroup(currentState)}
        />
        <Filter
          productType={productType}
          configs={bondShortNameEtc}
          value={allValue}
          onChange={({ currentState }) => {
            if (currentState.maturity_is_holiday && currentState.maturity_is_holiday?.length > 1) setIsAll(true);
            else setIsAll(false);
            updateBondGroup(currentState);
          }}
        />
      </div>
    </div>
  );
};
