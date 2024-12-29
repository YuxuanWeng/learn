const createTable = `
create table if not exists user(
    user_id         varchar(64)    default ''  not null  primary key ,
    name_cn         varchar(64)    default ''  not null,
    name_en         varchar(64)    default ''  not null,
    account         varchar(64)    default ''  not null,
    post            tinyint        default 0   not null,
    qq              varchar(255)   default ''  not null,
    qm_account      varchar(64)    default ''  not null,
    product_codes   json                       not null,
    pinyin          varchar(64)    default ''  not null,
    pinyin_full     varchar(255)   default ''  not null,
    email           varchar(64)    default ''  not null,
    phone           varchar(64)    default ''  not null,
    telephone       varchar(64)    default ''  not null,
    job_num         varchar(64)    default ''  not null,
    enable          tinyint        default 0   not null,
    sync_version    varchar(32)    default ''  not null,
    update_time     varchar(32)    default ''  not null,
    job_status      tinyint        default 0   not null,
    account_status  tinyint        default 0   not null
)`;

const upsert = `
insert into user values(
    $user_id,
    $name_cn,
    $name_en,
    $account,
    $post,
    $qq,
    $qm_account,
    $product_codes,
    $pinyin,
    $pinyin_full,
    $email,
    $phone,
    $telephone,
    $job_num,
    $enable,
    $sync_version,
    $update_time,
    $job_status,
    $account_status
) on conflict(user_id) where sync_version <= $sync_version do update set
    name_cn = $name_cn,
    name_en = $name_en,
    account = $account,
    post = $post,
    qq = $qq,
    qm_account = $qm_account,
    product_codes = $product_codes,
    pinyin = $pinyin,
    pinyin_full = $pinyin_full,
    email = $email,
    phone = $phone,
    telephone = $telephone,
    job_num = $job_num,
    enable = $enable,
    sync_version = $sync_version,
    update_time = $update_time,
    job_status = $job_status,
    account_status = $account_status
`;

const remove = `update user
set enable = 2, sync_version = $sync_version
where user_id = $user_id
RETURNING user_id`;

const preciseWhere = `(
user.pinyin LIKE $precise
OR user.pinyin_full LIKE $precise
OR user.name_cn LIKE $precise
OR user.account LIKE $precise
)`;

const fuzzyWhere = `(
user.pinyin LIKE $fuzzy
OR user.pinyin_full LIKE $fuzzy
OR user.name_cn LIKE $fuzzy
OR user.account LIKE $fuzzy
)`;

const preciseOrder = `(
CASE
  WHEN user.pinyin LIKE $precise THEN 1
  ELSE CASE
    WHEN user.pinyin_full LIKE $precise THEN 2
    ELSE CASE
      WHEN user.name_cn LIKE $precise THEN 3
      ELSE CASE
        WHEN user.account LIKE $precise THEN 4
        ELSE 5
      END
    END
  END
END) AS matching_order`;

const fuzzyOrder = `(
CASE
  WHEN user.pinyin LIKE $precise THEN 1
  ELSE CASE
    WHEN user.pinyin_full LIKE $precise THEN 2
    ELSE CASE
      WHEN user.name_cn LIKE $precise THEN 3
      ELSE CASE
        WHEN user.account LIKE $precise THEN 4
        ELSE CASE
          WHEN user.pinyin LIKE $fuzzy THEN 5
          ELSE CASE
            WHEN user.pinyin_full LIKE $fuzzy THEN 6
            ELSE CASE
              WHEN user.name_cn LIKE $fuzzy THEN 7
              ELSE CASE
                WHEN user.account LIKE $fuzzy THEN 8
                ELSE 9
              END
            END
          END
        END
      END
    END
  END
END) AS matching_order`;

const dropTable = 'DROP TABLE IF EXISTS user';

const hardDeleteDisabledList = 'DELETE FROM user WHERE enable != 1';

const getLastVersion = 'select sync_version from user order by sync_version desc limit 1';

const getTotal = 'select count(*) as total from user where enable = 1';

export const userSql = {
  createTable,
  upsert,
  remove,
  preciseWhere,
  fuzzyWhere,
  fuzzyOrder,
  preciseOrder,
  dropTable,
  hardDeleteDisabledList,
  getLastVersion,
  getTotal
};
