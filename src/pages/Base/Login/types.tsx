// 修改对象中的字段不会触发 proxy 修改localStorage
export type UserLoginForm = {
  userId: string;
  password?: string;
  username?: string;
  shouldRememberPassword: boolean;
};

export type LoginFormData = { [key: string]: UserLoginForm[] };

export type LoginCarouselItem = {
  /** 标题 */
  title: string;
  /** 文案，元组中第 n 项为第 n 行 */
  content: [string, string];
  /** 图片 */
  src: string;
};
