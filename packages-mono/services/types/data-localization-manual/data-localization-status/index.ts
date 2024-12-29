/**
 * @description 查询当前可用的本地化状态
 */
export declare namespace DataLocalizationStatus {
  type Request = {
    //
  };

  type Response = {
    pid?: number;
    table_info?: {
      [k in string]?: number;
    };
  };
}
