import { DataSource } from '@prisma/generator-helper';
import { logger } from '@prisma/sdk';
import { join } from 'path';
import { getSqlServerConnectionString } from './getSqlServerConnectionString';

export function getConnectionString(datasource: DataSource): string {
  if (!datasource) {
    throw new Error('No datasource specified. I need a datasource in order to construct the DbContext. The DbContext will need to setup the connection in the `OnConfiguring` life cycle hook.');
  }
  switch (datasource.provider) {
    case 'mysql':
    case 'postgres' as any:
    case 'postgresql':
      return getMysqlOrPostgresqlConnectionString(datasource);
    case 'sqlite':
      return getSqliteConnectionString(datasource);
    case 'sqlserver':
      return getSqlServerConnectionString(datasource);
    default:
      throw new Error(`Unrecognized or unsupported datasource provider ${datasource.provider}`);
  }
}

function getMysqlOrPostgresqlConnectionString(datasource: DataSource): string {
  const conn_str_fmt: RegExp = /\w+:\/\/((?<user>[\w_\d\s]+)(\:(?<password>.*))?@)?(?<host>.*)\:(?<port>\d{4,5})(\/(?<initial_db>.*))?/;
  const raw_conn_str = getUrl(datasource);
  const matches = conn_str_fmt.exec(raw_conn_str);
  if (!matches) {
    throw new Error(`Connection string could not be parsed: ${raw_conn_str}`);
  }
  let conn_str = `Host=${matches!.groups!.host!};Database=${matches!.groups!.initial_db!};`;
  if (matches!.groups!.user) {
    conn_str += `Username=${matches!.groups!.user!};`;
  }
  if (matches!.groups!.password) {
    conn_str += `Password=${matches!.groups!.password!};`;
  }

  return conn_str;
}

function getSqliteConnectionString(datasource: DataSource): string {
  const conn_str_fmt: RegExp = /file\:(?<db_path>.*)/;
  const raw_conn_str = getUrl(datasource);
  const matches = conn_str_fmt.exec(raw_conn_str);
  if (!matches) {
    throw new Error(`Connection string could not be parsed: ${raw_conn_str}`);
  }
  return `Data Source=${matches!.groups!.db_path!};`;
}

export function getUrl(datasource: DataSource): string {
  return (datasource.url.fromEnvVar)
    ? process.env[datasource.url.fromEnvVar]!
    : datasource.url.value
    ;
}