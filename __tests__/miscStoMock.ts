export const miscStorage = {
  userInfo: null
};

export function decorator(story, { parameters }) {
  miscStorage.userInfo = parameters?.userInfo;
  return story();
}
