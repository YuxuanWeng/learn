const createTable = `
create table if not exists quote_draft_detail(
    detail_id                 varchar(64)     default ''  not null  primary key,
    message_id                varchar(64)     default ''  not null,
    corresponding_line        tinyint         default 0   not null,
    side                      tinyint         default 0   not null,
    key_market                varchar(64)     default ''  not null,
    quote_type                tinyint         default 0   not null,
    price                     decimal(20, 14) default -1  not null,
    volume                    decimal(20, 14) default -1  not null,
    return_point              decimal(20, 14) default -1  not null,
    flag_rebate               tinyint         default 0   not null,
    flag_star                 tinyint         default 0   not null,
    flag_package              tinyint         default 0   not null,
    flag_oco                  tinyint         default 0   not null,
    flag_exchange             tinyint         default 0   not null,
    flag_intention            tinyint         default 0   not null,
    flag_indivisible          tinyint         default 0   not null,
    flag_stock_exchange       tinyint         default 0   not null,
    flag_bilateral            tinyint         default 0   not null,
    flag_request              tinyint         default 0   not null,
    flag_urgent               tinyint         default 0   not null,
    flag_internal             tinyint         default 0   not null,
    flag_recommend            tinyint         default 0   not null,
    liquidation_speed_list    json                        not null,
    comment                   varchar(256)    default ''  not null,
    is_exercise               tinyint         default 0   not null,
    exercise_manual           tinyint         default 0   not null,
    status                    tinyint         default 0   not null,
    creator                   varchar(64)     default ''  not null,
    operator                  varchar(64)     default ''  not null,
    sync_version              varchar(32)     default ''  not null,
    enable                    tinyint         default 0   not null,
    create_time               varchar(32)     default ''  not null,
    update_time               varchar(32)     default ''  not null,
    product_type              tinyint         default 0   not null,
    flag_inverted             tinyint         default 0   not null,
    former_detail_id          varchar(64)     default ''  not null
)`;

const upsert = `
insert into quote_draft_detail values(
    $detail_id,
    $message_id,
    $corresponding_line,
    $side,
    $key_market,
    $quote_type,
    $price,
    $volume,
    $return_point,
    $flag_rebate,
    $flag_star,
    $flag_package,
    $flag_oco,
    $flag_exchange,
    $flag_intention,
    $flag_indivisible,
    $flag_stock_exchange,
    $flag_bilateral,
    $flag_request,
    $flag_urgent,
    $flag_internal,
    $flag_recommend,
    $liquidation_speed_list,
    $comment,
    $is_exercise,
    $exercise_manual,
    $status,
    $creator,
    $operator,
    $sync_version,
    $enable,
    $create_time,
    $update_time,
    $product_type,
    $flag_inverted,
    $former_detail_id
) on conflict(detail_id) where sync_version <= $sync_version do update set
    message_id = $message_id,
    corresponding_line = $corresponding_line,
    side = $side,
    key_market = $key_market,
    quote_type = $quote_type,
    price = $price,
    volume = $volume,
    return_point = $return_point,
    flag_rebate = $flag_rebate,
    flag_star = $flag_star,
    flag_package = $flag_package,
    flag_oco = $flag_oco,
    flag_exchange = $flag_exchange,
    flag_intention = $flag_intention,
    flag_indivisible = $flag_indivisible,
    flag_stock_exchange = $flag_stock_exchange,
    flag_bilateral = $flag_bilateral,
    flag_request = $flag_request,
    flag_urgent = $flag_urgent,
    flag_internal = $flag_internal,
    flag_recommend = $flag_recommend,
    liquidation_speed_list = $liquidation_speed_list,
    comment = $comment,
    is_exercise = $is_exercise,
    exercise_manual = $exercise_manual,
    status = $status,
    creator = $creator,
    operator = $operator,
    sync_version = $sync_version,
    enable = $enable,
    create_time = $create_time,
    update_time = $update_time,
    product_type = $product_type,
    flag_inverted = $flag_inverted,
    former_detail_id = $former_detail_id
`;

const remove = `update quote_draft_detail
set enable = 2, sync_version = $sync_version
where detail_id = $detail_id
RETURNING detail_id, message_id`;

const dropTable = 'DROP TABLE IF EXISTS quote_draft_detail';

const hardDeleteDisabledList = 'DELETE FROM quote_draft_detail WHERE enable != 1';

const getLastVersion = 'select sync_version from quote_draft_detail order by sync_version desc limit 1';

const getTotal = 'select count(*) as total from quote_draft_detail where enable = 1';

export const quoteDraftDetailSql = {
  createTable,
  upsert,
  remove,
  dropTable,
  hardDeleteDisabledList,
  getLastVersion,
  getTotal
};
