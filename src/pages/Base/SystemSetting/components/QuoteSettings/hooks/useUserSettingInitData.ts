import { useEffect, useMemo, useRef } from 'react';
import { useImmer } from 'use-immer';
import { IUserSettingValue } from '../types';
import { getDiffData, getUserSettingsInitData } from '../utils';

export const useUserSettingInitData = () => {
  const [data, setData] = useImmer<IUserSettingValue<string>>({});

  const onChange = (value: IUserSettingValue) => {
    setData(draft => {
      Object.assign(draft, value);
    });
  };

  const oldData = useRef<IUserSettingValue<string>>();

  const getInitData = () => {
    const initData = getUserSettingsInitData();

    oldData.current = initData;
    onChange(initData);
  };

  const diffData = useMemo(() => {
    return getDiffData(data, oldData.current);
  }, [data, oldData]);

  useEffect(() => {
    getInitData();
    // 由于iniData中使用了useImmer库的setData函数会有warning，无需监听setData函数的变化
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    data,
    diffData,
    onChange
  };
};
