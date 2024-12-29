const createTable = `
create table if not exists inst(
    inst_id                 varchar(64)   default ''  not null  primary key,
    standard_code           varchar(32)   default ''  not null,
    inst_type               varchar(64)   default ''  not null,
    short_name_zh           varchar(64)   default ''  not null,
    full_name_zh            varchar(64)   default ''  not null,
    short_name_en           varchar(64)   default ''  not null,
    full_name_en            varchar(64)   default ''  not null,
    pinyin                  varchar(1000) default ''  not null,
    pinyin_full             varchar(1000) default ''  not null,
    product_codes           json                      not null,
    product_short_name_set  json                      not null,
    enable                  tinyint       default 0   not null,
    sync_version            varchar(32)   default ''  not null,
    update_time             varchar(32)   default ''  not null,
    district_id             varchar(64)   default ''  not null,
    district_name           varchar(50)   default ''  not null,
    inst_status             tinyint       default 0   not null,
    usage_status            tinyint       default 0   not null
)`;

const upsert = `
insert into inst values(
    $inst_id,
    $standard_code,
    $inst_type,
    $short_name_zh,
    $full_name_zh,
    $short_name_en,
    $full_name_en,
    $pinyin,
    $pinyin_full,
    $product_codes,
    $product_short_name_set,
    $enable,
    $sync_version,
    $update_time,
    $district_id,
    $district_name,
    $inst_status,
    $usage_status
) on conflict(inst_id) where sync_version <= $sync_version do update set
    standard_code = $standard_code,
    inst_type = $inst_type,
    short_name_zh = $short_name_zh,
    full_name_zh = $full_name_zh,
    short_name_en = $short_name_en,
    full_name_en = $full_name_en,
    pinyin = $pinyin,
    pinyin_full = $pinyin_full,
    product_codes = $product_codes,
    product_short_name_set = $product_short_name_set,
    enable = $enable,
    sync_version = $sync_version,
    update_time = $update_time,
    district_id = $district_id,
    district_name = $district_name,
    inst_status = $inst_status,
    usage_status = $usage_status
`;

const remove = `update inst
set enable = 2, sync_version = $sync_version
where inst_id = $inst_id
RETURNING inst_id`;

const preciseWhere = `(
inst.pinyin LIKE $precise
OR inst.pinyin_full LIKE $precise
OR inst.short_name_zh LIKE $precise
OR inst.standard_code LIKE $precise
OR inst.full_name_zh LIKE $precise
)`;

const fuzzyWhere = `(
inst.pinyin LIKE $fuzzy
OR inst.pinyin_full LIKE $fuzzy
OR inst.short_name_zh LIKE $fuzzy
OR inst.standard_code LIKE $fuzzy
OR inst.full_name_zh LIKE $fuzzy
)`;

const preciseOrder = `
CASE
  WHEN inst.pinyin LIKE $precise THEN 1
  ELSE CASE
    WHEN inst.pinyin_full LIKE $precise THEN 2
    ELSE CASE
      WHEN inst.short_name_zh LIKE $precise THEN 3
      ELSE CASE
        WHEN inst.standard_code LIKE $precise THEN 4
        ELSE CASE
          WHEN inst.full_name_zh LIKE $precise THEN 5
          ELSE 6
        END
      END
    END
  END
END) AS matching_order
`;

const fuzzyOrder = `(
CASE
  WHEN inst.pinyin LIKE $precise THEN 1
  ELSE CASE
    WHEN inst.pinyin_full LIKE $precise THEN 2
    ELSE CASE
      WHEN inst.short_name_zh LIKE $precise THEN 3
      ELSE CASE
        WHEN inst.standard_code LIKE $precise THEN 4
        ELSE CASE
          WHEN inst.full_name_zh LIKE $precise THEN 5
          ELSE CASE
            WHEN inst.pinyin LIKE $fuzzy THEN 6
            ELSE CASE
              WHEN inst.pinyin_full LIKE $fuzzy THEN 7
              ELSE CASE
                WHEN inst.short_name_zh LIKE $fuzzy THEN 8
                ELSE CASE
                  WHEN inst.standard_code LIKE $fuzzy THEN 9
                  ELSE CASE
                    WHEN inst.full_name_zh LIKE $fuzzy THEN 10
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

const dropTable = 'DROP TABLE IF EXISTS inst';

const hardDeleteDisabledList = 'DELETE FROM inst WHERE enable != 1';

const getLastVersion = 'select sync_version from inst order by sync_version desc limit 1';

const getTotal = 'select count(*) as total from inst where enable = 1';

export const instSql = {
  createTable,
  upsert,
  remove,
  preciseWhere,
  fuzzyWhere,
  dropTable,
  preciseOrder,
  fuzzyOrder,
  hardDeleteDisabledList,
  getLastVersion,
  getTotal
};
