export const INST_RATING_TABLE_COLUMN_KEY = [
  /** 主体评级 */
  'rate_val',
  /** 评级日期 */
  'rating_date',
  /** 评级机构 */
  'inst_name'
] as const;

export type InstRatingTableColumnKey = (typeof INST_RATING_TABLE_COLUMN_KEY)[number];
