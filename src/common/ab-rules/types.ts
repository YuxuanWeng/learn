export enum CompareType {
  Equal = 0,
  Greater = 1,
  Less = 2
}

export type ABRule = {
  /** 实验名称 */
  name?: string;
  /** 实验唯一标识 */
  exper_key?: string;
  /** 返回类型 */
  type?: 'string' | 'boolean' | 'number';
  /** 实验值 */
  exper_value?: string | boolean | number;
  /** 默认值 */
  default_value?: string | boolean | number;
  /** 灰度比例 */
  gray_scale?: number;
  /** 与生效版本的比较 */
  compare_type?: CompareType;
  /** 生效版本 */
  version?: string;
  /** 白名单 */
  white_list?: string[] | string;
  /** 黑名单 */
  black_list?: string[] | string;
  /** 是否生效 */
  open?: boolean;
  /** 最后更新时间 */
  last_modify?: number;
};

export const NAME_SPACE = 'bds_ab';
