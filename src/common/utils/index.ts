export const isProd = () => {
  return window.appConfig?.env === 'prod';
};
