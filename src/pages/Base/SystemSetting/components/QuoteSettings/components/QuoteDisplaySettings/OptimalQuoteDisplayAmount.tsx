import { useMemo } from 'react';
import { UserSettingFunction } from '@fepkg/services/types/enum';
import { useMemoizedFn } from 'ahooks';
import CommonSwitch from '../../../CommonSwitch';
import { DefaultOptimalQuoteDisplayAmount } from '../../constants';
import { CommonTypeValue, IUserSettingValue, QuoteDisplayAmount } from '../../types';

type OptimalQuoteDisplayAmountProps = {
  data: IUserSettingValue;
  onChange: (value: IUserSettingValue) => void;
};

export const isQuoteDisplayAmountObj = (rowData: CommonTypeValue): rowData is QuoteDisplayAmount => {
  if (!rowData) return false;
  if (typeof rowData === 'object' && 'internal' in rowData && 'external' in rowData) {
    return true;
  }
  return false;
};
const OptimalQuoteDisplayAmount = ({ data, onChange }: OptimalQuoteDisplayAmountProps) => {
  const config = useMemo(() => {
    const initData = data[UserSettingFunction.UserSettingOptimalQuoteDisplayAmount];
    if (isQuoteDisplayAmountObj(initData)) {
      return initData;
    }
    return DefaultOptimalQuoteDisplayAmount;
  }, [data]);

  const optimalQuoteDisplayAmountChange = useMemoizedFn((type: keyof QuoteDisplayAmount, value: boolean) => {
    if (config && typeof config !== 'object' && !(type in config)) {
      return;
    }

    onChange({
      [UserSettingFunction.UserSettingOptimalQuoteDisplayAmount]: {
        ...config,
        [type]: value
      }
    });
  });

  return (
    <>
      <CommonSwitch
        label="明盘-实时盘口数量标识"
        value={config?.external}
        onChange={(value: boolean) => {
          optimalQuoteDisplayAmountChange('external', value);
        }}
      />

      <CommonSwitch
        label="暗盘-实时盘口数量标识"
        value={config?.internal}
        onChange={(value: boolean) => {
          optimalQuoteDisplayAmountChange('internal', value);
        }}
      />
    </>
  );
};

export default OptimalQuoteDisplayAmount;
