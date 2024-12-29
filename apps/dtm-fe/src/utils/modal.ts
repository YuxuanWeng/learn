import { Cache } from '@fepkg/common/utils/cache';

export const MODAL_CACHE_KEY = 'modal';

export type ModalCache = {
  logoutOpen?: boolean;
};

export const modalCache = new Cache<ModalCache>({});

export const setIsDisplayLogoutModal = (value: boolean) => {
  modalCache.set(MODAL_CACHE_KEY, { logoutOpen: value });
};

export const getIsDisplayLogoutModal = () => {
  return modalCache.get(MODAL_CACHE_KEY)?.logoutOpen;
};
