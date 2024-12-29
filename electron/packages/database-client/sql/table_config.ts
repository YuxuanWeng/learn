const checkTableExist = `
select name from sqlite_master where type='table' and name='table_config'`;

const createTable = `
create table if not exists table_config(
    table_title       varchar(32)   default ''  not null  primary key,
    table_config_str  json                      not null
)`;

const upsert = `
insert into table_config values(
    $table_title,
    $table_config_str
) on conflict(table_title) do update set
    table_config_str = $table_config_str
`;

const getLocalConfig = 'SELECT * FROM table_config';

const dropTable = 'DROP TABLE IF EXISTS table_config';

export const tableConfigSql = {
  checkTableExist,
  createTable,
  upsert,
  getLocalConfig,
  dropTable
};
