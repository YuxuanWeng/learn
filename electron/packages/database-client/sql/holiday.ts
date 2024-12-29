const createTable = `
create table if not exists holiday(
    holiday_id      varchar(64)    default ''   not null    primary key,
    enable          tinyint        default 0    not null,
    update_time     varchar(32)    default ''   not null,
    sync_version    varchar(32)    default ''   not null,
    holiday_date    varchar(32)    default ''   not null,
    country         varchar(4)     default ''   not null,
    market_type     varchar(16)    default ''   not null,
    holiday_name    varchar(32)    default ''   not null
)`;

const upsert = `
insert into holiday values(
    $holiday_id,
    $enable,
    $update_time,
    $sync_version,
    $holiday_date,
    $country,
    $market_type,
    $holiday_name
) on conflict(holiday_id) where sync_version <= $sync_version do update set
    enable = $enable,
    update_time = $update_time,
    sync_version = $sync_version,
    holiday_date = $holiday_date,
    country = $country,
    market_type = $market_type,
    holiday_name = $holiday_name
`;

const remove = `update holiday
set enable = 2, sync_version = $sync_version
where holiday_id = $holiday_id
RETURNING holiday_id`;

const getHolidaysByMarketType =
  'select holiday_date from holiday where enable = 1 and market_type = $market_type order by holiday_date asc';

const dropTable = 'DROP TABLE IF EXISTS holiday';

const hardDeleteDisabledList = 'DELETE FROM holiday WHERE enable != 1';

const getLastVersion = 'select sync_version from holiday order by sync_version desc limit 1';

const getTotal = 'select count(*) as total from holiday where enable = 1';

export const holidaySql = {
  createTable,
  upsert,
  remove,
  getHolidaysByMarketType,
  dropTable,
  hardDeleteDisabledList,
  getLastVersion,
  getTotal
};
