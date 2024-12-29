const createTable = `
create table if not exists quote_draft_message(
    message_id        varchar(64)   default ''  not null  primary key,
    create_time       varchar(32)   default ''  not null,
    update_time       varchar(32)   default ''  not null,
    inst_id           varchar(64)   default ''  not null,
    trader_id         varchar(64)   default ''  not null,
    broker_id         varchar(64)   default ''  not null,
    text_list         json                      not null,
    img_url           varchar(256)  default ''  not null,
    creator           varchar(64)   default ''  not null,
    operator          varchar(64)   default ''  not null,
    trader_tag        varchar(64)   default ''  not null,
    sync_version      varchar(32)   default ''  not null,
    enable            tinyint       default 0   not null,
    product_type      tinyint       default 0   not null,
    detail_order_list json                      not null,
    modified_status   tinyint       default 0   not null,
    source            tinyint       default 0   not null,
    status            tinyint       default 0   not null,
    img_name          varchar(128)  default ''  not null
)`;

const upsert = `
insert into quote_draft_message values(
    $message_id,
    $create_time,
    $update_time,
    $inst_id,
    $trader_id,
    $broker_id,
    $text_list,
    $img_url,
    $creator,
    $operator,
    $trader_tag,
    $sync_version,
    $enable,
    $product_type,
    $detail_order_list,
    $modified_status,
    $source,
    $status,
    $img_name
    ) on conflict(message_id) where sync_version <= $sync_version do update set
    create_time = $create_time,
    update_time = $update_time,
    inst_id = $inst_id,
    trader_id = $trader_id,
    broker_id = $broker_id,
    text_list = $text_list,
    img_url = $img_url,
    creator = $creator,
    operator = $operator,
    trader_tag = $trader_tag,
    sync_version = $sync_version,
    enable = $enable,
    product_type = $product_type,
    detail_order_list = $detail_order_list,
    modified_status = $modified_status,
    source = $source,
    status = $status,
    img_name = $img_name
`;

const remove = `update quote_draft_message
set enable = 2, sync_version = $sync_version
where message_id = $message_id
RETURNING message_id`;

const dropTable = 'DROP TABLE IF EXISTS quote_draft_message';

const hardDeleteDisabledList = 'DELETE FROM quote_draft_message WHERE enable != 1';

const getLastVersion = 'select sync_version from quote_draft_message order by sync_version desc limit 1';

const getTotal = 'select count(*) as total from quote_draft_message where enable = 1';

export const quoteDraftMessageSql = {
  createTable,
  upsert,
  remove,
  dropTable,
  hardDeleteDisabledList,
  getLastVersion,
  getTotal
};
