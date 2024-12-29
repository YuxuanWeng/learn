/** 窗口生命周期枚举 */
export enum WindowLifeCycleEnum {
  /** 初始值 */
  Initial = 0,
  /** 创建之前 */
  BeforeCreate = 1,
  /** 创建中 */
  Creating = 2,
  /** 创建完成 */
  Created = 3,
  /** 初始化 */
  BeforeInitialize = 4,
  /** 初始化中 */
  Initializing = 5,
  /** 完成初始化 */
  Initialized = 6,
  /** ready */
  Ready = 7,
  /** 关闭之前 */
  BeforeClose = 8,
  /** 关闭中 */
  Closing = 9,
  /** 已关闭 */
  Closed = 10
}
