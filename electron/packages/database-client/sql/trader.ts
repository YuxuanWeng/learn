const createTable = `
create table if not exists trader(
    trader_id           varchar(64)     default ''  not null  primary key,
    name_zh             varchar(32)     default ''  not null,
    pinyin              varchar(1024)   default ''  not null,
    pinyin_full         varchar(2048)   default ''  not null,
    name_en             varchar(32)     default ''  not null,
    code                varchar(32)     default ''  not null,
    department          varchar(32)     default ''  not null,
    position            varchar(32)     default ''  not null,
    qq                  json                        not null,
    product_codes       json                        not null,
    tags                json                        not null,
    inst_id             varchar(64)     default ''  not null,
    broker_ids          json                        not null,
    qm_account          varchar(64)     default ''  not null,
    white_list          json                        not null,
    update_time         varchar(32)     default ''  not null,
    product_marks       json                        not null,
    default_broker_list json                        not null,
    sync_version        varchar(32)     default ''  not null,
    enable              tinyint         default 0   not null,
    job_status          tinyint         default 0   not null,
    usage_status        tinyint         default 0   not null
)`;

const upsert = `
insert into trader values(
    $trader_id,
    $name_zh,
    $pinyin,
    $pinyin_full,
    $name_en,
    $code,
    $department,
    $position,
    $qq,
    $product_codes,
    $tags,
    $inst_id,
    $broker_ids,
    $qm_account,
    $white_list,
    $update_time,
    $product_marks,
    $default_broker_list,
    $sync_version,
    $enable,
    $job_status,
    $usage_status
) on conflict(trader_id) where sync_version <= $sync_version do update set
    name_zh = $name_zh,
    pinyin = $pinyin,
    pinyin_full = $pinyin_full,
    name_en = $name_en,
    code = $code,
    department = $department,
    position = $position,
    qq = $qq,
    product_codes = $product_codes,
    tags = $tags,
    inst_id = $inst_id,
    broker_ids = $broker_ids,
    qm_account = $qm_account,
    white_list = $white_list,
    update_time = $update_time,
    product_marks = $product_marks,
    default_broker_list = $default_broker_list,
    sync_version = $sync_version,
    enable = $enable,
    job_status = $job_status,
    usage_status = $usage_status
`;

const remove = `update trader
set enable = 2, sync_version = $sync_version
where trader_id = $trader_id
RETURNING trader_id`;

const preciseWhere = `(
trader.pinyin LIKE $precise
OR trader.pinyin_full LIKE $precise
OR trader.name_zh LIKE LIKE $precise
OR trader.code LIKE $precise
)`;

const fuzzyWhere = `(
trader.pinyin LIKE $fuzzy
OR trader.pinyin_full LIKE $fuzzy
OR trader.name_zh LIKE $fuzzy
OR trader.code LIKE $fuzzy
)`;

const preciseOrder = `
CASE
  WHEN trader.pinyin LIKE $precise THEN 1
  ELSE CASE
    WHEN trader.pinyin_full LIKE $precise THEN 2
    ELSE CASE
      WHEN trader.name_zh LIKE $precise THEN 3
      ELSE CASE
        WHEN trader.code LIKE $precise THEN 4
        ELSE 5
      END
    END
  END
END) AS matching_order
`;

const fuzzyOrder = `(
CASE
  WHEN trader.pinyin LIKE $precise THEN 1
  ELSE CASE
    WHEN trader.pinyin_full LIKE $precise THEN 2
    ELSE CASE
      WHEN trader.name_zh LIKE $precise THEN 3
      ELSE CASE
        WHEN trader.code LIKE $precise THEN 4
        ELSE CASE
          WHEN trader.pinyin LIKE $fuzzy THEN 5
          ELSE CASE
            WHEN trader.pinyin_full LIKE $fuzzy THEN 6
            ELSE CASE
              WHEN trader.name_zh LIKE $fuzzy THEN 7
              ELSE CASE
                WHEN trader.code LIKE $fuzzy THEN 8
                ELSE 9
              END
            END
          END
        END
      END
    END
  END
END) AS matching_order`;

const dropTable = 'DROP TABLE IF EXISTS trader';

const hardDeleteDisabledList = 'DELETE FROM trader WHERE enable != 1';

const getLastVersion = 'select sync_version from trader order by sync_version desc limit 1';

const getTotal = 'select count(*) as total from trader where enable = 1';

export const traderSql = {
  createTable,
  upsert,
  remove,
  fuzzyWhere,
  dropTable,
  fuzzyOrder,
  preciseOrder,
  preciseWhere,
  hardDeleteDisabledList,
  getLastVersion,
  getTotal
};
