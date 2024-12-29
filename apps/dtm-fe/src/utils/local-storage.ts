import { parseJSON } from '@fepkg/common/utils';

export const DA_IS_UPDATE_PASSWORD_LOCAL_STORAGE_KEY = 'DA_IS_UPDATE_PASSWORD_LOCAL_STORAGE_KEY';

export const getIsUpdatePassword = () => {
  const status = localStorage.getItem(DA_IS_UPDATE_PASSWORD_LOCAL_STORAGE_KEY) ?? 'false';
  return parseJSON<boolean>(status);
};

export const setIsUpdatePassword = (value: boolean) => {
  return localStorage.setItem(DA_IS_UPDATE_PASSWORD_LOCAL_STORAGE_KEY, JSON.stringify(value));
};
