const createTable = `
create table if not exists deal_info(
    deal_id                       varchar(64)     default ''  not null    primary key,
    internal_code                 varchar(64)     default ''  not null,
    create_time                   varchar(32)     default ''  not null,
    update_time                   varchar(32)     default ''  not null,
    confirm_time                  varchar(32)     default ''  not null,
    deal_type                     tinyint         default 0   not null,
    source                        tinyint         default 0   not null,
    flag_bridge                   tinyint         default 0   not null,
    send_order_msg                varchar(256)    default ''  not null,
    bid_send_order_msg            varchar(256)    default ''  not null,
    ofr_send_order_msg            varchar(256)    default ''  not null,
    bond_key_market               varchar(64)     default ''  not null,
    confirm_volume                decimal(15, 6)  default 0   not null,
    price_type                    tinyint         default 0   not null,
    price                         decimal(20, 14) default -1  not null,
    yield                         decimal(20, 14) default -1  not null,
    clean_price                   decimal(20, 14) default -1  not null,
    full_price                    decimal(20, 14) default -1  not null,
    return_point                  decimal(20, 14) default -1  not null,
    bid_settlement_type           json                        not null,
    bid_traded_date               varchar(32)     default ''  not null,
    bid_delivery_date             varchar(32)     default ''  not null,
    ofr_settlement_type           json                        not null,
    ofr_traded_date               varchar(32)     default ''  not null,
    ofr_delivery_date             varchar(32)     default ''  not null,
    flag_stock_exchange           tinyint         default 0   not null,
    exercise_type                 tinyint         default 0   not null,
    deal_status                   tinyint         default 0   not null,
    bid_inst_id                   varchar(64)     default ''  not null,
    bid_trader_id                 varchar(64)     default ''  not null,
    bid_broker_id                 varchar(64)     default ''  not null,
    flag_bid_modify_brokerage     tinyint         default 0   not null,
    bid_confirm_status            tinyint         default 0   not null,
    ofr_inst_id                   varchar(64)     default ''  not null,
    ofr_trader_id                 varchar(64)     default ''  not null,
    ofr_broker_id                 varchar(64)     default ''  not null,
    flag_ofr_modify_brokerage     tinyint         default 0   not null,
    ofr_confirm_status            tinyint         default 0   not null,
    spot_pricing_record_id        varchar(64)     default ''  not null,
    flag_internal                 tinyint         default 0   not null,
    operator                      varchar(64)     default ''  not null,
    listed_market                 varchar(3)      default ''  not null,
    bid_bridge_record_id          varchar(64)     default ''  not null,
    ofr_bridge_record_id          varchar(64)     default ''  not null,
    im_msg_text                   varchar(1024)   default ''  not null,
    im_msg_send_status            tinyint         default 0   not null,
    im_msg_record_id              varchar(64)     default ''  not null,
    quote_id                      varchar(64)     default ''  not null,
    spot_pricing_volume           decimal(15, 6)  default 0   not null,
    remain_volume                 decimal(15, 6)  default 0   not null,
    bid_old_content               json                        not null,
    ofr_old_content               json                        not null,
    bid_deal_read_status          tinyint         default 0   not null,
    ofr_deal_read_status          tinyint         default 0   not null,
    exercise_manual               tinyint         default 0   not null,
    flag_bid_bridge_hide_comment  tinyint         default 0   not null,
    flag_ofr_bridge_hide_comment  tinyint         default 0   not null,
    bid_bridge_send_order_comment varchar(255)    default ''  not null,
    ofr_bridge_send_order_comment varchar(255)    default ''  not null,
    enable                        tinyint         default 0   not null,
    sync_version                  varchar(32)     default ''  not null,
    bid_modify_brokerage_reason   varchar(128)    default ''  not null,
    ofr_modify_brokerage_reason   varchar(128)    default ''  not null,
    hand_over_status              tinyint         default 0   not null,
    bid_brokerage_comment         tinyint         default 0   not null,
    ofr_brokerage_comment         tinyint         default 0   not null,
    bid_trader_tag                varchar(64)     default ''  not null,
    ofr_trader_tag                varchar(64)     default ''  not null,
    bid_broker_id_b               varchar(64)     default ''  not null,
    bid_broker_id_c               varchar(64)     default ''  not null,
    bid_broker_id_d               varchar(64)     default ''  not null,
    ofr_broker_id_b               varchar(64)     default ''  not null,
    ofr_broker_id_c               varchar(64)     default ''  not null,
    ofr_broker_id_d               varchar(64)     default ''  not null,
    flag_reverse_sync             tinyint         default 0   not null,
    flag_unrefer_quote            tinyint         default 0   not null,
    flag_deal_has_changed         tinyint         default 0   not null,
    bid_add_bridge_operator_id    varchar(64)     default ''  not null,
    ofr_add_bridge_operator_id    varchar(64)     default ''  not null,
    flag_bid_pay_for_inst         tinyint         default 0   not null,
    flag_ofr_pay_for_inst         tinyint         default 0   not null,
    bridge_list                   varchar(255)    default ''  not null,
    product_type                  tinyint         default 0   not null
)`;

const upsert = `
insert into deal_info values(
    $deal_id,
    $internal_code,
    $create_time,
    $update_time,
    $confirm_time,
    $deal_type,
    $source,
    $flag_bridge,
    $send_order_msg,
    $bid_send_order_msg,
    $ofr_send_order_msg,
    $bond_key_market,
    $confirm_volume,
    $price_type,
    $price,
    $yield,
    $clean_price,
    $full_price,
    $return_point,
    $bid_settlement_type,
    $bid_traded_date,
    $bid_delivery_date,
    $ofr_settlement_type,
    $ofr_traded_date,
    $ofr_delivery_date,
    $flag_stock_exchange,
    $exercise_type,
    $deal_status,
    $bid_inst_id,
    $bid_trader_id,
    $bid_broker_id,
    $flag_bid_modify_brokerage,
    $bid_confirm_status,
    $ofr_inst_id,
    $ofr_trader_id,
    $ofr_broker_id,
    $flag_ofr_modify_brokerage,
    $ofr_confirm_status,
    $spot_pricing_record_id,
    $flag_internal,
    $operator,
    $listed_market,
    $bid_bridge_record_id,
    $ofr_bridge_record_id,
    $im_msg_text,
    $im_msg_send_status,
    $im_msg_record_id,
    $quote_id,
    $spot_pricing_volume,
    $remain_volume,
    $bid_old_content,
    $ofr_old_content,
    $bid_deal_read_status,
    $ofr_deal_read_status,
    $exercise_manual,
    $flag_bid_bridge_hide_comment,
    $flag_ofr_bridge_hide_comment,
    $bid_bridge_send_order_comment,
    $ofr_bridge_send_order_comment,
    $enable,
    $sync_version,
    $bid_modify_brokerage_reason,
    $ofr_modify_brokerage_reason,
    $hand_over_status,
    $bid_brokerage_comment,
    $ofr_brokerage_comment,
    $bid_trader_tag,
    $ofr_trader_tag,
    $bid_broker_id_b,
    $bid_broker_id_c,
    $bid_broker_id_d,
    $ofr_broker_id_b,
    $ofr_broker_id_c,
    $ofr_broker_id_d,
    $flag_reverse_sync,
    $flag_unrefer_quote,
    $flag_deal_has_changed,
    $bid_add_bridge_operator_id,
    $ofr_add_bridge_operator_id,
    $flag_bid_pay_for_inst,
    $flag_ofr_pay_for_inst,
    $bridge_list,
    $product_type
) on conflict(deal_id) where sync_version <= $sync_version do update set
    internal_code = $internal_code,
    create_time = $create_time,
    update_time = $update_time,
    confirm_time = $confirm_time,
    deal_type = $deal_type,
    source = $source,
    flag_bridge = $flag_bridge,
    send_order_msg = $send_order_msg,
    bid_send_order_msg = $bid_send_order_msg,
    ofr_send_order_msg = $ofr_send_order_msg,
    bond_key_market = $bond_key_market,
    confirm_volume = $confirm_volume,
    price_type = $price_type,
    price = $price,
    yield = $yield,
    clean_price = $clean_price,
    full_price = $full_price,
    return_point = $return_point,
    bid_settlement_type = $bid_settlement_type,
    bid_traded_date = $bid_traded_date,
    bid_delivery_date = $bid_delivery_date,
    ofr_settlement_type = $ofr_settlement_type,
    ofr_traded_date = $ofr_traded_date,
    ofr_delivery_date = $ofr_delivery_date,
    flag_stock_exchange = $flag_stock_exchange,
    exercise_type = $exercise_type,
    deal_status = $deal_status,
    bid_inst_id = $bid_inst_id,
    bid_trader_id = $bid_trader_id,
    bid_broker_id = $bid_broker_id,
    flag_bid_modify_brokerage = $flag_bid_modify_brokerage,
    bid_confirm_status = $bid_confirm_status,
    ofr_inst_id = $ofr_inst_id,
    ofr_trader_id = $ofr_trader_id,
    ofr_broker_id = $ofr_broker_id,
    flag_ofr_modify_brokerage = $flag_ofr_modify_brokerage,
    ofr_confirm_status = $ofr_confirm_status,
    spot_pricing_record_id = $spot_pricing_record_id,
    flag_internal = $flag_internal,
    operator = $operator,
    listed_market = $listed_market,
    bid_bridge_record_id = $bid_bridge_record_id,
    ofr_bridge_record_id = $ofr_bridge_record_id,
    im_msg_text = $im_msg_text,
    im_msg_send_status = $im_msg_send_status,
    im_msg_record_id = $im_msg_record_id,
    quote_id = $quote_id,
    spot_pricing_volume = $spot_pricing_volume,
    remain_volume = $remain_volume,
    bid_old_content = $bid_old_content,
    ofr_old_content = $ofr_old_content,
    bid_deal_read_status = $bid_deal_read_status,
    ofr_deal_read_status = $ofr_deal_read_status,
    exercise_manual = $exercise_manual,
    flag_bid_bridge_hide_comment = $flag_bid_bridge_hide_comment,
    flag_ofr_bridge_hide_comment = $flag_ofr_bridge_hide_comment,
    bid_bridge_send_order_comment = $bid_bridge_send_order_comment,
    ofr_bridge_send_order_comment = $ofr_bridge_send_order_comment,
    enable = $enable,
    sync_version = $sync_version,
    bid_modify_brokerage_reason = $bid_modify_brokerage_reason,
    ofr_modify_brokerage_reason = $ofr_modify_brokerage_reason,
    hand_over_status = $hand_over_status,
    bid_brokerage_comment = $bid_brokerage_comment,
    ofr_brokerage_comment = $ofr_brokerage_comment,
    bid_trader_tag = $bid_trader_tag,
    ofr_trader_tag = $ofr_trader_tag,
    bid_broker_id_b = $bid_broker_id_b,
    bid_broker_id_c = $bid_broker_id_c,
    bid_broker_id_d = $bid_broker_id_d,
    ofr_broker_id_b = $ofr_broker_id_b,
    ofr_broker_id_c = $ofr_broker_id_c,
    ofr_broker_id_d = $ofr_broker_id_d,
    flag_reverse_sync = $flag_reverse_sync,
    flag_unrefer_quote = $flag_unrefer_quote,
    flag_deal_has_changed = $flag_deal_has_changed,
    bid_add_bridge_operator_id = $bid_add_bridge_operator_id,
    ofr_add_bridge_operator_id = $ofr_add_bridge_operator_id,
    flag_bid_pay_for_inst = $flag_bid_pay_for_inst,
    flag_ofr_pay_for_inst = $flag_ofr_pay_for_inst,
    bridge_list = $bridge_list,
    product_type = $product_type
`;

const remove = `update deal_info
set enable = 2, sync_version = $sync_version
where deal_id = $deal_id
RETURNING deal_id`;

const dropTable = 'DROP TABLE IF EXISTS deal_info';

const hardDeleteDisabledList = 'DELETE FROM deal_info WHERE enable != 1';

const getLastVersion = 'select sync_version from deal_info order by sync_version desc limit 1';

const getTotal = 'select count(*) as total from deal_info where enable = 1';

export const dealInfoSql = {
  createTable,
  upsert,
  remove,
  dropTable,
  hardDeleteDisabledList,
  getLastVersion,
  getTotal
};