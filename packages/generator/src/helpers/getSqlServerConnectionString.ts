import { DataSource } from '@prisma/generator-helper';
import { getUrl } from './getConnectionString';

export function getSqlServerConnectionString(datasource: DataSource): string {
  const config: { [key: string]: string; } = {};
  const raw_conn_str = getUrl(datasource);
  const [db, ...conn_props] = raw_conn_str.split(';');
  config.host = db.replace('sqlserver://', '');

  for (const prop of conn_props) {
    let [key, value] = prop.split('=');
    key = key.replace(/[ _]/, '');
    config[key.toLowerCase()] = value;
  }
  let conn_str;
  if (config.hasOwnProperty('integratedsecurity')) {
    const db = config.initialcatalog ?? config.database;
    const trust_cert = config.trustedcertificate;

    conn_str = `Server=${config.host};`;
    conn_str += (db && `Database=${db};`) || '';
    conn_str += `Integrated Security=${config.integratedsecurity};`;
    conn_str += (trust_cert && `Trust Server Certificate=${trust_cert};`) || '';
  } else {
    const db = config.initialcatalog ?? config.database;
    const user = config.user ?? config.username;
    const pass = config.pass ?? config.password;
    const encrypt = config.encrypt ?? config.encrypted;

    conn_str = `Host=${config.host};`;
    conn_str += (db && `Database=${db};`) || '';
    conn_str += (user && `Username=${user};`) || '';
    conn_str += (pass && `Password=${pass};`) || '';
    conn_str += (encrypt && `Encrypt=${encrypt};`) || '';
  }
  return conn_str;
  // const host_fmt: RegExp = /^sqlserver:\/\/(?<host>.*)(\:(?<port>\d{4,5}))?\;(database|Database|DATABASE)\=(?<initial_db>.*)\;(user|User|USER)\=(?<user>.*)\;(password|Password|PASSWORD)\=(?<password>.*)\;(encrypt|Encrypt|ENCRYPT)\=(?<encrypted>(true|false))(\;)?$/;
  // const raw_conn_str = getUrl(datasource);
  // const matches = host_fmt.exec(raw_conn_str);
  // if (!matches) {
  //   const backup_fmt = /^sqlserver:\/\/(?<host>.*)(\:(?<port>\d{4,5}))?\;(database|Database|DATABASE)\=(?<initial_db>.*)\;((trusted|Trusted|TRUSTED)[ _](connection|Connection|CONNECTION))\=(?<trusted_connection>(true|True|TRUE|false|False|FALSE))/;
  //   const backup_matches = backup_fmt.exec(raw_conn_str);
  //   if (!backup_matches) {
  //     throw new Error(`Connection string could not be parsed: ${raw_conn_str}`);
  //   }
  //   return `Server=${backup_matches!.groups!.host!};Database=${backup_matches!.groups!.initial_db!};Trusted_Connection=${backup_matches!.groups!.trusted_connection!}`;
  // }
  // return `Host=${matches!.groups!.host!}:${matches!.groups!.port!};Database=${matches!.groups!.initial_db!};Username=${matches!.groups!.user!};Password=${matches!.groups!.password!};Encrypt=${matches!.groups!.encrypted!}`;
}