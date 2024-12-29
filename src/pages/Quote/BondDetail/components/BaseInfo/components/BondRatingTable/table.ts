export const BOND_RATING_TABLE_COLUMN_KEY = [
  /** 债券评级 */
  'bond_rating',
  /** 评级日期 */
  'rating_date',
  /** 评级机构 */
  'rating_institution_name'
] as const;

export type BondRatingTableColumnKey = (typeof BOND_RATING_TABLE_COLUMN_KEY)[number];
