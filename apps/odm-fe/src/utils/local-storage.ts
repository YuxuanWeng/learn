import { parseJSON } from '@fepkg/common/utils';

export const ODM_IS_DISPLAY_LOGOUT_LOCAL_STORAGE_KEY = 'ODM_IS_DISPLAY_LOGOUT_LOCAL_STORAGE_KEY';

export const ODM_IS_UPDATE_PASSWORD_LOCAL_STORAGE_KEY = 'ODM_IS_UPDATE_PASSWORD_LOCAL_STORAGE_KEY';

export const getIsDisplayLogoutModal = () => {
  const status = localStorage.getItem(ODM_IS_DISPLAY_LOGOUT_LOCAL_STORAGE_KEY) ?? 'false';
  return parseJSON<boolean>(status);
};

export const setIsDisplayLogoutModal = (value: boolean) => {
  return localStorage.setItem(ODM_IS_DISPLAY_LOGOUT_LOCAL_STORAGE_KEY, JSON.stringify(value));
};
