const createTable = `
create table if not exists bond_detail(
    ficc_id                     varchar(64)      default ''     not null    primary key,
    enable                      tinyint          default 0      not null,
    sync_version                varchar(32)      default ''     not null,
    key_market                  varchar(64)      default ''     not null,
    code_market                 varchar(32)      default ''     not null,
    bond_code                   varchar(24)      default ''     not null,
    bond_key                    varchar(64)      default ''     not null,
    listed_market               varchar(3)       default ''     not null,
    listed_date                 varchar(32)      default ''     not null,
    delisted_date               varchar(32)      default ''     not null,
    full_name                   varchar(255)     default ''     not null,
    short_name                  varchar(64)      default ''     not null,
    pinyin                      varchar(512)     default ''     not null,
    pinyin_full                 varchar(1024)    default ''     not null,
    bond_category               tinyint          default 0      not null,
    fr_type                     tinyint          default 0      not null,
    perp_type                   tinyint          default 0      not null,
    has_option                  tinyint          default 0      not null,
    interest_start_date         varchar(32)      default ''     not null,
    maturity_date               varchar(32)      default ''     not null,
    maturity_is_holiday         tinyint          default 0      not null,
    next_coupon_date            varchar(32)      default ''     not null,
    option_date                 varchar(32)      default ''     not null,
    coupon_rate_current         decimal(12, 6)   default -1     not null,
    issue_rate                  decimal(12, 6)   default -1     not null,
    issue_amount                decimal(20, 6)   default -1     not null,
    redemption_no               int              default -1     not null,
    implied_rating              varchar(10)      default ''     not null,
    issuer_rating               varchar(10)      default ''     not null,
    is_cross_mkt                tinyint          default 0      not null,
    mkt_type                    tinyint          default 0      not null,
    time_to_maturity            varchar(32)      default ''     not null,
    conversion_rate             decimal(12, 6)   default -1     not null,
    fund_objective_sub_category varchar(32)      default ''     not null,
    fund_objective_category     varchar(32)      default ''     not null,
    rating                      varchar(10)      default ''     not null,
    issuer_code                 varchar(7)       default ''     not null,
    display_code                varchar(32)      default ''     not null,
    product_type                tinyint          default 0      not null,
    with_warranty               tinyint          default 0      not null,
    is_fixed_rate               tinyint          default 0      not null,
    val_yield_exercise          decimal(12, 6)   default -1     not null,
    val_yield_maturity          decimal(12, 6)   default -1     not null,
    val_clean_price_exercise    decimal(12, 6)   default -1     not null,
    val_clean_price_maturity    decimal(12, 6)   default -1     not null,
    val_modified_duration       decimal(12, 6)   default -1     not null,
    val_convexity               decimal(12, 6)   default -1     not null,
    val_basis_point_value       decimal(12, 6)   default -1     not null,
    csi_yield_exercise          decimal(12, 6)   default -1     not null,
    csi_yield_maturity          decimal(12, 6)   default -1     not null,
    csi_clean_price_exercise    decimal(12, 6)   default -1     not null,
    csi_clean_price_maturity    decimal(12, 6)   default -1     not null,
    csi_full_price_exercise     decimal(12, 6)   default -1     not null,
    csi_full_price_maturity     decimal(12, 6)   default -1     not null,
    repayment_method            tinyint          default 0      not null,
    first_maturity_date         varchar(32)      default ''     not null,
    option_type                 tinyint          default 0      not null,
    call_str                    varchar(32)      default ''     not null,
    put_str                     varchar(32)      default ''     not null
)`;

const upsert = `
insert into bond_detail values(
    $ficc_id,
    $enable,
    $sync_version,
    $key_market,
    $code_market,
    $bond_code,
    $bond_key,
    $listed_market,
    $listed_date,
    $delisted_date,
    $full_name,
    $short_name,
    $pinyin,
    $pinyin_full,
    $bond_category,
    $fr_type,
    $perp_type,
    $has_option,
    $interest_start_date,
    $maturity_date,
    $maturity_is_holiday,
    $next_coupon_date,
    $option_date,
    $coupon_rate_current,
    $issue_rate,
    $issue_amount,
    $redemption_no,
    $implied_rating,
    $issuer_rating,
    $is_cross_mkt,
    $mkt_type,
    $time_to_maturity,
    $conversion_rate,
    $fund_objective_sub_category,
    $fund_objective_category,
    $rating,
    $issuer_code,
    $display_code,
    $product_type,
    $with_warranty,
    $is_fixed_rate,
    $val_yield_exercise,
    $val_yield_maturity,
    $val_clean_price_exercise,
    $val_clean_price_maturity,
    $val_modified_duration,
    $val_convexity,
    $val_basis_point_value,
    $csi_yield_exercise,
    $csi_yield_maturity,
    $csi_clean_price_exercise,
    $csi_clean_price_maturity,
    $csi_full_price_exercise,
    $csi_full_price_maturity,
    $repayment_method,
    $first_maturity_date,
    $option_type,
    $call_str,
    $put_str
) on conflict(ficc_id) where sync_version <= $sync_version do update set
    enable = $enable,
    sync_version = $sync_version,
    key_market = $key_market,
    code_market = $code_market,
    bond_code = $bond_code,
    bond_key = $bond_key,
    listed_market = $listed_market,
    listed_date = $listed_date,
    delisted_date = $delisted_date,
    full_name = $full_name,
    short_name = $short_name,
    pinyin = $pinyin,
    pinyin_full = $pinyin_full,
    bond_category = $bond_category,
    fr_type = $fr_type,
    perp_type = $perp_type,
    has_option = $has_option,
    interest_start_date = $interest_start_date,
    maturity_date = $maturity_date,
    maturity_is_holiday = $maturity_is_holiday,
    next_coupon_date = $next_coupon_date,
    option_date = $option_date,
    coupon_rate_current = $coupon_rate_current,
    issue_rate = $issue_rate,
    issue_amount = $issue_amount,
    redemption_no = $redemption_no,
    implied_rating = $implied_rating,
    issuer_rating = $issuer_rating,
    is_cross_mkt = $is_cross_mkt,
    mkt_type = $mkt_type,
    time_to_maturity = $time_to_maturity,
    conversion_rate = $conversion_rate,
    fund_objective_sub_category = $fund_objective_sub_category,
    fund_objective_category = $fund_objective_category,
    rating = $rating,
    issuer_code = $issuer_code,
    display_code = $display_code,
    product_type = $product_type,
    with_warranty = $with_warranty,
    is_fixed_rate = $is_fixed_rate,
    val_yield_exercise = $val_yield_exercise,
    val_yield_maturity = $val_yield_maturity,
    val_clean_price_exercise = $val_clean_price_exercise,
    val_clean_price_maturity = $val_clean_price_maturity,
    val_modified_duration = $val_modified_duration,
    val_convexity = $val_convexity,
    val_basis_point_value = $val_basis_point_value,
    csi_yield_exercise = $csi_yield_exercise,
    csi_yield_maturity = $csi_yield_maturity,
    csi_clean_price_exercise = $csi_clean_price_exercise,
    csi_clean_price_maturity = $csi_clean_price_maturity,
    csi_full_price_exercise = $csi_full_price_exercise,
    csi_full_price_maturity = $csi_full_price_maturity,
    repayment_method = $repayment_method,
    first_maturity_date = $first_maturity_date,
    option_type = $option_type,
    call_str = $call_str,
    put_str = $put_str
`;

const fuzzyWhere = `(
bond_detail.pinyin LIKE $fuzzy
OR bond_detail.pinyin_full LIKE $fuzzy
OR bond_detail.short_name LIKE $fuzzy
OR bond_detail.bond_code LIKE $fuzzy
)`;

const fuzzyIDCWhere = `(
  bond_detail.pinyin LIKE $fuzzy
  OR bond_detail.pinyin_full LIKE $fuzzy
  OR bond_detail.short_name LIKE $fuzzy
  OR bond_detail.full_name LIKE $fuzzy
  OR bond_detail.bond_code LIKE $fuzzy
  )`;

const fuzzyOrder = `(
CASE
  WHEN bond_detail.pinyin LIKE $precise THEN 1
  ELSE CASE
    WHEN bond_detail.pinyin_full LIKE $precise THEN 2
    ELSE CASE
      WHEN bond_detail.short_name LIKE $precise THEN 3
      ELSE CASE
        WHEN bond_detail.full_name LIKE $precise THEN 4
        ELSE CASE
          WHEN bond_detail.bond_code LIKE $precise THEN 5
          ELSE CASE
            WHEN bond_detail.pinyin LIKE $fuzzy THEN 6
            ELSE CASE
              WHEN bond_detail.pinyin_full LIKE $fuzzy THEN 7
              ELSE CASE
                WHEN bond_detail.short_name LIKE $fuzzy THEN 8
                ELSE CASE
                  WHEN bond_detail.full_name LIKE $fuzzy THEN 9
                  ELSE CASE
                    WHEN bond_detail.bond_code LIKE $fuzzy THEN 10
                    ELSE 11
                  END
                END
              END
            END
          END
        END
      END
    END
  END
END) AS matching_order`;

const getByKeyMarketList = 'select * from bond_detail where enable = 1 and key_market in ';

const remove = `update bond_detail
set enable = 2, sync_version = $sync_version
where ficc_id = $ficc_id
RETURNING ficc_id, key_market`;

const dropTable = 'DROP TABLE IF EXISTS bond_detail';

const hardDeleteDisabledList = 'DELETE FROM bond_detail WHERE enable != 1';

const getLastVersion = 'select sync_version from bond_detail order by sync_version desc limit 1';

const getTotal = 'select count(*) as total from bond_detail where enable = 1';

export const bondDetailSql = {
  createTable,
  upsert,
  fuzzyWhere,
  fuzzyIDCWhere,
  fuzzyOrder,
  remove,
  dropTable,
  getByKeyMarketList,
  hardDeleteDisabledList,
  getLastVersion,
  getTotal
};
