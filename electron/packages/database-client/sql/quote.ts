const createTable = `
create table if not exists quote(
    quote_id                    varchar(64)     default ""  not null  primary key,
    bond_key_market             varchar(64)     default ""  not null,
    update_time                 varchar(32)     default ""  not null,
    create_time                 varchar(32)     default ""  not null,
    product_type                tinyint         default 0   not null,
    volume                      decimal(15, 6)  default -1  not null,
    yield                       decimal(20, 14) default -1  not null,
    clean_price                 decimal(20, 14) default -1  not null,
    full_price                  decimal(20, 14) default -1  not null,
    return_point                decimal(20, 14) default -1  not null,
    flag_rebate                 tinyint         default 0   not null,
    side                        tinyint         default 0   not null,
    quote_type                  tinyint         default 0   not null,
    liquidation_speed_list      json                        not null,
    inst_id                     varchar(64)     default ""  not null,
    trader_id                   varchar(64)     default ""  not null,
    broker_id                   varchar(64)     default ""  not null,
    operator                    varchar(64)     default ""  not null,
    flag_urgent                 tinyint         default 0   not null,
    flag_star                   tinyint         default 0   not null,
    flag_package                tinyint         default 0   not null,
    flag_oco                    tinyint         default 0   not null,
    flag_exchange               tinyint         default 0   not null,
    flag_stock_exchange         tinyint         default 0   not null,
    is_exercise                 tinyint         default 0   not null,
    flag_intention              tinyint         default 0   not null,
    flag_indivisible            tinyint         default 0   not null,
    flag_stc                    tinyint         default 0   not null,
    comment                     varchar(255)    default ""  not null,
    sync_version                varchar(32)     default ""  not null,
    flag_internal               tinyint         default 0   not null,
    spread                      decimal(20, 14) default -1  not null,
    quote_price                 decimal(20, 14) default -1  not null,
    flag_request                tinyint         default 0   not null,
    flag_bilateral              tinyint         default 0   not null,
    enable                      tinyint         default 0   not null,
    trader_tag                  varchar(32)     default ""  not null,
    exercise_manual             tinyint         default 0   not null,
    deal_liquidation_speed_list json                        not null
)`;

const upsert = `
insert into quote values(
    $quote_id,
    $bond_key_market,
    $update_time,
    $create_time,
    $product_type,
    $volume,
    $yield,
    $clean_price,
    $full_price,
    $return_point,
    $flag_rebate,
    $side,
    $quote_type,
    $liquidation_speed_list,
    $inst_id,
    $trader_id,
    $broker_id,
    $operator,
    $flag_urgent,
    $flag_star,
    $flag_package,
    $flag_oco,
    $flag_exchange,
    $flag_stock_exchange,
    $is_exercise,
    $flag_intention,
    $flag_indivisible,
    $flag_stc,
    $comment,
    $sync_version,
    $flag_internal,
    $spread,
    $quote_price,
    $flag_request,
    $flag_bilateral,
    $enable,
    $trader_tag,
    $exercise_manual,
    $deal_liquidation_speed_list
) on conflict(quote_id) where sync_version <= $sync_version do update set
    bond_key_market = $bond_key_market,
    update_time = $update_time,
    create_time = $create_time,
    product_type = $product_type,
    volume = $volume,
    yield = $yield,
    clean_price = $clean_price,
    full_price = $full_price,
    return_point = $return_point,
    flag_rebate = $flag_rebate,
    side = $side,
    quote_type = $quote_type,
    liquidation_speed_list = $liquidation_speed_list,
    inst_id = $inst_id,
    trader_id = $trader_id,
    broker_id = $broker_id,
    operator = $operator,
    flag_urgent = $flag_urgent,
    flag_star = $flag_star,
    flag_package = $flag_package,
    flag_oco = $flag_oco,
    flag_exchange = $flag_exchange,
    flag_stock_exchange = $flag_stock_exchange,
    is_exercise = $is_exercise,
    flag_intention = $flag_intention,
    flag_indivisible = $flag_indivisible,
    flag_stc = $flag_stc,
    comment = $comment,
    sync_version = $sync_version,
    flag_internal = $flag_internal,
    spread = $spread,
    quote_price = $quote_price,
    flag_request = $flag_request,
    flag_bilateral = $flag_bilateral,
    enable = $enable,
    trader_tag = $trader_tag,
    exercise_manual = $exercise_manual,
    deal_liquidation_speed_list = $deal_liquidation_speed_list
`;

const remove = `update quote
set enable = 2, sync_version = $sync_version
where quote_id = $quote_id
RETURNING quote_id, bond_key_market`;

const selectByIdList = 'select * from quote where quote_id in ';

const selectById = 'select * from quote where quote_id = ? and enable = 1 limit 1';

const dropTable = 'drop table if exists quote';

const hardDeleteDisabledList = 'DELETE FROM quote WHERE enable != 1';

const getLastVersion = 'select sync_version from quote order by sync_version desc limit 1';

const getTotal = 'select count(*) as total from quote where enable = 1';

export const quoteSql = {
  createTable,
  upsert,
  remove,
  selectById,
  selectByIdList,
  dropTable,
  hardDeleteDisabledList,
  getLastVersion,
  getTotal
};
