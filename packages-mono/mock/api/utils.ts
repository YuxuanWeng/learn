import { API_BASE, API_MOCK_HOST } from '@fepkg/request/constants';

export const getMockBaseUrl = (url: string, apiBase = API_BASE) => {
  return `${API_MOCK_HOST}${apiBase}${url}`;
};
